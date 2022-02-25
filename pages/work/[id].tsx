import { NextPage } from 'next';
import { useSession } from 'next-auth/client';
import { useState, useEffect, ReactElement } from 'react';
// import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Spinner, Alert } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
// import { Session, MySocialInfo } from '../../src/types';
// import { WorkMosaicItem } from '../../src/types/work';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import WorkDetailComponent from '../../src/components/work/WorkDetail';
import useWork from '../../src/useWork';
import HelmetMetaData from '../../src/components/HelmetMetaData'
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

// interface Props {
//   // work: WorkMosaicItem;
//   cyclesCount: number;
//   postsCount: number;
//   mySocialInfo: MySocialInfo;
// }

const WorkDetailPage: NextPage = () => {
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

  const { data: work, isLoading: isLoadingWork, error } = useWork(+id, { enabled: !!id });

  useEffect(() => {
    if (!isLoadingSession && session && work) {
      setMySocialInfo((res) => ({ ...res, favoritedByMe: work.favs.findIndex((u: User) => u.id === +id) > -1 }));
    }
  }, [isLoadingSession, session, work, id]);

  const rendetLayout = (title: string, children: ReactElement) => {
    return <>
     <HelmetMetaData title={work?.title}
        url={`${WEBAPP_URL}/work/${work?.id}`}
        image={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${work?.localImages[0].storedFile}`}
        ></HelmetMetaData>
     <SimpleLayout title={title}>{children}</SimpleLayout>;
     </>
  };

  if (work) {
    let cyclesCount = 0;
    if (work.cycles) cyclesCount = work.cycles.length;
    return rendetLayout(
      work.title,
      <WorkDetailComponent
        work={work}
        cyclesCount={cyclesCount}
        postsCount={work.posts.length}
        mySocialInfo={mySocialInfo}
      />,
    );
  }
  if (isLoadingWork) return rendetLayout('Loading... work', <Spinner animation="grow" />);
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

//   const work = await find(id);
//   if (work == null) {
//     return { notFound: true };
//   }

//   const cyclesCount = await countCycles(work);
//   const postsCount = await countPosts(work);

//   const session = (await getSession({ req })) as unknown as Session;
//   const mySocialInfo: MySocialInfo = {
//     favoritedByMe: undefined,
//     // likedByMe: undefined,
//     // readOrWatchedByMe: undefined,
//   };
//   if (session != null) {
//     mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(work, session.user));
//     // mySocialInfo.likedByMe = !!(await isLikedByUser(work, session.user));
//     // mySocialInfo.readOrWatchedByMe = !!(await isReadOrWatchedByUser(work, session.user));
//   }

//   return {
//     props: {
//       work,
//       cyclesCount: cyclesCount.count,
//       postsCount: postsCount.count,
//       mySocialInfo,
//     },
//   };
// };

export default WorkDetailPage;
