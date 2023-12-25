import { NextPage } from 'next';
import Head from "next/head";
import {getCycles} from '@/src/hooks/useCycles'
import {getPosts} from '@/src/hooks/usePosts'
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { getWork } from '@/src/hooks/useWork';
import Layout from '@/src/components/layout/Layout';
import { LANGUAGES } from '@/src/constants';
import WorkCreate from './component/WorkCreate';
import { redirect } from 'next/navigation';
import auth_config from '@/auth_config';


interface Props{
    params:{lang:Locale,id:string}
  }
  const WorkCreatePage: NextPage<Props> =async ({params:{lang,id}}) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
      ...dictionary['topics'], ...dictionary['countries'],...dictionary['navbar'],
     ...dictionary['signInForm'],...dictionary['workDetail'], 
     ...dictionary['createWorkForm']
    }
  
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');


    const langs = session?.user.language??LANGUAGES[lang];

    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    
    return (<>
      <Head>
        <meta name="title" content={dict['aboutUsTitle']}></meta>
        <meta name="description" content={dict['aboutUsDescription']}></meta>
      </Head>
  
      <Layout dict={dict} langs={langs} >
        <WorkCreate/>
      </Layout>
    </>
    );
  };

export default WorkCreatePage;
