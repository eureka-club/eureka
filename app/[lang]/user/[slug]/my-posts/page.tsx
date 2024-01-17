
import Layout from '@/src/components/layout/Layout';
import MyPosts from './component/MyPosts';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { redirect } from 'next/navigation';
import { getUser } from '@/src/hooks/useUser';
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
import { QueryClient } from '@tanstack/react-query';
import { getMyPosts } from '@/src/hooks/useMyPosts';

interface Props {
    params: { lang: Locale, slug: string }
}

const MyPostsPage = async ({ params: { lang, slug } }:Props) => {
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
    })
    const postsCreated=await getMyPosts(id);
    qc.prefetchQuery({
        queryKey:['USER',id.toString(),'POSTS-CREATED'],
        queryFn:()=>postsCreated
    });
        postsCreated.forEach(p=>{
            qc.prefetchQuery({
                queryKey:["POSTS",p.id.toString()],
                queryFn:()=>p
            })
        })

    return (
        <Layout dict={dict}>
            <MyPosts session={session} user={user} />
        </Layout>
    );
};

export default MyPostsPage;
