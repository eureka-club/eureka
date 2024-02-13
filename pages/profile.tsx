import { GetServerSideProps,NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import EditUserForm from '@/components/forms/EditUserForm';
import { Session } from '@/src/types';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
interface Props {
  session:Session
}

const Profile: NextPage<Props> = ({session}) => {
  const router = useRouter();
  const { t } = useTranslation('profile');

  useEffect(() => {
    if (!session) 
        router.push('/');
  }, [session,router]);

if (session) 
  return (
    <SimpleLayout title={t('Profile')}>
      <ButtonsTopActions/>
      <>
        <EditUserForm />  
      </>
    </SimpleLayout>
  );
  else
   return  (
    <SimpleLayout title={t('createCycle')}>
        <Spinner animation="grow" variant="info" />
    </SimpleLayout>
  );
};


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx));

  return {
    props: {session},
  };
};


export default Profile;
