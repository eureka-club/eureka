import { NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';

import { Container } from '@mui/material';
import About from './components/About';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('common');

  return (<>
    <Head>
        <meta name="title" content={t('meta:aboutTitle')}></meta>
        <meta name="description" content={t('meta:aboutDescription')}></meta>
    </Head> 
    <About/>
    </>
  );
};

export default AboutPage;
