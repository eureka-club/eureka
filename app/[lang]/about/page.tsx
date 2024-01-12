import Head from "next/head";
import About from './components/About';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';

interface Props {
  params: { lang: Locale }
}
const AboutPage = async ({ params: { lang } }:Props) => {
  const dictionary = await getDictionary(lang);
  const dict = { ...dictionary['aboutUs'], ...dictionary['meta'], ...dictionary['common'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'] }

  const session = await getServerSession()
  const langs = session?.user.language??lang

  return (<>
    <Head>
      <meta name="title" content={dict['aboutTitle']}></meta>
      <meta name="description" content={dict['aboutDescription']}></meta>
    </Head>
    <Layout dict={dict} langs={langs} >
      <About />
    </Layout>
  </>
  );
};

export default AboutPage;
