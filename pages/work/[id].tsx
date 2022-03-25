import { NextPage,GetServerSideProps,GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring'
import Head from "next/head";
import { useSession } from 'next-auth/client';
import { useState, useEffect, ReactElement } from 'react';
// import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Spinner, Alert } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
// import { Session, MySocialInfo } from '../../src/types';
// import { WorkMosaicItem } from '../../src/types/work';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import HelmetMetaData from '../../src/components/HelmetMetaData'
import { WEBAPP_URL } from '../../src/constants';
import WorkDetailComponent from '../../src/components/work/WorkDetail';
import { dehydrate,QueryClient } from 'react-query';
import useWork,{getWork} from '../../src/useWork';
import {getCycles} from '@/src/useCycles'
import {getPosts} from '@/src/usePosts'

// import {
//   countCycles,
//   countPosts,
//   find,
//   isFavoritedByUser,
//   // isLikedByUser,
//   // isReadOrWatchedByUser,
// } from '../../src/facades/work';
import { User } from '.prisma/client';
import { WorkMosaicItem } from '@/src/types/work';

// interface Props {
//   // work: WorkMosaicItem;
//   cyclesCount: number;
//   postsCount: number;
//   mySocialInfo: MySocialInfo;
// }

const WorkDetailPage: NextPage = (props:any) => {
  // const queryClient = useQueryClient();
  // queryClient.setQueryData(['WORKS', `${work.id}`], work);

  const router = useRouter();
  const { t } = useTranslation('common');
  const [session, isLoadingSession] = useSession();
  const [id, setId] = useState<string>('');
  const [mySocialInfo, setMySocialInfo] = useState<Record<string, boolean>>({
    favoritedByMe: false,
  });
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  useEffect(() => {
    if (router) {
      if (router.query.id) setId(router.query.id as string);
    }
  }, [router]);

  const { data: work, isLoading: isLoadingWork } = useWork(+id, { enabled: !!id });

  useEffect(() => {
    if (!isLoadingSession && session && work) {
      setMySocialInfo((res) => ({ ...res, favoritedByMe: work.favs.findIndex((u) => u.id === +id) > -1 }));
    }
  }, [isLoadingSession, session, work, id]);

  const rendetLayout = (title: string, children: ReactElement) => {
    return <>

    <Head>
        <meta property="og:title" content={props.metas.title}/>
        <meta property="og:url" content={`${WEBAPP_URL}/work/${props.metas.id}`} />
        <meta property="og:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas.storedFile}`}/>
        <meta property="og:type" content="article" /> 

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@EurekaClub"></meta>
        <meta name="twitter:title" content={props.metas.title}></meta>
       {/* <meta name="twitter:description" content=""></meta>*/}
        <meta name="twitter:image" content={`${WEBAPP_URL}/work/${props.metas.id}`}></meta>
        <meta name="twitter:url" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas.storedFile}`}></meta>

    </Head>
     <SimpleLayout title={title}>{children}</SimpleLayout>;
     </>
  };
  
  if (isLoadingWork) return rendetLayout('Loading...', <Spinner animation="grow" />);
  
  if (work) {
    return rendetLayout(
      work.title,
      <WorkDetailComponent
        workId={work.id}
      />,
    );
  }
  
  return rendetLayout('Work not found', <Alert variant="warning">{t('notFound')}</Alert>);
  // return (
  //   <SimpleLayout title={work.title}>
  //     <WorkDetailComponent work={work} cyclesCount={work.cycles.length} postsCount={work.posts.length} mySocialInfo={mySocialInfo} />
  //   </SimpleLayout>
  // );
};


export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const qc = new QueryClient()
  if (params?.id == null || typeof params.id !== 'string') {
    return { notFound: true };
  }

  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id)) {
    return { notFound: true };
  }
  
  const workItemsWhere = {
    works:{
      some:{
        id
      }
    }
  }
  
  let work = await getWork(id);
  let metaTags = {id:work.id, title:work.title, storedFile: work.localImages[0].storedFile}
  const workPostsWhere = {AND:{works:{some:{id}}}}
  await qc.prefetchQuery(['WORK', `${id}`],()=>work)
  await qc.prefetchQuery(['CYCLES',JSON.stringify(workItemsWhere)],()=>getCycles(workItemsWhere) )
  await qc.prefetchQuery(['POSTS',JSON.stringify(workPostsWhere)],()=>getPosts(workPostsWhere) )
  
  //const session = (await getSession({ req })) as unknown as Session;
  
  return {
    props: {
      dehydratedState: dehydrate(qc),
      metas:metaTags
    },
  }
}

export default WorkDetailPage;
