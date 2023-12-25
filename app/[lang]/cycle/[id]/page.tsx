import { NextPage } from 'next';
import { getPosts } from '@/src/hooks/usePosts';
import { getWorks } from '@/src/hooks/useWorks';
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from '@/i18n-config';
import { getCycle } from '@/src/hooks/useCycle';
import { getUsers } from '@/src/hooks/useUsers';
import { LANGUAGES } from '@/src/constants';
import Layout from '@/src/components/layout/Layout';
import Cycle from './component/Cycle';
import auth_config from '@/auth_config';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import GetPosts from '@/src/actions/GetPosts';

const whereCycleParticipants = (id: number) => ({
  where: {
    OR: [
      { cycles: { some: { id } } }, //creator
      { joinedCycles: { some: { id } } }, //participants
    ],
  },
});

const whereCycleWorks = (id: number) => ({ where: { cycles: { some: { id } } } });
const whereCyclePosts = (id: number) => ({ take: 8, where: { cycles: { some: { id } } } });

interface Props {
  params:{lang:Locale,id:string}
}
const CyclePage: NextPage<Props> = async ({params:{lang,id}}) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
     ...dictionary['topics'],...dictionary['navbar'],
     ...dictionary['signInForm'],
     ...dictionary['cycleDetail'],
      ...dictionary['createPostForm'] 
    }

  const session = await getServerSession(auth_config(lang));
    const langs = session?.user.language??LANGUAGES[lang];

    const wcu = whereCycleParticipants(+id);
    const wcp = whereCyclePosts(+id);
    const wcw = whereCycleWorks(+id);

    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
    let cycle = await getCycle(+id, origin);
    let metaTags = null;
    if (cycle) {
        metaTags = {
        id: cycle?.id,
        title: cycle?.title,
        creator: cycle.creator.name,
        works: cycle.works.map((x) => `${x.title} - ${x.author}`).join(),
        storedFile: cycle?.localImages[0].storedFile,
        };
    }

    const { DATE_FORMAT_SHORT } = process.env;

    
    const participants = await getUsers(wcu, origin);
    const { works } = await getWorks(langs,wcw, origin);
    const qc = new QueryClient();
    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString()],
      queryFn:()=>getCycle(+id,origin)
    })
    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString(),'POSTS'],
      queryFn:async ()=> await GetPosts(+id)
    })
    // await queryClient.prefetchQuery(['USERS', JSON.stringify(wcu)], () => participants);
    // await queryClient.prefetchQuery(['POSTS', JSON.stringify(wcp)], () => getPosts(ctx.locale!,wcp, origin));
    // await queryClient.prefetchQuery(['WORKS', JSON.stringify(wcw)], () => works);

    return   <Layout dict={dict} >
      <HydrationBoundary state={dehydrate(qc)}>
        <Cycle participants={participants!} session={session!}/>
      </HydrationBoundary>
    </Layout>
      
};

export default CyclePage;