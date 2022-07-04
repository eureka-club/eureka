import { NextPage,GetServerSideProps,  } from 'next';
import Head from "next/head";
import { useSession } from 'next-auth/react';
import { useState, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { Spinner, Alert } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { WEBAPP_URL } from '@/src/constants';
import WorkDetailComponent from '@/src/components/work/WorkDetail';
import { dehydrate,QueryClient } from 'react-query';
import useWork,{getWork} from '@/src/useWork';
import {getCycles} from '@/src/useCycles'
import {getPosts} from '@/src/usePosts'

const WorkDetailPage: NextPage = (props:any) => {
  
  const router = useRouter();
  const { t } = useTranslation('common');
  const {data:session, status} = useSession();
  const isLoadingSession = status == 'loading'
  const [id, setId] = useState<string>('');
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  useEffect(() => {
    if (router) {
      if (router.query.id) setId(router.query.id as string);
    }
  }, [router]);

  const { data: work, isLoading: isLoadingWork } = useWork(+id, { enabled: !!id });

  const rendetLayout = (title: string, children: ReactElement) => {
    return <>

    <Head>
        <meta property="og:title" content={props.metas.title}/>
        <meta property="og:url" content={`${WEBAPP_URL}/work/${props.metas.id}`} />
        <meta property="og:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas.storedFile}`}/>
        <meta property="og:type" content="article" /> 

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content={props.metas.title}></meta>
       {/* <meta name="twitter:description" content=""></meta>*/}
        <meta name="twitter:url" content={`${WEBAPP_URL}/work/${props.metas.id}`}></meta>
        <meta name="twitter:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas.storedFile}`}></meta>

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
  if(!isLoadingSession && !isLoadingWork && !work)
    return rendetLayout('Work not found', <Alert variant="warning">{t('notFound')}</Alert>);
  return rendetLayout('Loading...', <Spinner animation="grow" />);
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
  
  const workCyclesWhere = {
    where:{
      works:{
        some:{
          id
        }
      }
    }
  }
  
  let work = await getWork(id);
  let metaTags:Record<string,any>={};
  if(work){
    metaTags = {id:work.id, title:work.title, storedFile: work.localImages[0].storedFile}
    const workPostsWhere = {take:8,where:{works:{some:{id}}}}
    await qc.prefetchQuery(['WORK', `${id}`],()=>work,{staleTime: 1000 * 60 * 60})
    await qc.prefetchQuery(['CYCLES',JSON.stringify(workCyclesWhere)],()=>getCycles(workCyclesWhere), {staleTime: 1000 * 60 * 60} )
    await qc.prefetchQuery(['POSTS',JSON.stringify(workPostsWhere)],()=>getPosts({props:workPostsWhere}),{staleTime: 1000 * 60 * 60} )
  }
  
  return {
    props: {
      dehydratedState: dehydrate(qc),
      metas:metaTags
    },
  }
}

export default WorkDetailPage;
