import { NextPage,GetServerSideProps } from 'next';
import Head from "next/head";
import { useAtom } from 'jotai'; 
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Spinner, Alert, Button } from 'react-bootstrap';

import { dehydrate, QueryClient, useIsFetching } from 'react-query';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import CycleDetailComponent from '@/src/components/cycle/CycleDetail';
import Banner from '@/src/components/Banner';
import useCycle,{getCycle} from '@/src/useCycle';
import useUsers,{getUsers} from '@/src/useUsers'
import {getPosts} from '@/src/usePosts'
import {getWorks} from '@/src/useWorks'
import { CycleContext } from '@/src/useCycleContext';
import globalModalsAtom from '@/src/atoms/globalModals';
import { WEBAPP_URL } from '@/src/constants';
import toast from 'react-hot-toast';
import {useJoinUserToCycleAction} from '@/src/hooks/mutations/useCycleJoinOrLeaveActions'
import {useModalContext} from '@/src/useModal'
import SignInForm from '@/components/forms/SignInForm';

const whereCycleParticipants = (id:number)=>({
  where:{OR:[
    {cycles: { some: { id } }},//creator
    {joinedCycles: { some: { id } }},//participants
  ]}, 
});

const whereCycleWorks = (id:number)=> ({where:{cycles: { some: { id } } }})
const whereCyclePosts = (id:number)=> ({take:8,where:{cycles:{ some: { id }}}})

interface Props{
  id:number;
  session: any;
  metas:{id:number; title:string; storedFile: string};
  NEXT_PUBLIC_AZURE_CDN_ENDPOINT:string;
  NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME:string;
}
const CycleDetailPage: NextPage<Props> = (props) => {
  // const [session, isLoadingSession] = useSession();
  const session = props.session;
  const router = useRouter();
  const isFetchingCycle = useIsFetching(['CYCLE',`${props.id}`])
  const { data: cycle, isSuccess, isLoading, isFetching, isError, error } = useCycle(+props.id,{enabled:!!session});
  const {show} = useModalContext()
  
  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants(props.id),
    {
      enabled:!!props.id,
      from:'cycle/[id]'
    },
  )

  const { t } = useTranslation('common');
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT,NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = props;
 
  const renderCycleDetailComponent = () => {
    if (cycle) {
      const res = <CycleDetailComponent />;
      if (cycle.access === 1) return res;
      if (cycle.access === 2) return res;
      if (cycle.access === 3 && !cycle.currentUserIsParticipant) return <Alert>Not authorized</Alert>;
    }

    if (/* isLoadingSession || */ isFetching || isLoading ) {
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
    show(<SignInForm/>)
    // setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const {
    mutate: execJoinCycle,
    isLoading: isJoinCycleLoading,
    data: mutationResponse,
    isSuccess:isJoined,    
  } = useJoinUserToCycleAction(session?.user,cycle!,participants||[],(_data,error)=>{
        if(!error)
          toast.success(t('OK'));
        else
          toast.success(t('Internal Server Error'));
  });

  const requestJoinCycle = async () => {
    if (!session) openSignInModal();
    else if (cycle) {
      execJoinCycle();       
    }
  };

  const isPending = ()=> isFetchingCycle>0||isJoinCycleLoading||isLoading||isLoadingParticipants;
  
  if(!isPending() && !cycle)
    return <SimpleLayout title={t('notFound')}>
      <Alert variant='danger'>{t('notFound')}</Alert>
    </SimpleLayout>;

  const getBanner = () => {
    if (cycle && !cycle?.currentUserIsParticipant && router) {
      if (router.asPath.search(/\/cycle\/21/g) > -1)
        return (
          <Banner
            cacheKey={['BANNER-CYCLE', `${cycle.id}`]}
            className="bg-danger"
            style={{}}
            show
            content={
              <aside className="text-center text-white">
                <h2 className="h2">
                Participa en nuestra conversación y aporta para construir espacios digitales para toda la diversidad de cuerpos e identidades
                </h2>
                <p>22 de agosto - 14 de octubre</p>
                <div className="d-grid gap-2">
                  <Button
                    disabled={isPending()}
                    className="pt-2 pb-1 px-5"
                    variant="primary"
                    size="lg"
                    onClick={requestJoinCycle}
                  >
                    <h4 className="text-white fw-bold">
                      ¡Unirse ya! {isPending() && <Spinner size="sm" animation="grow" variant="info" />}
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
      <CycleContext.Provider value={{ cycle, currentUserIsParticipant:cycle?.currentUserIsParticipant, linkToCycle: false }}>
       
      <Head>
        <meta property="og:title" content={props.metas?.title||""}/>
        <meta property="og:url" content={`${WEBAPP_URL}/cycle/${props.metas?.id||""}`} />
        <meta property="og:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas?.storedFile||""}`}/>
        <meta property="og:type" content='article'/>

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content={props.metas?.title||""}></meta>
        {/* <meta name="twitter:description" content=""></meta>*/}
        <meta name="twitter:url" content={`${WEBAPP_URL}/cycle/${props.metas?.id||""}`}></meta>
        <meta name="twitter:image" content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas?.storedFile||""}`}></meta>

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params, req } = ctx;
 const queryClient = new QueryClient() 
 const session = await getSession(ctx)
 
  if (params?.id == null || typeof params.id !== 'string') {
    return { notFound: true };
  }
  //const {id:id_} = context.query;
  const id = parseInt(params.id)

  const wcu = whereCycleParticipants(id)
  const wcp = whereCyclePosts(id)
  const wcw = whereCycleWorks(id)

  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL
  let cycle = await getCycle(id,origin);
  let metaTags = null;
  if(cycle){
    metaTags = {id:cycle?.id, title:cycle?.title, storedFile: cycle?.localImages[0].storedFile}

  }

   await queryClient.prefetchQuery(['CYCLE',`${id}`], ()=>cycle||null)
   const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT,NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

   
   const participants = await getUsers(wcu,origin);
   const {works} = await getWorks(wcw,origin);
   
   await queryClient.prefetchQuery(['USERS',JSON.stringify(wcu)],()=>participants)
   await queryClient.prefetchQuery(['POSTS',JSON.stringify(wcp)],()=>getPosts(wcp,origin))
   await queryClient.prefetchQuery(['WORKS',JSON.stringify(wcw)],()=>works)

   participants.map(p=>{
     queryClient.setQueryData(['USER',`${p.id}`],p)
   })
   works.map(w=>{
    queryClient.setQueryData(['WORK',`${w.id}`],w)
  })
   
  return {
    props: {
      metas:metaTags,
      dehydratedState: dehydrate(queryClient),
      id,
      session,
      NEXT_PUBLIC_AZURE_CDN_ENDPOINT,
      NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME
    },
  }
}

/* export async function getStaticProps(props:{id:string}) {
  const {id} = props
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}`)
  const cycle = await res.json();
  return {
    props: {
      cycle,
    },
    revalidate: 10, // In seconds
  }
} */

/* export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle`)
  const {data:cycles} = await res.json();

  const paths = cycles.map((cycle:CycleMosaicItem) => ({
    params: { id: cycle.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
} */

export default CycleDetailPage;
