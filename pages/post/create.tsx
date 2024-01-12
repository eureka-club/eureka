import { GetServerSideProps, NextPage} from 'next';
import { useEffect } from 'react';
import { getSession,useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';
// import { Session } from '../../src/types';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
//import CreatePostForm from '../../src/components/forms/CreatePostForm';
import CreatePostForm from '../../src/components/forms/CreatePostForm';
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
  const params=useParams();
  
    useEffect(() => {
            if (notFound) 
                router.push('/login');
    }, [notFound]);


 if (!notFound) 
  return  (
    <SimpleLayout title={t('title')}>
         <section className='d-flex flex-column-reverse flex-lg-row'>
         <Col xs={12} lg={2} className="me-4" >
          <section className='mt-5'>
            <h3 className="text-secondary fw-bold">{t('DoubtsAI')}</h3>
            {/*<Link legacyBehavior  href="/about"><a className='text-primary text-decoration-underline text-blue' onClick={()=> window.scrollTo(0, 0)}>{t('browserTitleAbout')} </a></Link>*/}
        </section>
          <section  className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout1')}</p>
          </section>
            <section  className="mt-4 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation" >
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout2')}</p>
          </section>
            <section  className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout3')}</p>
          </section>
            <section  className="mt-4 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation" >
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout4')}</p>
          </section>
             <section  className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout5')}</p>
          </section>
        </Col>    
        <Col xs={12} lg={10}>
         <section className='ms-0 ms-lg-4'>  
         {(isLoadingSession) ?
        <Spinner animation="grow" variant="info" />:<>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      <CreatePostForm noModal params={params}/></>}
      </section> 
       </Col>  
     </section>  
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
