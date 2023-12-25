import { NextPage } from 'next';
import Layout from '@/src/components/layout/Layout';
import FeaturedPosts from './component/FeaturedPosts';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/hooks/useUser';

interface Props {
    params: { lang: Locale }
}

const FeaturedPostsPage: NextPage<Props> = async ({ params: { lang } }) => {
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    const dictionary = await getDictionary(lang);

    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
    }
    const langs = session?.user.language ?? LANGUAGES[lang];

    let user = await getUser(+session?.user.id.toString(), origin, langs);
    return (
        <Layout dict={dict}>
            <FeaturedPosts session={session} />
        </Layout>
    );

};



export default FeaturedPostsPage;
