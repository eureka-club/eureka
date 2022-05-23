import { NextPage,GetServerSideProps } from 'next';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Spinner } from 'react-bootstrap';
import { QueryClient,dehydrate } from 'react-query';
// import { Session } from '@/src/types';
// import { MySocialInfo, Session } from '@/src/types';
import { CycleMosaicItem } from '@/src/types/cycle';
// import { PostMosaicItem } from '@/src/types/post';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import CycleDetailComponent from '@/src/components/cycle/CycleDetail';
// import { isFavoritedByUser /* isLikedByUser, search as searchPost */ } from '@/src/facades/post';
import { WorkMosaicItem } from '@/src/types/work';
import useCycle,{getCycle} from '@/src/useCycle';
import usePost,{getPost} from '@/src/usePost';
import useUsers,{getUsers} from '@/src/useUsers';
import { CycleContext } from '@/src/useCycleContext';
import { WEBAPP_URL } from '@/src/constants';
// import { Post } from '.prisma/client';
interface Props {
  postId:number;
  cycleId:number;
  metaTags:any
  // mySocialInfo: MySocialInfo;
}

const whereCycleParticipants = (id:number)=>({
  where:{OR:[
    {cycles: { some: { id } }},//creator
    {joinedCycles: { some: { id } }},//participants
  ],} 
});

const PostDetailInCyclePage: NextPage<Props> = ({postId,cycleId,metaTags}) => {
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"
  const router = useRouter();
  // const [post, setPost] = useState<PostMosaicItem>();
  const [currentUserIsParticipant, setCurrentUserIsParticipant] = useState<boolean>(false);
  
  const { data:cycle, isLoading: isLoadingCycle } = useCycle(cycleId);
  const { data: post, isLoading: isLoadingPost, isFetching: isFetchingPost } = usePost(postId);
  
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants(+cycleId),
    {
      enabled:!!cycleId
    }
  )


  useEffect(() => {
    if (!session) {
      setCurrentUserIsParticipant(() => false);
    } else if (session && cycle && session.user) {
      const s = session;
      if (cycle.creatorId === s.user.id) setCurrentUserIsParticipant(() => true);
      const isParticipant = (participants||[]).findIndex((p) => p.id === s.user.id) > -1;
      setCurrentUserIsParticipant(() => isParticipant);
    }
  }, [session, cycle, participants]);


  const isLoadingOrFetching = () => {
    return !post && (isLoadingSession || isLoadingCycle || isLoadingPost || isFetchingPost);
  };

  return (
    <>
     <Head>
        <meta property="og:title" content={`${metaTags.title} · ${metaTags.cycleTitle}`}/>
        <meta property="og:url" content={`${WEBAPP_URL}/cycle/${metaTags.cycleId}/post/${metaTags.id}`} />
        <meta property="og:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metaTags.storedFile}`}/>
        <meta property="og:type" content='article'/>

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content={`${metaTags.title} · ${metaTags.cycleTitle}`}></meta>
        {/* <meta name="twitter:description" content=""></meta>*/}
        <meta name="twitter:url" content={`${WEBAPP_URL}/cycle/${metaTags.cycleId}/post/${metaTags.id}`}></meta>
        <meta name="twitter:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${metaTags.storedFile}`}></meta>

    </Head>
    <SimpleLayout title={`${post ? post.title : ''} · ${cycle ? cycle.title : ''}`}>
      <>
        {isLoadingOrFetching() && <Spinner animation="grow" variant="info" />}
        {!isLoadingOrFetching() && post && cycle && (
          <CycleContext.Provider value={{ cycle, currentUserIsParticipant }}>
            <CycleDetailComponent
              post={post}
              work={post.works.length ? (post.works[0] as WorkMosaicItem) : undefined}
            />
          </CycleContext.Provider>
        )}
      </>
    </SimpleLayout>
    </>
  );
};

export const getServerSideProps:GetServerSideProps = async ({query}) => {
  const {id:cid,postId:pid} = query;
  const cycleId = parseInt(cid ? cid.toString():'')
  const postId = parseInt(pid ? pid.toString():'')

  const wcu = whereCycleParticipants(cycleId)
  

 let post = await getPost(postId);
 let cycle = await getCycle(cycleId);
 let metaTags = {id:post?.id, cycleId:cycle?.id, title:post?.title,cycleTitle:cycle?.title, storedFile: post?.localImages[0].storedFile}

  const queryClient = new QueryClient() 
   await queryClient.prefetchQuery(['USERS',JSON.stringify(wcu)],()=>getUsers(wcu))
   await queryClient.prefetchQuery(['CYCLE',`${cycleId}`],()=>cycle)
   await queryClient.prefetchQuery(['POST',`${postId}`],()=>post)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      cycleId,
      postId,
      metaTags:metaTags
    },
  }
}

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
