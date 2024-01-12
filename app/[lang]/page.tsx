import { Metadata, ResolvingMetadata } from 'next';
import { Locale } from 'i18n-config'
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';

import { lazy, Suspense } from 'react';
import { NextPage } from 'next';
// import { GetServerSideProps } from 'next';
import Head from "next/head";
import { Spinner } from 'react-bootstrap';
//import Layout from '@/components/layouts/Layout';
//import { getSession } from 'next-auth/react';
//import useTranslation from 'next-translate/useTranslation';
import { GetAllByResonse, Session } from '@/src/types';
// import {getMyCycles,myCyclesWhere} from '@/src/useMyCycles';
import auth_config from 'auth_config';


const HomeSingIn = lazy(() => import('@/src/components/HomeSingIn'));

// <Head>
//   <meta name="title" content={t('meta:indexTitle')}></meta>
//   <meta name="description" content={t('meta:indexDescription')}></meta>

//   <meta property="og:title" content="Eureka" />
//   <meta property="og:description" content="Activa tu mente, transforma el mundo" />
//   <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} />
//   <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} />
//   <meta property="og:type" content="website" />

//   <meta name="twitter:card" content="summary_large_image"></meta>
//   <meta name="twitter:site" content="@eleurekaclub"></meta>
//   <meta name="twitter:title" content="Eureka"></meta>
//   <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
//   <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`}></meta>
//   <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`}></meta>
// </Head>
interface Props{
  params: {lang:Locale}
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  const t: Record<string, string> = { ...dict['meta'], ...dict['common'] }
  return {
    title: `${t['browserTitleWelcome']} · Eureka`,
    description: t['indexDescription'],
    openGraph: {
      title: t['indexTitle'],
      description: t['indexDescription'],
      url: `${process.env.NEXT_PUBLIC_WEBAPP_URL}`,
      images: `${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`,
      type:'website'
    },
    twitter:{
      card:'summary_large_image',
      site:'@eleurekaclub'
    }
  }
}

export default async function IndexPage(props:Props) {
  const {params:{lang}} = props;
  const dictionary = await getDictionary(lang);
  const dict: Record<string, string> = { ...dictionary['meta'], ...dictionary['common'],
    ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'], ...dictionary['createPostForm'] }
debugger;
  const session = await getServerSession(auth_config(lang));

  const langs = session?.user.language ?? lang;

  return (
    <>
      <Layout dict={dict} langs={langs} showCustomBaner={(!session) ? true : false}> 
        {/* <Suspense fallback={<Spinner animation="grow" />}> */}
          <HomeSingIn /> 
        {/* </Suspense> */}
       </Layout> 
    </>
  );
};