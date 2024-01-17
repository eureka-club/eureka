
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
import Layout from '@/src/components/layout/Layout';
import auth_config from 'auth_config';
import { redirect } from 'next/navigation';
import CycleCreate from './component/CycleCreate';

interface Props {
  params:{lang:Locale,id:string}
}
const CycleCreatePage = async ({params:{lang}}:Props) => {
    const session = await getServerSession(auth_config(lang));
    if(!session)redirect('/');

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
      ...dictionary['topics'], ...dictionary['countries'],...dictionary['navbar'],
     ...dictionary['signInForm'],
     ...dictionary['createCycleForm']
    }

    const langs = session?.user.language??LANGUAGES[lang];
    
    return   <Layout dict={dict}>
      <CycleCreate session={session!}/>
    </Layout>
      
};

export default CycleCreatePage;