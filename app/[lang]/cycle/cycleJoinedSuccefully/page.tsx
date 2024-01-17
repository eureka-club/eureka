
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
import Layout from '@/src/components/layout/Layout';
import auth_config from 'auth_config';
import { redirect } from 'next/navigation';
import CycleJoinedSuccefully from './component/CycleJoinedSuccefully';

interface Props {
  params:{lang:Locale,id:string}
}
const CycleJoinedSuccefullyPage = async ({params:{lang}}:Props) => {
    const session = await getServerSession(auth_config(lang));
    if(!session)redirect('/');

    const dictionary = await getDictionary(lang);
    const dict={...dictionary['common'],...dictionary['createCycleForm']};
    
    
    return   <Layout dict={dict}>
      <CycleJoinedSuccefully/>
    </Layout>
      
};

export default CycleJoinedSuccefullyPage;