import { GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
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
    <SimpleLayout title={t('meta:aboutTitle')}>
      <>Componente aca</>
      <p>{t('test')}</p>
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
