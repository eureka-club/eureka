import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import SignUpForm from '@/src/components/forms/SignUpForm';

const StripePaymentSuccessPage: NextPage = () => {
  //const { t } = useTranslation('signUpForm');

  return (
    <SimpleLayout title="Payment Success" showNavBar={false} showFooter={false}>
      <div>Payment Success</div>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // if (session != null) {
  //   return { redirect: { destination: '/', permanent: false } };
  // }

  return { props: {} };
};

export default StripePaymentSuccessPage;
