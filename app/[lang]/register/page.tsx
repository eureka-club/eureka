
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import SignUpForm from '@/src/components/forms/SignUpForm';

interface Props {
    params: { lang: Locale}
}

const RegisterPage = async ({ params: { lang } }:Props) => {
    const session = await getServerSession(auth_config(lang));
    if (session?.user) redirect('/');
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['signUpForm'], ...dictionary['countries'],
    }

    const langs = session?.user.language ?? LANGUAGES[lang];

    return (
        <Layout dict={dict} showNavBar={false} showFooter={false}>
            <SignUpForm noModal />
        </Layout>
    );
};



export default RegisterPage;
