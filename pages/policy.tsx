import {GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TermsAndPolicy from '@/src/components/TermsAndPolicy';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';

interface Props{
  session:Session
}
const policyPage: NextPage<Props> = ({session}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {t } = useTranslation('termsAndPolicy');

  return (<>
    <Head>
        <meta name="title" content={t('meta:policyTitle')}></meta>
        <meta name="description" content={t('meta:policyDescription')}></meta>
    </Head> 
    <SimpleLayout title={t('termsAndPolicy')}>
          <TermsAndPolicy/>
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


export default policyPage;
