import { NextPage } from 'next';
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
import useCycle from '../../src/useCycle';
import { CycleContext, useCycleContext } from '../../src/useCycleContext';
import globalModalsAtom from '../../src/atoms/globalModals';
import HelmetMetaData from '../../src/components/HelmetMetaData'
import { WEBAPP_URL } from '../../src/constants';
import {CycleMosaicItem} from '@/src/types/cycle'
interface Props{
  cycle:CycleMosaicItem
}
// const getCycle = async (id:string)=>{
//   const res = await fetch(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}`)
//   return res.json();
//   }
const CycleDetailPage: NextPage<Props> = () => {
  const [session, isLoadingSession] = useSession();
  const router = useRouter();
  const [id, setId] = useState<string>('');
  
  const { data: cycle, isSuccess, isLoading, isFetching, isError, error } = useCycle(+id);
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

  useEffect(() => {
    if (router && router.query) setId(() => router.query.id as string);
  }, [router]);

  useEffect(() => {
    if (+id /* && isSuccess */ && (!cycle || !cycle.id)) {
      queryClient.invalidateQueries(['CYCLE', `${+id}`]);
    }
    // if (cycle) {
    //   const c = cycle as CycleMosaicItem;
    //   if (c) {
    //     setCycle(c);
    //   }
    // }
  }, [cycle, /* isSuccess, */ id]);

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
        const { participants } = cycle;
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
      setIsRequestingJoinCycle(true);
      const res = await execJoinCycle(cycle);
      if (res)
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'info',
            title: t('Join Cycle request notification'),
            message: t(res),
          },
        });
      if (res === 'OK') queryClient.invalidateQueries(['CYCLE', `${cycle.id}`]);
      setIsRequestingJoinCycle(false);
    }
  };

  const getBanner = () => {
    if (!currentUserIsParticipant && router && cycle) {
      if (router.asPath.search(/\/cycle\/16/g) > -1)
        return (
          <Banner
            cacheKey={['BANNER-CYCLE', `${cycle.id}`]}
            className="bg-danger"
            style={{}}
            show
            content={
              <aside className="text-center text-white">
                <h2 className="h2">
                  Participa en la conversación sobre adicción, desinformación y violencia en redes sociales
                </h2>
                <p>16 de noviembre - 12 de diciembre</p>

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
       
        <HelmetMetaData title={cycle.title}
        type='article'
        url={`${WEBAPP_URL}/cycle/${cycle.id}`}
        image={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${cycle.localImages ? cycle.localImages[0].storedFile:undefined}`}
        ></HelmetMetaData>

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

/* export async function getServerSideProps(context:{query:{id:string}}) {
  const {id} = context.query;
  

  const queryClient = new QueryClient()
 
   await queryClient.prefetchQuery('cycle', ()=>getCycle(id))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
 */
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
