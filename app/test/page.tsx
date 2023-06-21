import { NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import Manifest from './components/Manifest';

const ManifestPage: NextPage = () => {
  const { t } = useTranslation('manifest');
  return (<>
   <Head>
        <meta name="title" content={t('meta:manifestTitle')}></meta>
        <meta name="description" content={t('meta:manifestDescription')}></meta>
    </Head>    
      <Manifest/>
    </>
  );
};
export default ManifestPage;
