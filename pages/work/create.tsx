import { GetServerSideProps, NextPage} from 'next';
import { useEffect } from 'react';
import { getSession,useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CreateWorkForm from '../../src/components/forms/CreateWorkForm';
import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import { stubFalse } from 'lodash';

interface Props {
  notFound?: boolean;
}
const CreateWorkPage: NextPage<Props> = ({notFound}) => {
  const { t } = useTranslation('createWorkForm');
  const {data:session, status} = useSession();
  const isLoadingSession = status == 'loading'
  const router = useRouter();



    useEffect(() => {
            if (notFound) 
                router.push('/login');
            
    }, [notFound]);


 if (!notFound) 
  return  (
    <SimpleLayout title={t('title')}>
         {(isLoadingSession) ?
        <Spinner animation="grow" variant="info" />:<>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      <CreateWorkForm noModal/></>}
    </SimpleLayout>
  );
  else
   return  (
    <SimpleLayout title={t('title')}>
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

export default CreateWorkPage;
