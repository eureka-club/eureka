import { NextPage, Metadata, ResolvingMetadata } from 'next';
import Head from "next/head";
import Manifest from './components/Manifest';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/src/get-dictionary';
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';
import { DictContext } from '@/src/hooks/useDictContext';

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
  // const { t } = useTranslation('manifest');
  const dictionary = await getDictionary(lang);
  const dict: Record<string, string> = { ...dictionary['manifest'], ...dictionary['meta'], ...dictionary['common'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'] }
  const session = await getServerSession()
  const langs = session?.user.language??lang

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
