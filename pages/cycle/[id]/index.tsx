import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import { Button as MaterialButton } from '@mui/material';
import { dehydrate, QueryClient, useIsFetching } from 'react-query';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import CycleDetailComponent from '@/src/components/cycle/CycleDetail';
import Banner from '@/src/components/Banner';
import useCycleDetail, { getCycleDetail } from '@/src/useCycleDetail';
import { getPosts } from '@/src/usePosts';
import { CycleContext } from '@/src/useCycleContext';
import globalModalsAtom from '@/src/atoms/globalModals';
import { ITEMS_IN_LIST_PAGES, WEBAPP_URL } from '@/src/constants';
import toast from 'react-hot-toast';
import { useJoinUserToCycleAction } from '@/src/hooks/mutations/useCycleJoinOrLeaveActions';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '@/components/forms/SignInForm';
import { FC, MouseEvent, useEffect } from 'react';
import { useCycleParticipants } from '@/src/hooks/useCycleParticipants';
import { getCycleParticipants } from '@/src/actions/getCycleParticipants';
import { getWorksSumary } from '@/src/useWorksSumary';
import { CycleSumary } from '@/src/types/cycle';


const whereCycleParticipants = (id: number) => ({
  where: {
    OR: [
      { cycles: { some: { id } } }, //creator
      { joinedCycles: { some: { id } } }, //participants
    ],
  },
});

const whereCycleWorks = (id: number) => ({ where: { cycles: { some: { id } } } });
const whereCyclePosts = (id: number) => ({ take: ITEMS_IN_LIST_PAGES, where: { cycles: { some: { id } } } });

interface Props {
  metas: { id: number; title: string; creator: string; works: string; storedFile: string };
  NEXT_PUBLIC_AZURE_CDN_ENDPOINT: string;
  NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME: string;
}

type CycleDetailComponent_Props = {
  cycleId:number;
  isJoinCycleLoading:boolean;
}
const RenderCycleDetailComponent:FC<CycleDetailComponent_Props> = ({cycleId,isJoinCycleLoading}:CycleDetailComponent_Props) => {
  const{data:session}=useSession();
  const { data: cycle, isLoading, isFetching, isError, error } = useCycleDetail(cycleId, { enabled: !isNaN(cycleId) });
  
  if (cycle) { 
    const res = <div style={isJoinCycleLoading ? {pointerEvents:'none'}:{}}>
      <CycleDetailComponent/>
      </div>
    if([1,2,4].includes(cycle.access))return res;
    if (cycle.access === 3 && !cycle.currentUserIsParticipant && cycle.creatorId!=session?.user.id) return <Alert>Not authorized</Alert>;
    else return res;
  }

  if (/* isLoadingSession || */ isFetching || isLoading) {
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

const CycleDetailPage: NextPage<Props> = (props) => {
  // const [session, isLoadingSession] = useSession();
  const{data:session}=useSession();
  const router = useRouter();
  const {id}=router?.query;
  const cycleId = id?+id?.toString():0;
  const { data: cycle, isLoading } = useCycleDetail(cycleId, { enabled: !isNaN(cycleId) });

  const isFetchingCycle = useIsFetching(['CYCLE', `${cycleId}`]);
  const { show } = useModalContext();

  // const { data: participants, isLoading: isLoadingParticipants } = useUsers(whereCycleParticipants(props.id), {
  //   enabled: !!props.id,
  //   from: 'cycle/[id]',
  // });
  // const {data:participants,isLoading:isLoadingParticipants}=useCycleParticipants(cycle?.id!,{ enabled: !isNaN(cycleId) });

  const { t } = useTranslation('common');
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT, NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = props;

  

  const openSignInModal = () => {
    show(<SignInForm />);
    // setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const {
    mutate: execJoinCycle,
    isLoading: isJoinCycleLoading,
    data: mutationResponse,
    isSuccess: isJoined,
  } = useJoinUserToCycleAction((session as any)?.user, cycle as unknown as CycleSumary, (_data, error) => {
    if (!error) {
      if (cycle && ![2, 4].includes(cycle?.access))
        toast.success(t('OK'))
    }
    else toast.success(t('Internal Server Error'));
  });

  useEffect(() => {
    const { join } = router.query;
    if (
      session?.user &&
      join &&
      cycle?.participants && cycle?.participants.findIndex(i => i.id == session.user.id) == -1
    ) {
      execJoinCycle();
    }
  }, [])

  const requestJoinCycle = async () => {
    if (!session) openSignInModal();
    else if (cycle) {
      execJoinCycle();
    }
  };

  const isPending = () => isFetchingCycle > 0 || isJoinCycleLoading || isLoading;

  if (!isPending() && !cycle)
    return (
      <SimpleLayout title={t('notFound')}>
        <Alert variant="danger">{t('notFound')}</Alert>
      </SimpleLayout>
    );

    
  
    const canEditCycle = (): boolean => {
      if (session && cycle) {
        if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
      }
      return false;
    };

    const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      router.push(`/cycle/${router.query.id}/edit`);
    };

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
                  Participa en nuestra conversación y aporta para construir espacios digitales para toda la diversidad
                  de cuerpos e identidades
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
      <CycleContext.Provider
        value={{ cycle, currentUserIsParticipant: cycle?.currentUserIsParticipant, linkToCycle: false }}
      >
        <Head>
          <meta
            name="title"
            content={`${t('meta:cycleTitle')} ${props.metas.title} ${t('meta:cycleTitle1')} ${props.metas.creator}`}
          ></meta>
          <meta
            name="description"
            content={`${t('meta:cycleDescription')}: ${props.metas.works}.`}
          ></meta>
          <meta property="og:title" content={props.metas?.title || ''} />
          <meta property="og:url" content={`${WEBAPP_URL}/cycle/${props.metas?.id || ''}`} />
          <meta
            property="og:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas?.storedFile || ''
              }`}
          />
          <meta property="og:type" content="article" />

          <meta name="twitter:card" content="summary_large_image"></meta>
          <meta name="twitter:site" content="@eleurekaclub"></meta>
          <meta name="twitter:title" content={props.metas?.title || ''}></meta>
          {/* <meta name="twitter:description" content=""></meta>*/}
          <meta name="twitter:url" content={`${WEBAPP_URL}/cycle/${props.metas?.id || ''}`}></meta>
          <meta
            name="twitter:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${props.metas?.storedFile || ''
              }`}
          ></meta>
        </Head>
        <SimpleLayout banner={getBanner()} title={cycle ? cycle.title : ''}>
        <ButtonsTopActions>
      {
        !router.query.postId && canEditCycle() 
        ? <MaterialButton color="warning" onClick={handleEditClick} size="small" sx={{borderRadius:'0'}}>
              {t('Edit')}
            </MaterialButton>
        : '' 
      }
      {/* TODO cuando se cree la pagina de detalle de la eureka por separado
      esto hay q pasarlo para ella */}
      {/* {
        post && cycle && canEditPost() 
          ? <MaterialButton color="warning" onClick={handleEditPostClick} size="small">
            {t('Edit')}
          </MaterialButton>
          : ''
      } */}
    </ButtonsTopActions>
          <RenderCycleDetailComponent cycleId={cycleId} isJoinCycleLoading={isJoinCycleLoading}/>
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
  const { params, req, query } = ctx;
  const queryClient = new QueryClient();
  const session = await getSession(ctx);

  if (params?.id == null || typeof params.id !== 'string') {
    return { notFound: true };
  }

  const id = parseInt(params.id);


  //const {id:id_} = context.query;

  const wcu = whereCycleParticipants(id);
  const wcp = whereCyclePosts(id);
  const wcw = whereCycleWorks(id);

  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  let cycle = await getCycleDetail(id);
  let metaTags = null;
  if (cycle) {



    metaTags = {
      id: cycle?.id,
      title: cycle?.title,
      creator: cycle.creator.name,
      works: cycle.works.map((x) => `${x.title} - ${x.author}`).join(),
      storedFile: cycle?.localImages[0].storedFile,
    };
  }

  await queryClient.prefetchQuery(['CYCLE', `${id}`], () => cycle || null);
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT, NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  const participants = await getCycleParticipants(cycle?.id!);
  const { works } = await getWorksSumary(ctx.locale!, wcw);

  await queryClient.prefetchQuery(['CYCLE', `${id}`, 'PARTICIPANTS'], () => participants);
  await queryClient.prefetchQuery(['CYCLE', `${id}`,'POSTS'], () => getPosts(ctx.locale!, wcp));
  await queryClient.prefetchQuery(['WORKS', JSON.stringify(wcw)], () => works);

  participants.map((p) => {
    queryClient.setQueryData(['USER', `${p.id}`,'SUMARY'], p);
  });
  works.map((w) => {
    queryClient.setQueryData(['WORK', `${w.id}`,'SUMARY'], w);
  });

  return {
    props: {
      metas: metaTags,
      dehydratedState: dehydrate(queryClient),
      id,
      session,
      NEXT_PUBLIC_AZURE_CDN_ENDPOINT,
      NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME,
    },
  };
};

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

  const paths = cycles.map((cycle:CycleDetail) => ({
    params: { id: cycle.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
} */

export default CycleDetailPage;
