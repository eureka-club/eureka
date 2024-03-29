import { GetServerSideProps, NextPage} from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { Spinner, Alert } from 'react-bootstrap';
import EditPostForm from '@/components/forms/EditPostForm'
import { Session } from '@/src/types';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';

interface Props {
  session?: Session;
}
const EditPostPage: NextPage<Props> = ({session}) => {
  const { t } = useTranslation('createPostForm');
  const router = useRouter();
    
  const goTo=()=>{
    const redirect = localStorage.getItem('redirect')
    if(redirect){
      localStorage.setItem('redirect','')
      router.push(redirect)
    }
    else router.back()
  }


  return <SimpleLayout title={t('title')}>
    <ButtonsTopActions/>
    {!session ? <Alert>{t('notSession')}</Alert> : <></> }
    {router && router.query.id 
      ? <>
        <EditPostForm id={+router.query.id.toString()} noModal/>
      </>
      : <Spinner animation="grow" variant="info" />
    }
  </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session == null) {
    return { props: { session } };
  }

  return {
    props: {session},
  };
};

export default EditPostPage;
