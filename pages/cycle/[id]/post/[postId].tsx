import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Spinner } from 'react-bootstrap';
import { EILSEQ } from 'constants';
import { Session } from '../../../../src/types';
// import { MySocialInfo, Session } from '../../../../src/types';
import { CycleMosaicItem } from '../../../../src/types/cycle';
import { PostMosaicItem } from '../../../../src/types/post';
import SimpleLayout from '../../../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../../../src/components/cycle/CycleDetail';
// import { isFavoritedByUser /* isLikedByUser, search as searchPost */ } from '../../../../src/facades/post';
import { WorkMosaicItem } from '../../../../src/types/work';
import useCycle from '../../../../src/useCycle';
import { CycleContext } from '../../../../src/useCycleContext';
// import { Post } from '.prisma/client';
// interface Props {
//   cycle: CycleMosaicItem;
//   post: PostMosaicItem;
//   isCurrentUserJoinedToCycle: boolean;
//   participantsCount: number;
//   postsCount: number;
//   worksCount: number;
//   // mySocialInfo: MySocialInfo;
// }

const PostDetailInCyclePage: NextPage = () => {
  const [session, isLoadingSession] = useSession();
  const router = useRouter();
  const [cycleId, setCycleId] = useState<string>('');
  const { data, isLoading } = useCycle(+cycleId);
  const [cycle, setCycle] = useState<CycleMosaicItem>();
  const [post, setPost] = useState<PostMosaicItem>();
  const [currentUserIsParticipant, setCurrentUserIsParticipant] = useState<boolean>(false);

  useEffect(() => {
    if (!session) {
      setCurrentUserIsParticipant(() => false);
    } else if (session && cycle && session.user) {
      const s = session as unknown as Session;
      if (cycle.creatorId === s.user.id) setCurrentUserIsParticipant(() => true);
      const isParticipant = cycle.participants.findIndex((p) => p.id === s.user.id) > -1;
      setCurrentUserIsParticipant(() => isParticipant);
    }
  }, [session, cycle]);

  useEffect(() => {
    if (router.query.id) setCycleId(router.query.id as string);
  }, [router]);

  useEffect(() => {
    if (data) {
      const c = data as CycleMosaicItem;
      setCycle(() => c);
      if (c) {
        const po = c.posts.find((p) => p.id === parseInt(router.query.postId as string, 10));
        setPost(po as PostMosaicItem);
      }
    }
  }, [data, router.query.postId]);

  return (
    <SimpleLayout title={`${post ? post.title : ''} · ${cycle ? cycle.title : ''}`}>
      <>
        {(isLoadingSession || isLoading) && <Spinner animation="grow" variant="secondary" />}
        {!(isLoadingSession || isLoading) && post && cycle && (
          <CycleContext.Provider value={{ cycle, currentUserIsParticipant }}>
            <CycleDetailComponent
              post={post}
              work={post.works.length ? (post.works[0] as WorkMosaicItem) : undefined}
            />
          </CycleContext.Provider>
        )}
      </>
    </SimpleLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   if (
//     params == null ||
//     params.id == null ||
//     params.postId == null ||
//     typeof params.id !== 'string' ||
//     typeof params.postId !== 'string'
//   ) {
//     return { notFound: true };
//   }
//   const cycleId = parseInt(params.id, 10);
//   const postId = parseInt(params.postId, 10);

//   if (!Number.isInteger(cycleId) || !Number.isInteger(postId)) {
//     return { notFound: true };
//   }

//   const cycle = await findCycle(cycleId);
//   if (cycle == null) {
//     return { notFound: true };
//   }

//   let post;
//   if (postId) post = cycle.posts.find((p) => p.id === postId);

//   // const postResults = (await searchPost({
//   //   where: JSON.stringify({
//   //     cycles: { some: { id: cycleId } },
//   //     id: postId,
//   //   }),
//   //   include: JSON.stringify({
//   //     creator: true,
//   //     cycles: true,
//   //     works: true,
//   //     localImages: true,
//   //     favs: true,
//   //     likes: true,
//   //   }),
//   // })) as PostMosaicItem[];
//   // if (postResults.length === 0) {
//   //   return { notFound: true };
//   // }

//   // const participantsCount = await countParticipants(cycle);
//   // const postsCount = await countPosts(cycle);
//   // const worksCount = await countWorks(cycle);

//   // const session = (await getSession({ req })) as unknown as Session;
//   // const mySocialInfo: MySocialInfo = {
//   //   favoritedByMe: undefined,
//   //   // likedByMe: undefined,
//   // };
//   // let myParticipant = null;
//   // if (session != null) {
//   //   // myParticipant = await findParticipant(session.user, cycle);
//   //   if (post) mySocialInfo.favoritedByMe = !!(await isFavoritedByUser(post, session.user));
//   //   // mySocialInfo.likedByMe = !!(await isLikedByUser(postResults[0], session.user));
//   // }

//   return {
//     props: {
//       cycle,
//       // post: postResults[0],
//       post,
//       // isCurrentUserJoinedToCycle: myParticipant != null,
//       // participantsCount: participantsCount.count,
//       // postsCount: postsCount.count,
//       // worksCount: worksCount.count,
//       // mySocialInfo,
//     },
//   };
// };

export default PostDetailInCyclePage;
