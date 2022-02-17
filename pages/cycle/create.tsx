import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { getSession,useSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CreateCycleForm from '../../src/components/forms/CreateCycleForm';
import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

interface Props {
  notFound?: boolean;
}

const CreateCyclePage: NextPage<Props> = ({notFound}) => {
  const { t } = useTranslation('createCycleForm');
 const [session, isLoadingSession] = useSession();
  const router = useRouter();

useEffect(() => {
            if (notFound) 
                router.push('/login');
            
    }, [notFound]);

if (!notFound) 
  return  (
    <SimpleLayout title={t('createCycle')}>
         {(isLoadingSession) ?
        <Spinner animation="grow" variant="info" />:<>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      <CreateCycleForm/></>}
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
  const session = (await getSession(ctx)) as unknown as Session;
  if (session == null || !session.user.roles.includes('admin')) {
    return { props: { notFound: true } };
  }

  return {
    props: {},
  };
};

export default CreateCyclePage;
