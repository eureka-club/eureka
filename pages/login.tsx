import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Container from 'react-bootstrap/Container';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import SignInForm from '../src/components/forms/SignInForm';

const LoginPage: NextPage = () => {
  const { t } = useTranslation('signInForm');

  return (
    <SimpleLayout allPageSize={true} title={t('login')} showNavBar={false} showFooter={false}>
    <Container className='mt-5'>
          <SignInForm noModal  />
     </Container>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ///const session = await getSession(ctx);
 // if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
 // }

  return { props: {} };
};

export default LoginPage;
