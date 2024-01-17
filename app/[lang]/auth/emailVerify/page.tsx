import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import Layout from '@/src/components/layout/Layout';
import EmailVerify from './components/EmailVerify';

export default async function EmailVerifyPage({params}:any) {
  const {lang}=params;
  const session = await getServerSession(auth_config(lang));
  
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }
  const dictionary = await getDictionary(lang);
  const dict = {...dictionary['emailVerify'],...dictionary['common']};
  return  <Layout dict={dict}>
      <EmailVerify/>
    </Layout>
  
};
