import { NextPage,GetServerSideProps,  } from 'next';
import Head from "next/head";
import { getSession } from 'next-auth/react';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { Spinner, Alert } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { WEBAPP_URL } from '@/src/constants';
import WorkDetailComponent from '@/src/components/work/WorkDetail';
import { dehydrate, QueryClient } from 'react-query';
import useWork,{getWork} from '@/src/useWork';
import {getCycles} from '@/src/useCycles'
import {getPosts} from '@/src/usePosts'
import { Session } from '@/src/types';

interface Props{
  workId: number;
  metas:Record<string,any>;
  session:Session;
}
const WorkDetailPage: NextPage<Props> = ({ session, metas, workId }) => {
  
  const router = useRouter();
  const { t } = useTranslation('common');
  //const [id, setId] = useState<string>('');
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;


  const { data: work, isLoading, isFetching, isError, error } = useWork(+workId, { enabled: !!workId });

  const rendetLayout = (title: string, children: ReactElement) => {
    return (
      <>
        <Head>
          <meta name="title" content={`${t('meta:workTitle')} - ${metas.title} ${t('meta:workTitle1')}`}></meta>
          <meta
            name="description"
            content={`${t('meta:workDescription')} ${metas.title} - ${metas.author} ${t('meta:workDescription1')}`}
          ></meta>
          <meta property="og:title" content={metas.title} />
          <meta property="og:url" content={`${WEBAPP_URL}/work/${metas.id}`} />
          <meta
            property="og:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metas.storedFile}`}
          />
          <meta property="og:type" content="article" />

          <meta name="twitter:card" content="summary_large_image"></meta>
          <meta name="twitter:site" content="@eleurekaclub"></meta>
          <meta name="twitter:title" content={metas.title}></meta>
          {/* <meta name="twitter:description" content=""></meta>*/}
          <meta name="twitter:url" content={`${WEBAPP_URL}/work/${metas.id}`}></meta>
          <meta
            name="twitter:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metas.storedFile}`}
          ></meta>
        </Head>
        <SimpleLayout title={title}>{children}</SimpleLayout>;
      </>
    );
  };


  if (isError)
    return (
      <Alert variant="warning">
        <>{error}</>
      </Alert>
    );

  if (!isLoading  && !work)
    return (
      <SimpleLayout title={t('notFound')}>
        <Alert variant="danger">{t('notFound')}</Alert>
      </SimpleLayout>
    );
  
  if (work) {
    return rendetLayout(
      work.title,
      <WorkDetailComponent
        session={session}
        workId={work.id}
      />,
    );
  }
  return (
    <SimpleLayout title="Loading...">
      <Spinner animation="grow" variant="info" />
    </SimpleLayout>
  ); 
};


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const { params } = ctx
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

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
  let lang = ctx.locale ?? "es";
  let work = await getWork(id,lang);
  let metaTags:Record<string,any>={};
  if(work){
    metaTags = { id: work.id, title: work.title, author: work.author, storedFile: work.localImages[0].storedFile };
    const workPostsWhere = {take:8,where:{works:{some:{id}}}}
    await qc.prefetchQuery(['WORK', `${id}-${lang}`],()=>work)
    await qc.prefetchQuery(['CYCLES',JSON.stringify(workCyclesWhere)],()=>getCycles(ctx.locale!,workCyclesWhere,origin))
    await qc.prefetchQuery(['POSTS',JSON.stringify(workPostsWhere)],()=>getPosts(ctx.locale!,workPostsWhere,origin))
  }
  
  return {
    props: {
      workId: work?.id || null,
      work,
      session,
      dehydratedState: dehydrate(qc),
      metas:metaTags
    },
  }
}

export default WorkDetailPage;
