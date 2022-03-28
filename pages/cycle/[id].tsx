import { NextPage,GetServerSideProps } from 'next';
import Head from "next/head";
import { useSession } from 'next-auth/client';
import { useAtom } from 'jotai';
// import { QueryClient, useQuery } from 'react-query';
// import { dehydrate } from 'react-query/hydration';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Spinner, Alert, Button } from 'react-bootstrap';

import { dehydrate, QueryClient, useQuery,useQueryClient } from 'react-query';
// import { CycleMosaicItem } from '../../src/types/cycle';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';
import Banner from '../../src/components/Banner';
import useCycle,{getCycle} from '@/src/useCycle';
import useUsers,{getUsers} from '@/src/useUsers'
import {getPosts} from '@/src/usePosts'
import {getWorks} from '@/src/useWorks'
import { CycleContext, useCycleContext } from '../../src/useCycleContext';
import globalModalsAtom from '../../src/atoms/globalModals';
import { WEBAPP_URL } from '../../src/constants';
import {CycleMosaicItem} from '@/src/types/cycle'
import { UserMosaicItem } from '@/src/types/user';
/*interface Props{
  id:number,
  metas:any
}*/

const whereCycleParticipants = (id:number)=>({
  OR:[
    {cycles: { some: { id } }},//creator
    {joinedCycles: { some: { id } }},//participants
  ], 
});

const whereCycleWorks = (id:number)=> ({ cycles: { some: { id } } })
const whereCyclePosts = (id:number)=> ({AND:{ cycles:{ some: { id }}}})

const CycleDetailPage: NextPage = (props:any) => {
  const [session, isLoadingSession] = useSession();
  const router = useRouter();
  
  const { data: cycle, isSuccess, isLoading, isFetching, isError, error } = useCycle(+props.id);
  
  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants(props.id),
    {
      enabled:!!props.id
    }
  )

  // const { data: works } = usePosts(whereCycleWorks(id), {
  //   enabled:!!id
  // })

  //const {data:posts} = usePosts(whereCyclePosts,{enabled:!!cycle})
  

  // const [cycle, setCycle] = useState<CycleMosaicItem | undefined>(undefined);
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const cycleContext = useCycleContext();
  const { requestJoinCycle: execJoinCycle } = cycleContext;
    
  const [currentUserIsParticipant, setCurrentUserIsParticipant] = useState<boolean>(false);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [isRequestingJoinCycle, setIsRequestingJoinCycle] = useState<boolean>(false);
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  // useEffect(() => {
  //   if (+id /* && isSuccess */ && (!cycle || !cycle.id)) {
  //     queryClient.invalidateQueries(['CYCLE', `${+id}`]);
  //   }
  // }, [cycle, /* isSuccess, */ id]);


  useEffect(() => {
    if (!isLoadingSession) {
      if (!session) {
        setCurrentUserIsParticipant(() => false);
      } else if (session && cycle && session.user) {
        const s = session as unknown as Session;
        if (cycle.creatorId === s.user.id) {
          setCurrentUserIsParticipant(() => true);
          return;
        }
        if (participants) {
          const isParticipant = participants.findIndex((p) => p.id === s.user.id) > -1;
          setCurrentUserIsParticipant(() => isParticipant);
        }
      }
    } else setCurrentUserIsParticipant(() => false);
  }, [session, cycle, isSuccess, isLoadingSession]);

  const renderCycleDetailComponent = () => {
    if (cycle) {
      const res = <CycleDetailComponent />;
      if (cycle.access === 1) return res;
      if (cycle.access === 2) return res;
      if (cycle.access === 3 && !currentUserIsParticipant) return <Alert>Not authorized</Alert>;
    }

    if (isLoadingSession || isFetching || isLoading ) {
      return <Spinner animation="grow" variant="info" />;
    }

    if (isError)
      return (
        <Alert variant="warning">
          <>{error}</>
        </Alert>
      );

    return <></>;
  }; 

  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const requestJoinCycle = async () => {
    
    if (!session) openSignInModal();
    else if (execJoinCycle && cycle) {
      const user = (session as unknown as Session).user;
      setIsRequestingJoinCycle(true);
      const res = await execJoinCycle(cycle,user.name||user.id.toString(),participants||[]);  
    // debugger;
    //   if (res === 'OK'){
    //     setGlobalModalsState({
    //       ...globalModalsState,
    //       showToast: {
    //         show: true,
    //         type: 'info',
    //         title: t('Join Cycle request notification'),
    //         message: t(res),
    //       },
    //     });
    //   }
    //   else{
    //     setGlobalModalsState({
    //       ...globalModalsState,
    //       showToast: {
    //         show: true,
    //         type: 'warning',
    //         title: t('Join Cycle request notification'),
    //         message: t(res),
    //       },
    //     });  
    //   }
      queryClient.invalidateQueries(['CYCLE', `${cycle.id}`]);
      setIsRequestingJoinCycle(false);
    }
  };

  const getBanner = () => {
    if (!currentUserIsParticipant && router && cycle) {
      if (router.asPath.search(/\/cycle\/20/g) > -1)
        return (
          <Banner
            cacheKey={['BANNER-CYCLE', `${cycle.id}`]}
            className="bg-danger"
            style={{}}
            show
            content={
              <aside className="text-center text-white">
                <h2 className="h2">
                  Participa en nuestra conversación inédita sobre la relación que como humanidad tenemos con el agua.
                </h2>
                <p>18 de marzo - 18 de agosto</p>

                <div className="d-grid gap-2">
                  <Button
                    disabled={isRequestingJoinCycle}
                    className="pt-2 pb-1 px-5"
                    variant="primary"
                    size="lg"
                    onClick={requestJoinCycle}
                  >
                    <h4 className="text-white fw-bold">
                      ¡Unirse ya! {isRequestingJoinCycle && <Spinner size="sm" animation="grow" variant="info" />}
                    </h4>
                  </Button>
                </div>
              </aside>
            }
          />
        );
    }
    return <></>;
  };

  if (cycle)
    return (
      <CycleContext.Provider value={{ cycle, currentUserIsParticipant, linkToCycle: false }}>
       
      <Head>
        <meta property="og:title" content={props.metas.title}/>
        <meta property="og:url" content={`${WEBAPP_URL}/cycle/${props.metas.id}`} />
        <meta property="og:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas.storedFile}`}/>
        <meta property="og:type" content='article'/>

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@EurekaClub"></meta>
        <meta name="twitter:title" content={props.metas.title}></meta>
        {/* <meta name="twitter:description" content=""></meta>*/}
        <meta name="twitter:url" content={`${WEBAPP_URL}/cycle/${props.metas.id}`}></meta>
        <meta name="twitter:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas.storedFile}`}></meta>

      </Head>  
        <SimpleLayout banner={getBanner()} title={cycle ? cycle.title : ''}>
            {renderCycleDetailComponent()}
          </SimpleLayout>
      </CycleContext.Provider>
    );

  return (
    <SimpleLayout banner={getBanner()} title="Loading...">
      <Spinner animation="grow" variant="info" />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
 const queryClient = new QueryClient() 
  if (params?.id == null || typeof params.id !== 'string') {
    return { notFound: true };
  }
  //const {id:id_} = context.query;
  const id = parseInt(params.id)

  const wcu = whereCycleParticipants(id)
  const wcp = whereCyclePosts(id)
  const wcw = whereCycleWorks(id)

  let cycle = await getCycle(id);
  let metaTags = {id:cycle?.id, title:cycle?.title, storedFile: cycle?.localImages[0].storedFile}

   await queryClient.prefetchQuery(['CYCLE',`${id}`], ()=>cycle)
   await queryClient.prefetchQuery(['USERS',JSON.stringify(wcu)],()=>getUsers(wcu))
   await queryClient.prefetchQuery(['POSTS',JSON.stringify(wcp)],()=>getPosts(wcp))
   await queryClient.prefetchQuery(['WORKS',JSON.stringify(wcw)],()=>getWorks(wcw))

  return {
    props: {
      metas:metaTags,
      dehydratedState: dehydrate(queryClient),
      id
    },
  }
}

/* export async function getStaticProps(props:{id:string}) {
  const {id} = props
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}`)
  const cycle = await res.json();
debugger;
  return {
    props: {
      cycle,
    },
    revalidate: 10, // In seconds
  }
} */

/* export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle`)
  const {data:cycles} = await res.json();debugger;

  const paths = cycles.map((cycle:CycleMosaicItem) => ({
    params: { id: cycle.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
} */

export default CycleDetailPage;
