import { GetServerSideProps, NextPage} from 'next';
import { useEffect } from 'react';
import { getSession,useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
//import CreatePostForm from '../../src/components/forms/CreatePostForm';
import CreatePostForm from '../../src/components/forms/CreateIAPostForm';
import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import { stubFalse } from 'lodash';

interface Props {
  notFound?: boolean;
}
const CreatePostPage: NextPage<Props> = ({notFound}) => {
  const { t } = useTranslation('createPostForm');
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"
  const router = useRouter();
  const query = router.query;

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
      <CreatePostForm noModal params={query}/></>}
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
  if (session == null) {
    return { props: { notFound: true } };
  }

  return {
    props: {},
  };
};

export default CreatePostPage;
