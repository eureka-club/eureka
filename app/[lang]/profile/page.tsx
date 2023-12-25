import { NextPage } from 'next';
import { Spinner } from 'react-bootstrap';
import Layout from '@/src/components/layout/Layout';
import Profile from './component/Profile';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/hooks/useUser';
import getLocale from '@/src/getLocale';

interface Props {
    params: { lang: Locale }
}

const ProfilePage: NextPage<Props> = async ({ params: { lang } }) => {
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    const dictionary = await getDictionary(lang);

    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['countries'], ...dictionary['profile'],
    }

    const langs = session?.user.language ?? LANGUAGES[lang];

    let user = await getUser(+session?.user.id.toString(), origin, langs);
    return (
        <Layout dict={dict}>
            <Profile user={user!} session={session} />
        </Layout>
    );

};



export default ProfilePage;
