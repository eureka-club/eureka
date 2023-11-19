import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import SignUpJoinToCycleForm from '@/src/components/forms/SignUpJoinToCycleForm ';
import { getSession } from 'next-auth/react';

interface Props {
  session: any;
}

const RegisterJoinToCyclePage: NextPage<Props> = ({ session }) => {
  const { t } = useTranslation('signUpForm'); 
  
  return (
    <SimpleLayout title={t('Sign up')} showNavBar={false} showFooter={false}>
      <SignUpJoinToCycleForm noModal session={session}  />
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
