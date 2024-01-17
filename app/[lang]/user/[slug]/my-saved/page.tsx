
//import { Spinner } from 'react-bootstrap';
import Layout from '@/src/components/layout/Layout';
import MySaved from './component/MySaved';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/hooks/useUser';
import { QueryClient } from 'react-query';
import { getFavCycles } from '@/src/hooks/useFavCycles';
import { getFavPosts } from '@/src/hooks/useFavPosts';
import { getFavWorks } from '@/src/hooks/useFavWorks';
//import getLocale from '@/src/getLocale';

interface Props {
    params: { lang: Locale, slug: string }
}

const MySavedPage = async ({ params: { lang, slug } }:Props) => {
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
    const qc = new QueryClient();

    let id = 0;
    const li = slug.split('-').slice(-1);
    id = parseInt(li[0]);
    const user = await getUser(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString()],
        queryFn:()=>user
    });
    const favCycles=await getFavCycles(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-CYCLES'],
        queryFn:()=>favCycles
    });
        favCycles.forEach(c=>{
            qc.prefetchQuery({
                queryKey:['CYCLE',c.id.toString()],
                queryFn:()=>c
            })
        })
    const favPosts=await getFavPosts(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-POSTS'],
        queryFn:()=>favPosts
    });
        favPosts.forEach(c=>{
            qc.prefetchQuery({
                queryKey:['POST',c.id.toString()],
                queryFn:()=>c
            })
        })
    const favWorks=await getFavWorks(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-WORKS'],
        queryFn:()=>favWorks
    });
        favWorks.forEach(c=>{
            qc.prefetchQuery({
                queryKey:['WORK',c.id.toString()],
                queryFn:()=>c
            })
        })
    //console.log(user, 'useruseruseruseruser')

    return (
        <Layout dict={dict}>
            <MySaved />
        </Layout>
    );
};



export default MySavedPage;
