import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import SignUpJoinToCycleSimpleForm from '@/src/components/forms/SignUpJoinToCycleSimpleForm';
import { getSession } from 'next-auth/react';

// interface Props {
//   session: any;
// }

const RegisterJoinToCyclePage: NextPage = ({  }) => {
  const { t } = useTranslation('signUpForm');  
  
  return (
    <SimpleLayout title={t('Sign up')} showNavBar={false} showFooter={false}>
      <SignUpJoinToCycleSimpleForm noModal/>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: { session },
  };
};

export default RegisterJoinToCyclePage;
