import { NextPage , Metadata } from 'next';
import Head from "next/head";
import TermsAndPolicy from './components/TermsAndPolicy';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';

interface Props {
  params: { lang: Locale }
}
const PolicyPage = async ({ params: { lang } }:Props) => {
  const dictionary = await getDictionary(lang)
  const dict: Record<string, string> = { ...dictionary['termsAndPolicy'], ...dictionary['meta'], ...dictionary['common'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'] }

  const session = await getServerSession();
  const langs = session?.user.language??lang;
  
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
