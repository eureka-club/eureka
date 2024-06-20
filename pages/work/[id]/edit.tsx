import { GetServerSideProps, NextPage} from 'next';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import {  Alert } from 'react-bootstrap';
import EditWorkForm from '@/components/forms/EditWorkForm'
import { Session } from '@/src/types';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import Spinner from '@/components/common/Spinner'

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
      <EditWorkForm/>
    </>
  }
  return <Spinner />

}

  return <SimpleLayout title={t('title')}>
    <ButtonsTopActions/>
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
