import { NextPage } from 'next';
import Head from "next/head";
import { useSession } from 'next-auth/client';
import { useState, useEffect, ReactElement } from 'react';
// import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Spinner, Alert } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
// import { Session, MySocialInfo } from '../../src/types';
import { WorkMosaicItem, WorkDetail } from '../../src/types/work';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import WorkDetailComponent from '../../src/components/work/WorkDetail';
import useWork from '../../src/useWork';
import useCycles from '@/src/useCycles'
import { WEBAPP_URL } from '../../src/constants';

// import {
//   countCycles,
//   countPosts,
//   find,
//   isFavoritedByUser,
//   // isLikedByUser,
//   // isReadOrWatchedByUser,
// } from '../../src/facades/work';
import { User } from '.prisma/client';
import { CycleMosaicItem } from '@/src/types/cycle';
import { PostMosaicItem } from '@/src/types/post';
import prisma from '@/src/lib/prisma';

interface Props {
  work: string;
}

const WorkDetailPage: NextPage<Props> = () => {
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
  

  // const {data:cycles,isLoading:isLoadingCycles} = useCycles({
  //   works:{
  //     some:{
  //       id:+id
  //     }
  //   }
  // },{enabled:!!id})

  useEffect(() => {
    if (!isLoadingSession && session && work && work.favs) {
      setMySocialInfo((res) => ({ ...res, favoritedByMe: work.favs.findIndex((u) => u.id === +id) > -1 }));
    }
  }, [isLoadingSession, session, work, id]);

  const rendetLayout = (title: string, children: ReactElement) => {
    return <>

    <Head>
        <meta property="og:title" content={work?.title}/>
        <meta property="og:url" content={`${WEBAPP_URL}/work/${work?.id}`} />
        <meta property="og:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${work?.localImages[0].storedFile}`}/>
        <meta property="og:type" content='website' />
    </Head>
     <SimpleLayout title={title}>{children}</SimpleLayout>;
     </>
  };
  
  // if (isLoadingWork) return rendetLayout('Loading...', <Spinner animation="grow" />);
  
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

// export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
//   if (params?.id == null || typeof params.id !== 'string') {
//     return { notFound: true };
//   }

//   const id = parseInt(params.id, 10);
//   if (!Number.isInteger(id)) {
//     return { notFound: true };
//   }

//   const work = await prisma.work.findUnique({
//     where:{id},
//     include:{localImages:{select:{storedFile:true}}}
//   });
//   if (work == null) {
//     return { notFound: true };
//   }
//   const cycles = await prisma.cycle.findMany({
//     where:{
//       works:{some:{id:work.id}}
//     },
//     include:{localImages:{select:{storedFile:true}}}
//   })
//   const posts = await prisma.post.findMany({
//     where:{
//       works:{some:{id:work.id}}
//     },
//     include:{localImages:{select:{storedFile:true}}}
//   })


//   return {
//     props: {
//       work:JSON.stringify(work),
//       cycles:JSON.stringify(cycles),
//       posts:JSON.stringify(posts)
//     },
//   };
// };

export default WorkDetailPage;
