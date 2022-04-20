import { GetServerSideProps,NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {getSession, useSession } from 'next-auth/react';
import { useState, useEffect, SyntheticEvent } from 'react';
import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import EditUserForm from '@/components/forms/EditUserForm';


interface Props {
  notFound?: boolean;
}

const Profile: NextPage<Props> = ({notFound}) => {
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading";
  const [id, setId] = useState<string>('');
  const [idSession, setIdSession] = useState<string>('');
  const router = useRouter();
  
  const { t } = useTranslation('profile');

useEffect(() => {
            if (notFound) 
                router.push('/login');
            
    }, [notFound]);

if (!notFound) 
  return (
    <SimpleLayout title={t('Profile')}>
     {(isLoadingSession) ?
        <Spinner animation="grow" variant="info" />
  :
      <>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      <EditUserForm />  
          </>}
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
  if (session == null ) {
    return { props: { notFound: true } };
  }

  return {
    props: {},
  };
};


export default Profile;
