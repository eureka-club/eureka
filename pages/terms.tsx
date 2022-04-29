import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TermsAndPolicy from '@/src/components/TermsAndPolicy';

const TermsPage: NextPage = () => {
  const { t } = useTranslation('signUpForm');

  return (
    <SimpleLayout title={t('Sign up')} showNavBar={false}>
          <TermsAndPolicy/>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return { props: {} };
};

export default TermsPage;
