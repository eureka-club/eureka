import { NextPage } from 'next';
import { useSession } from 'next-auth/client';
// import { QueryClient, useQuery } from 'react-query';
// import { dehydrate } from 'react-query/hydration';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { CycleMosaicItem } from '../../src/types/cycle';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CycleDetailComponent from '../../src/components/cycle/CycleDetail';

import useCycle from '../../src/useCycle';
import { CycleContext } from '../../src/useCycleContext';

const CycleDetailPage: NextPage = () => {
  const [session, isLoadingSession] = useSession();
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const { data, isSuccess, isLoading, isFetching, isError, error } = useCycle(+id);
  const [cycle, setCycle] = useState<CycleMosaicItem | undefined>(undefined);
  const { t } = useTranslation('common');

  const [currentUserIsParticipant, setCurrentUserIsParticipant] = useState<boolean>(false);

  useEffect(() => {
    if (router && router.query) setId(() => router.query.id as string);
  }, [router]);

  useEffect(() => {
    if (data) {
      const c = data as CycleMosaicItem;
      if (c) {
        setCycle(c);
      }
    }
  }, [data]);

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
    if (isLoadingSession || isFetching || isLoading) return <Spinner animation="grow" variant="info" />;
    if (cycle) {
      const res = (
        <CycleContext.Provider value={{ cycle, currentUserIsParticipant }}>
          <CycleDetailComponent />
        </CycleContext.Provider>
      );
      if (cycle.access === 1) return res;
      if (cycle.access === 2) return res;
      if (cycle.access === 3 && !currentUserIsParticipant) return <Alert>Not authorized</Alert>;
    }

    if (isError)
      return (
        <Alert variant="warning">
          <>{error}</>
        </Alert>
      );

    return <></>;
  };

  return <SimpleLayout title={cycle ? cycle.title : ''}>{renderCycleDetailComponent()}</SimpleLayout>;
};

export default CycleDetailPage;
