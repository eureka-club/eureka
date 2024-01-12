import Head from "next/head";
import AboutUs from './components/AboutUs';
import { Locale } from 'i18n-config';
import { getDictionary } from '@/src/get-dictionary';
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';
interface Props{
  params:{lang:Locale}
}
const AboutPage =async ({params:{lang}}:Props) => {
  // const { t } = useTranslation('aboutUs');
  const dictionary = await getDictionary(lang);
  const dict: Record<string, string> = { ...dictionary['aboutUs'], ...dictionary['meta'], ...dictionary['common'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'] }

  const session = await getServerSession()
  const langs = session?.user.language??lang;

  const NEXT_PUBLIC_AZURE_CDN_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT;
  const NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME;
  return (<>
    <Head>
      <meta name="title" content={dict['aboutUsTitle']}></meta>
      <meta name="description" content={dict['aboutUsDescription']}></meta>
    </Head>

    <Layout dict={dict} langs={langs} >
      <AboutUs
        NEXT_PUBLIC_AZURE_CDN_ENDPOINT={NEXT_PUBLIC_AZURE_CDN_ENDPOINT!}
        NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME={NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!}
      />
    </Layout>
        
  </>
  );
};

export default AboutPage;
