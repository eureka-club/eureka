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

import useCycles from '../../src/useCycles';
import { CycleContext } from '../../src/useCycleContext';

const CycleDetailPage: NextPage = () => {
  const session = useSession as unknown as Session;
  const router = useRouter();
  const [id, setId] = useState<string>();
  const { data, isSuccess, isLoading, isFetching, isError, error } = useCycles(id);
  const [cycle, setCycle] = useState<CycleMosaicItem | undefined>(undefined);
  const { t } = useTranslation('common');
  useEffect(() => {
    if (router && router.query) setId(() => router.query.id as string);
  }, [router]);

  useEffect(() => {
    if (session && data && router) {
      const c = data as CycleMosaicItem;
      if (c) {
        setCycle(c);
        if (c) {
          if (c.access !== 1) {
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
          <CycleContext.Provider value={{ cycle }}>
            <CycleDetailComponent />
          </CycleContext.Provider>
        )}
        {(isFetching || !isSuccess) && <Spinner animation="grow" variant="secondary" />}
        {isError && !cycle && (
          <Alert variant="warning">
            <>{error}</>
          </Alert>
        )}
        {!(isFetching || isLoading) && !cycle && (
          <Alert variant="warning">
            <>{t('notFound')}</>
          </Alert>
        )}
      </>
    </SimpleLayout>
  );
};

export default CycleDetailPage;
