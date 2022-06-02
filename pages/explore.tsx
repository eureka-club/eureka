import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Container from 'react-bootstrap/Container';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import BannerCustomizable from '@/src/components/BannerCustomizable';


//import SignInForm from '../src/components/forms/SignInForm';

const ExplorePage: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
    <BannerCustomizable/>
    <SimpleLayout title={t('Explore')}>
        AAA
    </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return { props: {} };
};

export default ExplorePage;
