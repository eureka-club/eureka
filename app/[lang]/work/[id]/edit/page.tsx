import { NextPage } from 'next';
import Head from "next/head";
import EditWorkForm from '@/components/forms/EditWorkForm';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import auth_config from '@/auth_config';
import { getWork } from '@/src/hooks/useWork';
import Layout from '@/src/components/layout/Layout';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';


interface Props {
    params: { lang: Locale, id: string }
}
const EditWorkPage: NextPage<Props> = async ({ params: { lang, id } }) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['countries'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['workDetail'],
        ...dictionary['cycleDetail'],
        ...dictionary['createWorkForm']
    }

    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');

    const langs = session?.user.language ?? LANGUAGES[lang];

    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    let work = await getWork(+id, undefined, origin);  // sin restriccion de idioma para editar undefined (notLangRestrict)

    return (<>
        <Head>
            <meta name="title" content={dict['aboutUsTitle']}></meta>
            <meta name="description" content={dict['aboutUsDescription']}></meta>
        </Head>

        <Layout dict={dict}>
            <EditWorkForm work={work} session={session} />
        </Layout>
    </>
    );
};


export default EditWorkPage;
