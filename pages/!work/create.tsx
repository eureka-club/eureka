import { GetServerSideProps, NextPage} from 'next';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';
import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CreateWorkForm from '@/components/forms/CreateWorkForm';
import { Spinner,ButtonGroup, Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

interface Props {
  notFound?: boolean;
  session: Session
}
const CreateWorkPage: NextPage<Props> = ({ notFound, session }) => {
  const { t } = useTranslation('createWorkForm');
  //const {data:session, status} = useSession();
  const router = useRouter();

    useEffect(() => {
            if (notFound) 
                router.push('/');
            
    }, [notFound]);


 if (!notFound) 
  return  (
    <SimpleLayout title={t('title')}>
         {<>
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
  const session = await getSession(ctx);
  if (session == null /*|| !session.user.roles.includes('admin')*/) {
    return { props: { notFound: true } };
  }

  return {
    props: {
      session,
    },
  };
};

export default CreateWorkPage;
