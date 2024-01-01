import { NextPage, Metadata, ResolvingMetadata } from 'next';
import Head from "next/head";
import Manifest from './components/Manifest';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/src/get-dictionary';
import Layout from '@/src/components/layout/Layout';

// import {i18n} from '@/i18n-config'
// export function generateStaticParams(){
//   const res= i18n.locales.map((lang:string)=>({lang}));
//   return res;
// }


interface Props {
  params: { lang: Locale }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  const t: Record<string, string> = { ...dict['meta'] }
  return {
    title: t['manifestTitle'],
    description: t['manifestDescription'],
  }
}

const ManifestPage: NextPage<Props> = async ({ params: { lang } }) => {
  const dictionary = await getDictionary(lang);
  const dict: Record<string, string> = { ...dictionary['manifest'], ...dictionary['meta'], ...dictionary['common'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'] }

  return (<>
    <Head>
      <meta name="title" content={dict['manifestTitle']}></meta>
      <meta name="description" content={dict['manifestDescription']}></meta>
    </Head>
    <Layout dict={dict}>
      <Manifest />
    </Layout>
  </>
  );
};
export default ManifestPage;
