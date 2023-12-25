import { NextPage } from 'next';
import Head from "next/head";
import EditCycleForm from '@/components/forms/EditCycleForm';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import auth_config from '@/auth_config';
import { getCycle } from '@/src/hooks/useCycle';
import Layout from '@/src/components/layout/Layout';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';



interface Props {
    params: { lang: Locale, id: string }
}
const EditCyclePage: NextPage<Props> = async ({ params: { lang, id } }) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['countries'],
        ...dictionary['signInForm'], ...dictionary['createWorkForm'],
        ...dictionary['createCycleForm']
    }

    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');

    const langs = session?.user.language ?? LANGUAGES[lang];

    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    let cycle = await getCycle(+id, origin);

    return (<>
        <Head>
            <meta name="title" content={dict['aboutUsTitle']}></meta>
            <meta name="description" content={dict['aboutUsDescription']}></meta>
        </Head>
        <Layout dict={dict}>
            <EditCycleForm cycle={cycle!} session={session} />
        </Layout>
    </>
    );
};


export default EditCyclePage;
