
import Head from "next/head";
import EditPostForm from '@/components/forms/EditPostForm';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import auth_config from 'auth_config';
import { getPost } from '@/src/hooks/usePost';
import Layout from '@/src/components/layout/Layout';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import { QueryClient } from "@tanstack/react-query";

interface Props {
    params: { lang: Locale, id: string }
}
const EditPostPage = async ({ params: { lang, id } }:Props) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['countries'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['workDetail'],
        ...dictionary['cycleDetail'],
        ...dictionary['createPostForm']
    }

    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');

    const langs = session?.user.language ?? LANGUAGES[lang];

    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    let post = await getPost(+id, origin);  
    const qc=new QueryClient();
    qc.prefetchQuery({
        queryKey:['POST',id.toString()],
        queryFn:()=>post
    });

    return (<>
        <Head>
            <meta name="title" content={dict['aboutUsTitle']}></meta>
            <meta name="description" content={dict['aboutUsDescription']}></meta>
        </Head>

        <Layout dict={dict}>
            <EditPostForm />
        </Layout>
    </>
    );
};


export default EditPostPage;
