
import Layout from '@/src/components/layout/Layout';
import MyCycles from './component/MyCycles';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/hooks/useUser';
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
import { QueryClient } from '@tanstack/react-query';
import { getMyCycles } from '@/src/hooks/useMyCycles';

interface Props {
    params: { lang: Locale, slug: string }
}

const MyCyclesPage = async ({ params: { lang, slug } }:Props) => {
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['countries'], ...dictionary['mediatheque'], ...dictionary['searchEngine'],
    }
    const qc = new QueryClient()

    let id = getUserIdFromSlug(slug);
    const user = await getUser(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString()],
        queryFn:()=>user
    });
    const myCycles=await getMyCycles(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'MY-CYCLES'],
        queryFn:()=>myCycles
    });
        myCycles.forEach(c=>{
            qc.prefetchQuery({
                queryKey:['CYCLE',c.id.toString()],
                queryFn:()=>c
            })
        });

    return (
        <Layout dict={dict}>
            <MyCycles session={session} user={user} />
        </Layout>
    );
};



export default MyCyclesPage;
