import { GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';

import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import About from './components/About';
interface Props{
  session:Session
}
const AboutPage: NextPage<Props> = ({session}) => {
  const { t } = useTranslation('about');

  return (<>
  <Head>
        <meta name="title" content={t('meta:aboutTitle')}></meta>
        <meta name="description" content={t('meta:aboutDescription')}></meta>
    </Head> 
    <style jsx global>{`
      body{
        background-color:white!important;
      }
    `}</style>
    <SimpleLayout fullWidth title={t('meta:aboutTitle')}>
      <About/>
    </SimpleLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
  
};
export default AboutPage;
