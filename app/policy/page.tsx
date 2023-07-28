import { NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import TermsAndPolicy from '@/src/components/TermsAndPolicy';

const PolicyPage: NextPage = () => {
  const {t } = useTranslation('termsAndPolicy');

  return (<>
    <Head>
        <meta name="title" content={t('meta:policyTitle')}></meta>
        <meta name="description" content={t('meta:policyDescription')}></meta>
    </Head> 
          <TermsAndPolicy/>
    </>
  );
};
export default PolicyPage;
