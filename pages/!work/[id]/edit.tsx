import { GetServerSideProps, NextPage} from 'next';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { Spinner, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

import EditWorkForm from '@/components/forms/EditWorkForm'
import { Session } from '@/src/types';

interface Props {
  session?: Session;
  notFound?:boolean
}
const EditWorkPage: NextPage<Props> = ({ session, notFound }) => {
  const { t } = useTranslation('createWorkForm');
  const router = useRouter();
 
  useEffect(() => {
    if (notFound)
      router.back();

  }, [notFound]);
 
  const goTo=()=>{
    const redirect = localStorage.getItem('redirect')
    if(redirect){
      localStorage.setItem('redirect','')
      router.push(redirect)
    }
    else router.back()
  }
const render = ()=>{
  
  if (!session) 
    return <Alert>{t('notSession')}</Alert>
  else if(router && router.query.id && !notFound){
    return <>
      <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={goTo} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      <EditWorkForm/>
    </>
  }
  return <Spinner animation="grow" variant="info" />

}

  return <SimpleLayout title={t('title')}>
  {render()}
</SimpleLayout>

 
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session == null || !session.user.roles.includes('admin')) {
    return { props: { session, notFound: true } };
  }

  return {
    props: { session},
  };
};

export default EditWorkPage;
