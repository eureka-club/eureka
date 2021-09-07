import { NextPage } from 'next';
import { useSession } from 'next-auth/client';
// import { QueryClient, useQuery } from 'react-query';
// import { dehydrate } from 'react-query/hydration';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { CycleMosaicItem } from '../../src/types/cycle';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';

// import {
//   // countParticipants,
//   // countPosts,
//   // countWorks,
//   // find,
//   // findParticipant,
//   // isFavoritedByUser,
//   // isLikedByUser,
// } from '../../src/facades/cycle';
// import useCycles, { getRecords } from '../../src/useCycles';
import useCycles from '../../src/useCycles';

// interface Props {
//   // cycle: CycleDetail;
//   isCurrentUserJoinedToCycle: boolean;
//   participantsCount: number;
//   postsCount: number;
//   worksCount: number;
//   mySocialInfo: MySocialInfo;
// }

const CycleDetailPage: NextPage = () => {
  // debugger;
  const session = useSession as unknown as Session;
  const router = useRouter();
  const [id, setId] = useState<string>();
  const { data, isSuccess, isFetching, isError, error } = useCycles(id);
  const [cycle, setCycle] = useState<CycleMosaicItem | undefined>(undefined);

  useEffect(() => {
    if (router && router.query) setId(() => router.query.id as string);
  }, [router]);

  useEffect(() => {
    // debugger;
    if (session && data && router) {
      const c = data as CycleMosaicItem;
      if (c) {
        setCycle(c);
        if (c) {
          if (!c.isPublic) {
            if (!session) {
              router.push('/');
            } else if (c.participants && session.user) {
              const participantIdx = c.participants.findIndex((i) => i.id === session.user.id);
              if (c.creatorId !== session.user.id && participantIdx === -1 && !session.user.roles.includes('admin')) {
                router.push('/');
              }
            }
          }
        }
      }
    }
  }, [data, session, router]);

  return (
    <SimpleLayout title={cycle ? cycle.title : ''}>
      <>
        {cycle && (
          <CycleDetailComponent
            cycle={cycle}
            // isCurrentUserJoinedToCycle={isCurrentUserJoinedToCycle}
            // participantsCount={participantsCount}
            // postsCount={postsCount}
            // worksCount={worksCount}
            // mySocialInfo={mySocialInfo}
          />
        )}
        {(isFetching || !isSuccess) && <Spinner animation="grow" variant="secondary" />}
        {isError && !cycle && (
          <Alert variant="warning">
            <>{error}</>
          </Alert>
        )}
      </>
    </SimpleLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
//   if (params?.id == null || typeof params.id !== 'string') {
//     return { notFound: true };
//   }
//   const id = parseInt(params.id, 10);
//   if (!Number.isInteger(id)) {
//     return { notFound: true };
//   }
//   const session = (await getSession({ req })) as unknown as Session;

//   const queryClient = new QueryClient();
//   // const fetchCycle = async () => {
//   //   const cycle = await find(id);
//   //   if (cycle == null) {
//   //     return { notFound: true };
//   //   }
//   //   return cycle;
//   // };

//   const cacheKey = ['CYCLES', `${id}`];
//   await queryClient.prefetchQuery(cacheKey, () => getRecords(undefined, id));
//   // await queryClient.prefetchQuery(cacheKey, fetchCycle);
//   const cycle = queryClient.getQueryData<CycleMosaicItem>(cacheKey);

//   const toHomePage = () => {
//     res.writeHead(302, { Location: '/' });
//     res.end();
//   };
//   if (cycle) {
//     if (!cycle.isPublic) {
//       if (!session) {
//         toHomePage();
//       } else {
//         const participantIdx = cycle.participants.findIndex((i) => i.id === session.user.id);
//         if (cycle.creatorId !== session.user.id && participantIdx === -1 && !session.user.roles.includes('admin')) {
//           toHomePage();
//         }
//       }
//     }
//   }

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };

// export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
//   if (params?.id == null || typeof params.id !== 'string') {
//     return { notFound: true };
//   }

//   const id = parseInt(params.id, 10);
//   if (!Number.isInteger(id)) {
//     return { notFound: true };
//   }

//   const cycle = await find(id);
//   if (cycle == null) {
//     return { notFound: true };
//   }

//   const participantsCount = await countParticipants(cycle);
//   const postsCount = await countPosts(cycle);
//   const worksCount = await countWorks(cycle);

//   const session = (await getSession({ req })) as unknown as Session;

//   const mySocialInfo: MySocialInfo = {
//     favoritedByMe: undefined,
//     // likedByMe: undefined,
//   };
//   let myParticipant = null;

//   const toHomePage = () => {
//     res.writeHead(302, { Location: '/' });
//     res.end();
//   };
//   if (!cycle.isPublic) {
//     if (!session) {
//       toHomePage();
//     } else {
//       const participantIdx = cycle.participants.findIndex((i) => i.id === session.user.id);
//       if (cycle.creatorId !== session.user.id && participantIdx === -1 && !session.user.roles.includes('admin')) {
//         toHomePage();
//       }
//     }
//   }

//   if (session != null) {
//     myParticipant = await findParticipant(session.user, cycle);
//     mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(cycle, session.user));
//     // mySocialInfo.likedByMe = !!(await isLikedByUser(cycle, session.user));
//   }

//   return {
//     props: {
//       cycle,
//       isCurrentUserJoinedToCycle: myParticipant != null,
//       participantsCount: participantsCount.count,
//       postsCount: postsCount.count,
//       worksCount: worksCount.count,
//       mySocialInfo,
//     },
//   };
// };

export default CycleDetailPage;
