import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import SignUpJoinToCycleForm from '@/src/components/forms/SignUpJoinToCycleForm ';

const RegisterJoinToCyclePage: NextPage = () => {
  const { t } = useTranslation('signUpForm'); 
  
  return (
    <SimpleLayout title={t('Sign up')} showNavBar={false} showFooter={false}>
      <SignUpJoinToCycleForm noModal />
    </SimpleLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   if (session != null) {
//     return { redirect: { destination: '/', permanent: false } };
//   }

//   return { props: {} };
// };

export default RegisterJoinToCyclePage;
