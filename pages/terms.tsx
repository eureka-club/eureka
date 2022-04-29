import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TermsAndPolicy from '@/src/components/TermsAndPolicy';
import { useRouter } from 'next/router';


const TermsPage: NextPage = () => {
  const { t } = useTranslation('termsAndPolicy');
  const router = useRouter();
  const {show} = router.query ;


  return (
    <SimpleLayout title={t('termsAndPolicy')} showNavBar={false}>
          <TermsAndPolicy show={show as string}/>
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
