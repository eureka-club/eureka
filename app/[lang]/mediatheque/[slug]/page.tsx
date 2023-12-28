import { NextPage } from 'next';
//import { Spinner } from 'react-bootstrap';
import Layout from '@/src/components/layout/Layout';
import Mediatheque from './components/Mediatheque';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
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
//import getLocale from '@/src/getLocale';

interface Props {
    params: { lang: Locale,slug: string }
}

const MediathequePage: NextPage<Props> = async ({ params: { lang, slug } }) => {
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

    const langs = session?.user.language ?? LANGUAGES[lang];

    let id = 0;
    const li = slug.split('-').slice(-1);
    id = parseInt(li[0]);
    const user = await getUser(id, origin);
    
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
        pc.forEach(p=>{
            qc.prefetchQuery({
                queryKey:['POST',p.id.toString()],
                queryFn:()=>p
            })  
        })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'CYCLES-JOINED'],
        queryFn:()=>jc
    })
        jc.forEach(c=>{
            qc.prefetchQuery({
                queryKey:['CYCLE',c.id.toString()],
                queryFn:()=>c
            })  
        })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'CYCLES-CREATED'],
        queryFn:()=>cc
    })
        cc.forEach(c=>{
            qc.prefetchQuery({
                queryKey:['CYCLE',c.id.toString()],
                queryFn:()=>c
            })  
        })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-CYCLES'],
        queryFn:()=>fc
    })
        fc.forEach(c=>{
            qc.prefetchQuery({
                queryKey:['CYCLE',c.id.toString()],
                queryFn:()=>c
            })  
        })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-POSTS'],
        queryFn:()=>fp
    })
        fp.forEach(p=>{
            qc.prefetchQuery({
                queryKey:['POST',p.id.toString()],
                queryFn:()=>p
            })  
        })
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'FAV-WORKS'],
        queryFn:()=>fw
    })
        fw.forEach(w=>{
            qc.prefetchQuery({
                queryKey:['WORK',w.id.toString()],
                queryFn:()=>w
            })  
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
