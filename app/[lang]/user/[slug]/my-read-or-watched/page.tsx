
import Layout from '@/src/components/layout/Layout';
import MyReadOrWatched from './component/MyReadOrWatched';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
import { getUser } from '@/src/hooks/useUser';
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
import { QueryClient } from '@tanstack/react-query';
import { getReadOrWatchedWorks } from '../../../../../src/hooks/useReadOrWatchedWorks';

interface Props {
    params: { lang: Locale, slug: string }
}

const MyReadOrWatchedPage = async ({ params: { lang, slug } }:Props) => {
    const session = await getServerSession(auth_config(lang));

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['aboutUs'],
        ...dictionary['meta'], ...dictionary['common'],
        ...dictionary['topics'], ...dictionary['navbar'],
        ...dictionary['signInForm'], ...dictionary['countries'], ...dictionary['mediatheque'], ...dictionary['searchEngine'],
    }

    const qc = new QueryClient();
    
    let id = getUserIdFromSlug(slug);
    const user = await getUser(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString()],
        queryFn:()=>user
    });

    const readOrWatchedWorks=await getReadOrWatchedWorks(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'READ-OR-WATCHED'],
        queryFn:()=>readOrWatchedWorks
    });
        readOrWatchedWorks?.forEach(rww=>{
            qc.prefetchQuery({
                queryKey:['WORK',rww.work?.id.toString()],
                queryFn:()=>rww.work
            });
        })

    return (
        <Layout dict={dict}>
            <MyReadOrWatched />
        </Layout>
    );
};



export default MyReadOrWatchedPage;
