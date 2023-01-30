import { GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
import { Spinner } from 'react-bootstrap';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import WorkDetailComponent from '@/src/components/work/WorkDetail';
import useWork,{getWork} from '@/src/useWork';
import usePost,{getPost} from '@/src/usePost';
import { QueryClient,dehydrate } from 'react-query';
import { WEBAPP_URL } from '@/src/constants';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import useTranslation from 'next-translate/useTranslation';
interface Props {
  postId:number;
  workId:number;
  metaTags:any;
  session:Session
}

const PostDetailInWorkPage: NextPage<Props> = ({postId,workId,metaTags,session}) => {
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
  const { t } = useTranslation('meta');

  const { data: work, isLoading: loadingWork } = useWork(+workId, { enabled: !!workId });
  const { data: post, isLoading: loadingPost } = usePost(+postId, { enabled: !!postId });
  const isLoadingData = () => {
    if (loadingWork) return true;
    if (loadingPost) return true;
    return false;
  };

  const getLayout = (children: JSX.Element, title = '') => {
    return (
      <>
        <Head>
          <meta
            name="title"
            content={`${t('postTitle')} ${metaTags.title} - ${metaTags.creator} ${t('postTitle2')} `}
          ></meta>
          <meta name="description" content={t('postDescription')}></meta>
          <meta property="og:title" content={`${metaTags.title} · ${metaTags.workTitle}`} />
          <meta property="og:url" content={`${WEBAPP_URL}/work/${metaTags.workId}/post/${metaTags.id}`} />
          <meta
            property="og:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metaTags.storedFile}`}
          />
          <meta property="og:type" content="article" />

          <meta name="twitter:card" content="summary_large_image"></meta>
          <meta name="twitter:site" content="@eleurekaclub"></meta>
          <meta name="twitter:title" content={`${metaTags.title} · ${metaTags.workTitle}`}></meta>
          {/* <meta name="twitter:description" content=""></meta>*/}
          <meta name="twitter:url" content={`${WEBAPP_URL}/work/${metaTags.workId}/post/${metaTags.id}`}></meta>
          <meta
            name="twitter:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metaTags.storedFile}`}
          ></meta>
        </Head>
        <SimpleLayout title={title}>{children}</SimpleLayout>;
      </>
    );
  };

  if (!post || !work || isLoadingData()) return getLayout(<Spinner animation="grow" variant="info" />);
  return getLayout(
    <WorkDetailComponent workId={work.id!} post={post} session={session} />,
    `${post!.title} · ${work!.title}`,
  );

};


export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const {query} = ctx
  const {id:wid,postId:pid} = query;
  const workId = parseInt(wid ? wid.toString():'')
  const postId = parseInt(pid ? pid.toString():'')
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL


 let post = await getPost(postId,origin);
 let work = await getWork(workId,origin);
 let metaTags = {
   id: post?.id,
   workId: work?.id,
   title: post?.title,
   workTitle: work?.title,
   creator: post?.creator.name,
   storedFile: post?.localImages[0].storedFile,
 };

  const queryClient = new QueryClient() 
   await queryClient.prefetchQuery(['WORK',`${workId}`],()=>work)
   await queryClient.prefetchQuery(['POST',`${postId}`],()=>post)

  return {
    props: {
      session,
      dehydratedState: dehydrate(queryClient),
      workId,
      postId,
      metaTags:metaTags
    },
  }
}

export default PostDetailInWorkPage;
