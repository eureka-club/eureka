import { NextPage } from 'next';
//import { Spinner } from 'react-bootstrap';
import Layout from '@/src/components/layout/Layout';
import MySaved from './component/MySaved';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/hooks/useUser';
//import getLocale from '@/src/getLocale';

interface Props {
    params: { lang: Locale, slug: string }
}

const MySavedPage: NextPage<Props> = async ({ params: { lang, slug } }) => {
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['countries'], ...dictionary['mediatheque'], ...dictionary['searchEngine'],
    }

    const langs = session?.user.language ?? LANGUAGES[lang];

    let id = 0;
    const li = slug.split('-').slice(-1);
    id = parseInt(li[0]);
    const user = await getUser(id, origin)
    //console.log(user, 'useruseruseruseruser')

    return (
        <Layout dict={dict}>
            <MySaved />
        </Layout>
    );
};



export default MySavedPage;
