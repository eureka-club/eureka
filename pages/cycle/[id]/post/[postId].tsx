import { NextPage,GetServerSideProps } from 'next';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Spinner } from 'react-bootstrap';
import { QueryClient,dehydrate } from 'react-query';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import CycleDetailComponent from '@/src/components/cycle/CycleDetail';
import { WorkMosaicItem } from '@/src/types/work';
import useCycle,{getCycle} from '@/src/useCycle';
import usePost,{getPost} from '@/src/usePost';
import useUsers,{getUsers} from '@/src/useUsers';
import { CycleContext } from '@/src/useCycleContext';
import { WEBAPP_URL } from '@/src/constants';
import { Session } from '@/src/types';
interface Props {
  session:Session;
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

const PostDetailInCyclePage: NextPage<Props> = ({postId,cycleId,metaTags,session}) => {
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
    return !post && (isLoadingCycle || isLoadingPost || isFetchingPost);
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

export const getServerSideProps:GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const {query} = ctx
  const {id:cid,postId:pid} = query;
  const cycleId = parseInt(cid ? cid.toString():'')
  const postId = parseInt(pid ? pid.toString():'')

  const wcu = whereCycleParticipants(cycleId)
  
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

 let post = await getPost(postId,origin);
 let cycle = await getCycle(cycleId,origin);
 let metaTags = {id:post?.id, cycleId:cycle?.id, title:post?.title,cycleTitle:cycle?.title, storedFile: post?.localImages[0].storedFile}

  const queryClient = new QueryClient() 
   await queryClient.prefetchQuery(['USERS',JSON.stringify(wcu)],()=>getUsers(wcu,origin))
   await queryClient.prefetchQuery(['CYCLE',`${cycleId}`],()=>cycle)
   await queryClient.prefetchQuery(['POST',`${postId}`],()=>post)

  return {
    props: {
      session,
      dehydratedState: dehydrate(queryClient),
      cycleId,
      postId,
      metaTags:metaTags
    },
  }
}

export default PostDetailInCyclePage;
