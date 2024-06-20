import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { getSession,useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
// import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CreateCycleForm from '../../src/components/forms/CreateCycleForm';

import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import Spinner from '@/components/common/Spinner'

interface Props {
  notFound?: boolean;
}

const CreateCyclePage: NextPage<Props> = ({notFound}) => {
  const { t } = useTranslation('createCycleForm');
 const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  const router = useRouter();

useEffect(() => {
            if (notFound) 
                router.push('/');
            
    }, [notFound]);

if (!notFound) 
  return  (
    <SimpleLayout title={t('createCycle')}>
      <ButtonsTopActions/>
         {
          (isLoadingSession) 
          ? <Spinner />
          : <>
              <CreateCycleForm/>
            </>
        }
    </SimpleLayout>
  );
  else
   return  (
    <SimpleLayout title={t('createCycle')}>
       <Spinner />
    </SimpleLayout>
  );

};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session == null || !session.user.roles.includes('admin')) {
    return { props: { notFound: true } };
  }

  return {
    props: {session},
  };
};

export default CreateCyclePage;
