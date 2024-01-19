
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from 'i18n-config';
import Layout from '@/src/components/layout/Layout';
import SignUpJoinToCycleForm from '@/components/forms/SignUpJoinToCycleForm ';
import auth_config from 'auth_config';
interface Props {
    params: { lang: Locale, id: string }
}
const CyclePage = async ({ params: { lang, id } }:Props) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['signUpForm'], ...dictionary['countries'],
    }

    const session = await getServerSession(auth_config(lang));
    
    return <Layout dict={dict}  showNavBar={false}>
        <SignUpJoinToCycleForm />
    </Layout>

};

export default CyclePage;