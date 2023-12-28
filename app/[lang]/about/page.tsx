import { NextPage } from 'next';
import Head from "next/head";
import About from './components/About';
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
const AboutPage: NextPage<Props> = async ({ params: { lang } }) => {
  const dictionary = await getDictionary(lang);
  const dict = { ...dictionary['aboutUs'], ...dictionary['meta'], ...dictionary['common'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'] }

  return (<>
    <Head>
      <meta name="title" content={dict['aboutTitle']}></meta>
      <meta name="description" content={dict['aboutDescription']}></meta>
    </Head>
    <Layout dict={dict} >
      <About />
    </Layout>
  </>
  );
};

export default AboutPage;
