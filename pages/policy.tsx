import {NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TermsAndPolicy from '@/src/components/TermsAndPolicy';
//import { useRouter } from 'next/router';


const policyPage: NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {t } = useTranslation('termsAndPolicy');
  //const router = useRouter();
  //const {show} = router.query ;


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


export default policyPage;
