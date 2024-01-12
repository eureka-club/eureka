import { GetServerSideProps,NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import {getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Spinner, ButtonGroup, Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import EditUserForm from '@/components/forms/EditUserForm';
import { Session } from '@/src/types';
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
      <>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
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
