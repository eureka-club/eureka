import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useState, useEffect, ReactElement } from 'react';
// import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Spinner, Alert } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { Session } from '../../src/types';
// import { WorkMosaicItem } from '../../src/types/work';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import WorkDetailComponent from '../../src/components/work/WorkDetail';
import useWork from '../../src/useWork';

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
  const {data:sd,status} = useSession();
  const [session, setSession] = useState<Session>(sd as Session);
  useEffect(()=>{
    if(sd)
      setSession(sd as Session)
  },[sd])
  const [id, setId] = useState<string>('');
  const [mySocialInfo, setMySocialInfo] = useState<Record<string, boolean>>({
    favoritedByMe: false,
  });

  useEffect(() => {
    if (router) {
      if (router.query.id) setId(router.query.id as string);
    }
  }, [router]);

  const { data: work, isLoading: isLoadingWork, error } = useWork(+id, { enabled: !!id });

  useEffect(() => {
    if (!(status=='loading') && session && work) {
      setMySocialInfo((res) => ({ ...res, favoritedByMe: work.favs.findIndex((u: User) => u.id === session?.user.id) > -1 }));
    }
  }, [status, session, work, id]);

  const rendetLayout = (title: string, children: ReactElement) => {
    return <SimpleLayout title={title}>{children}</SimpleLayout>;
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
