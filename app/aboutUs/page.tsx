import { NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import AboutUs from './components/AboutUs';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('aboutUs');
  const NEXT_PUBLIC_AZURE_CDN_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT;
  const NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME;
  return (<>
    <Head>
      <meta name="title" content={t('meta:aboutUsTitle')}></meta>
      <meta name="description" content={t('meta:aboutUsDescription')}></meta>
    </Head>
      <AboutUs 
        NEXT_PUBLIC_AZURE_CDN_ENDPOINT={NEXT_PUBLIC_AZURE_CDN_ENDPOINT!}
        NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME={NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!}
      />
  </>
  );
};

export default AboutPage;
