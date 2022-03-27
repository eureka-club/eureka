import { GetServerSideProps, NextPage } from 'next';
import { Post } from '@prisma/client';
import { getSession } from 'next-auth/client';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { workerData } from 'worker_threads';
import { Spinner } from 'react-bootstrap';
import { MySocialInfo, Session } from '../../../../src/types';
import { PostMosaicItem } from '../../../../src/types/post';
import { WorkMosaicItem } from '../../../../src/types/work';
import SimpleLayout from '../../../../src/components/layouts/SimpleLayout';
import WorkDetailComponent from '../../../../src/components/work/WorkDetail';
import { search as searchPost, isFavoritedByUser } from '../../../../src/facades/post';
import { countCycles, countPosts, find as findWork } from '../../../../src/facades/work';
import useWork,{getWork} from '../../../../src/useWork';
import usePost,{getPost} from '@/src/usePost';
import { QueryClient,dehydrate } from 'react-query';
import { WEBAPP_URL } from '../../../../src/constants';
interface Props {
  postId:number;
  workId:number;
  metaTags:any
}

const PostDetailInWorkPage: NextPage<Props> = ({postId,workId,metaTags}) => {
  const router = useRouter();
  //const [id, setId] = useState<string>('');
  //const [postId, setPostId] = useState<string>('');
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  // const [work, setWork] = useState<WorkMosaicItem>();
  // const [post, setPost] = useState<PostMosaicItem>();

  /*useEffect(() => {
    if (router.query.id) {
      setId(router.query.id as string);
    }
    if (router.query.id) {
      setPostId(router.query.postId as string);
    }
  }, [router.query]);*/

  const { data: work, isLoading: loadingWork } = useWork(+workId, { enabled: !!workId });
  const { data: post, isLoading: loadingPost } = usePost(+postId, { enabled: !!postId });
  const isLoadingData = () => {
    if (loadingWork) return true;
    if (loadingPost) return true;
    return false;
  };

  const getLayout = (children: JSX.Element, title = '') => {
    return <>
       <Head>
        <meta property="og:title" content={`${metaTags.title} · ${metaTags.workTitle}`}/>
        <meta property="og:url" content={`${WEBAPP_URL}/work/${metaTags.workId}/post/${metaTags.id}`} />
        <meta property="og:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metaTags.storedFile}`}/>
        <meta property="og:type" content='article'/>

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@EurekaClub"></meta>
        <meta name="twitter:title" content={`${metaTags.title} · ${metaTags.workTitle}`}></meta>
        {/* <meta name="twitter:description" content=""></meta>*/}
        <meta name="twitter:url" content={`${WEBAPP_URL}/work/${metaTags.workId}/post/${metaTags.id}`}></meta>
        <meta name="twitter:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metaTags.storedFile}`}></meta>
    </Head>  
     <SimpleLayout title={title}>{children}</SimpleLayout>;
     </>
  };

  if (!post || !work || isLoadingData()) return getLayout(<Spinner animation="grow" variant="info" />);
  return getLayout(
    <WorkDetailComponent workId={work.id!} post={post} />,
    `${post!.title} · ${work!.title}`,
  );

};


export const getServerSideProps:GetServerSideProps = async ({query}) => {
  const {id:wid,postId:pid} = query;
  const workId = parseInt(wid ? wid.toString():'')
  const postId = parseInt(pid ? pid.toString():'')


 let post = await getPost(postId);
 let work = await getWork(workId);
 let metaTags = {id:post?.id, workId:work?.id, title:post?.title,workTitle:work?.title, storedFile: post?.localImages[0].storedFile}

  const queryClient = new QueryClient() 
   //await queryClient.prefetchQuery(['USERS',JSON.stringify(wcu)],()=>getUsers(wcu))
   await queryClient.prefetchQuery(['WORK',`${workId}`],()=>work)
   await queryClient.prefetchQuery(['POST',`${postId}`],()=>post)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      workId,
      postId,
      metaTags:metaTags
    },
  }
}


/* 
export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  if (
    params == null ||
    params.id == null ||
    params.postId == null ||
    typeof params.id !== 'string' ||
    typeof params.postId !== 'string'
  ) {
    return { notFound: true };
  }
  const workId = parseInt(params.id, 10);
  const postId = parseInt(params.postId, 10);

  if (!Number.isInteger(workId) || !Number.isInteger(postId)) {
    return { notFound: true };
  }

  const work = await findWork(workId);
  if (work == null) {
    return { notFound: true };
  }

  const postResults = (await searchPost({
    where: JSON.stringify({
      works: { some: { id: workId } },
      id: postId,
    }),
    include: JSON.stringify({
      creator: true,
      cycles: true,
      localImages: true,
      favs: true,
      likes: true,
    }),
  })) as PostMosaicItem[];
  if (postResults.length === 0) {
    return { notFound: true };
  }

  const cyclesCount = await countCycles(work);
  const postsCount = await countPosts(work);

  const session = (await getSession({ req })) as unknown as Session;
  const mySocialInfo: MySocialInfo = {
    favoritedByMe: undefined,
    // likedByMe: undefined,
  };
  if (session != null) {
    mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(postResults[0], session.user));
    // mySocialInfo.likedByMe = !!(await isLikedByUser(postResults[0], session.user));
  }

  return {
    props: {
      work,
      post: postResults[0],
      cyclesCount: cyclesCount.count,
      postsCount: postsCount.count,
      mySocialInfo,
    },
  };
}; */

export default PostDetailInWorkPage;
