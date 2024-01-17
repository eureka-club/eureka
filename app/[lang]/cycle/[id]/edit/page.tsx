import Head from "next/head";
import EditCycleForm from '@/components/forms/EditCycleForm';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import auth_config from 'auth_config';
import { getCycle } from '@/src/hooks/useCycle';
import Layout from '@/src/components/layout/Layout';
import { redirect } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';



interface Props {
    params: { lang: Locale, id: string }
}
const EditCyclePage = async ({ params: { lang, id } }:Props) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['countries'],
        ...dictionary['signInForm'], ...dictionary['createWorkForm'],
        ...dictionary['createCycleForm'],...dictionary['topics']
    }

    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');
    
    const qc = new QueryClient();

    let cycle = await getCycle(+id, origin);
    qc.prefetchQuery({
        queryKey:['CYCLE',id.toString()],
        queryFn:()=>cycle
    })

    return (<>
        <Head>
            <meta name="title" content={dict['aboutUsTitle']}></meta>
            <meta name="description" content={dict['aboutUsDescription']}></meta>
        </Head>
        <Layout dict={dict}>
            <EditCycleForm />
        </Layout>
    </>
    );
};


export default EditCyclePage;
