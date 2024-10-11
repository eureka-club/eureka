import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import SimpleLayout from '../../../src/components/layouts/SimpleLayout';
import EditCycleForm from '../../../src/components/forms/EditCycleForm';
import useCycleDetail,{getCycleDetail} from '@/src/useCycleDetail';
import { useEffect, useState } from 'react';
import { Cycle } from '@prisma/client';
import { Session } from '@/src/types';
import { dehydrate, QueryClient } from 'react-query';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';

interface Props {
  notFound?: boolean;
  session: Session
}

const EditCyclePage: NextPage<Props> = ({session}) => {
  const { t } = useTranslation('createCycleForm');
  const router = useRouter();

  const [id,setId] = useState<string>('')
  useEffect(()=>{
    if(router.query?.id)setId(router.query.id?.toString())
  },[router])
  const {data:cycle,isLoading} = useCycleDetail(+id,{enabled:!!id})

  if(isLoading)
    return <SimpleLayout title={t('editCycle')}>
    <Spinner animation='grow'/>
  </SimpleLayout>

  if(!cycle && !isLoading)
    return <SimpleLayout title={t('editCycle')}>
    {t('common:Not Found')}
  </SimpleLayout>

  if (session == null || (session && session.user.id !== cycle?.creatorId && !(session.user.roles && session.user.roles =='admin'))) {
    return <SimpleLayout title={t('editCycle')}>
      {t('common:Unauthorized')}
    </SimpleLayout>
  }

  return (
    <SimpleLayout title={t('editCycle')}>
      <ButtonsTopActions/>
      <EditCycleForm className="mb-5" cycle={cycle as Cycle} />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cycleId = parseInt(ctx.params?.id as string, 10);
  const session = await getSession(ctx)
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL
 
  const qc = new QueryClient()
  await qc.fetchQuery(['CYCLE', `${cycleId}`], () => getCycleDetail(cycleId))

  // const cycle = await find(cycleId);
  // if (session == null || (session.user.id !== cycle?.creatorId && !session.user.roles.includes('admin'))) {
  //   return { props: { notFound: true } };
  // }

  return {
    props: { 
      session,
      dehydratedState: dehydrate(qc),      
     },

  };
};

export default EditCyclePage;
