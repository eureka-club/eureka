
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import PaymentSuccess from './component/PaymentSuccess';



interface Props {
    params: { lang: Locale, id: string }
}

const PaymentSuccessPage = async ({ params: { lang,id } }:Props) => {
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['common'], ...dictionary['navbar'], ...dictionary['stripe'],
    }

    const langs = session?.user.language ?? LANGUAGES[lang];

    return (
        <Layout dict={dict} showNavBar={false} >
            <PaymentSuccess session={session} cycleId={id}/>
        </Layout>
    );
};



export default PaymentSuccessPage;
