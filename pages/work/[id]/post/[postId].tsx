import { GetServerSideProps, NextPage } from 'next';
import { Post } from '@prisma/client';
import { getSession } from 'next-auth/client';
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
import useWork from '../../../../src/useWork';
import usePost from '@/src/usePost';
import HelmetMetaData from '../../../../src/components/HelmetMetaData'
import { WEBAPP_URL } from '../../../../src/constants';
interface Props {
  post: PostMosaicItem;
  work: WorkMosaicItem;
  cyclesCount: number;
  postsCount: number;
  mySocialInfo: MySocialInfo;
}

const PostDetailInWorkPage: NextPage<Props> = () => {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [postId, setPostId] = useState<string>('');
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  // const [work, setWork] = useState<WorkMosaicItem>();
  // const [post, setPost] = useState<PostMosaicItem>();

  useEffect(() => {
    if (router.query.id) {
      setId(router.query.id as string);
    }
    if (router.query.id) {
      setPostId(router.query.postId as string);
    }
  }, [router.query]);

  const { data: work, isLoading: loadingWork } = useWork(+id, { enabled: !!id });
  const { data: post, isLoading: loadingPost } = usePost(+postId, { enabled: !!postId });
  const isLoadingData = () => {
    if (loadingWork) return true;
    if (loadingPost) return true;
    return false;
  };

  const getLayout = (children: JSX.Element, title = '') => {
    return <>
      <HelmetMetaData title={`${post ? post.title : ''} · ${work ? work.title : ''}`}
        url={`${WEBAPP_URL}/work/${id||0}/post/${post ? post?.id:0}`}
        image={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${post?.localImages[0].storedFile}`}
        ></HelmetMetaData>
     <SimpleLayout title={title}>{children}</SimpleLayout>;
     </>
  };

  if (!post || !work || isLoadingData()) return getLayout(<Spinner animation="grow" variant="info" />);
  return getLayout(
    <WorkDetailComponent workId={work.id!} post={post} />,
    `${post!.title} · ${work!.title}`,
  );

  // return (
  //   <SimpleLayout title={`${post.title} · ${work.title}`}>
  //     {!isLoadingData() && (
  //       <WorkDetailComponent
  //         work={work}
  //         post={post}
  //         cyclesCount={cyclesCount}
  //         postsCount={postsCount}
  //         mySocialInfo={mySocialInfo}
  //       />
  //     )}
  //   </SimpleLayout>
  // );
};
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
