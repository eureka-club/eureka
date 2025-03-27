import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import SignInForm from '../src/components/forms/SignInForm';
import { Container } from '@mui/material';

const LoginPage: NextPage = () => {
  
  const { t } = useTranslation('signInForm');

  return (
    <SimpleLayout allPageSize={true} title={t('login')} showNavBar={false} showFooter={false}>
    <Container sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
          <SignInForm noModal  />
     </Container>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }
 // if (session != null) {
    //return { redirect: { destination: '/', permanent: false } };
 // }

  return { props: {session} };
};

export default LoginPage;
