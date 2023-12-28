import { NextPage } from 'next';
import Head from "next/head";
import TermsAndPolicy from './components/TermsAndPolicy';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import Layout from '@/src/components/layout/Layout';

import {i18n} from '@/i18n-config'
export function generateStaticParams(){
  const res= i18n.locales.map((lang:string)=>({lang}));
  return res;
}

interface Props {
  params: { lang: Locale }
}
const PolicyPage: NextPage<Props> = async ({ params: { lang } }) => {
  const dictionary = await getDictionary(lang)
  const dict: Record<string, string> = { ...dictionary['termsAndPolicy'], ...dictionary['meta'], ...dictionary['common'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'] }
  
  return (<>
    <Head>
      <meta name="title" content={dict.policyTitle}></meta>
      <meta name="description" content={dict.policyDescription}></meta>
    </Head>
    <Layout dict={dict}>
      <TermsAndPolicy/>
    </Layout>
  </>
  );
};
export default PolicyPage;


