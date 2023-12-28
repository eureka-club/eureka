import { NextPage } from 'next';
import { getPosts } from '@/src/hooks/usePosts';
import { getWorks } from '@/src/hooks/useWorks';
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from '@/i18n-config';
import { getCycle } from '@/src/hooks/useCycle';
import { getUsers } from '@/src/hooks/useUsers';
import { LANGUAGES } from '@/src/constants';
import Layout from '@/src/components/layout/Layout';
import SignUpJoinToCycleForm from '@/components/forms/SignUpJoinToCycleForm ';
import auth_config from '@/auth_config';


interface Props {
    params: { lang: Locale, id: string }
}
const CyclePage: NextPage<Props> = async ({ params: { lang, id } }) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['signUpForm'], ...dictionary['countries'],
    }

    const session = await getServerSession(auth_config(lang));
    // const langs = session?.user.language ?? LANGUAGES[lang];
    // const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
    let cycle = await getCycle(+id);

    
    return <Layout dict={dict} showNavBar={false}>
        <SignUpJoinToCycleForm cycle={cycle!}  session={session!} />
    </Layout>

};

export default CyclePage;