import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import Container from 'react-bootstrap/Container';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import SignInForm from '../src/components/forms/SignInForm';
import { getDictionary, t } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import i18n from 'i18n';

interface Props{
  dict:any
}
const LoginPage: NextPage<Props> = ({dict}) => {

  return (
    <SimpleLayout allPageSize={true} title={t(dict,'login')} showNavBar={false} showFooter={false}>
    <Container className='mt-5'>
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
  const dictionary=await getDictionary(ctx.locale as Locale ?? i18n.defaultLocale);
  const dict = dictionary['signInForm'];
 // if (session != null) {
    //return { redirect: { destination: '/', permanent: false } };
 // }

  return { props: {session,dict} };
};

export default LoginPage;
