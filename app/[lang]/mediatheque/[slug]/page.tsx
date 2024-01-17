
//import { Spinner } from 'react-bootstrap';
import Layout from '@/src/components/layout/Layout';
import Mediatheque from './components/Mediatheque';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
//import { redirect } from 'next/navigation';
import { getUser } from '@/src/hooks/useUser';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import postsCreated from './actions/postsCreated';
import joinedCycles from './actions/joinedCycles';
import cyclesCreated from './actions/cyclesCreated';
import favPosts from './actions/favPosts';
import favCycles from './actions/favCycles';
import favWorks from './actions/favWorks';
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
//import getLocale from '@/src/getLocale';

interface Props {
    params: { lang: Locale,slug: string }
}

const MediathequePage = async ({ params: { lang, slug } }:Props) => {
    const session = await getServerSession(auth_config(lang));
    //if (!session?.user) redirect('/');
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL
    
    const dictionary = await getDictionary(lang);   
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['countries'],
         ...dictionary['mediatheque'], ...dictionary['searchEngine'],
    }

    let id = getUserIdFromSlug(slug);
    const user = await getUser(id);
    
    const pc = await postsCreated(id,lang);
    const jc = await joinedCycles(id,lang);
    const cc = await cyclesCreated(id,lang)
    
    const fp = await favPosts(id,lang)
    const fc = await favCycles(id,lang)
    const fw = await favWorks(id,lang)

    const qc = new QueryClient();

    qc.prefetchQuery({
        queryKey:['USER',id.toString()],
        queryFn: ()=> user
    });
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'POSTS-CREATED'],
        queryFn:()=>pc
    })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'CYCLES-JOINED'],
        queryFn:()=>jc
    })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'CYCLES-CREATED'],
        queryFn:()=>cc
    })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-CYCLES'],
        queryFn:()=>fc
    })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-POSTS'],
        queryFn:()=>fp
    })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-WORKS'],
        queryFn:()=>fw
    })

    return (
        <Layout dict={dict}>
        <HydrationBoundary state={dehydrate(qc)}>
            <Mediatheque session={session} />  
        </HydrationBoundary>
        </Layout>
    );
};



export default MediathequePage;
