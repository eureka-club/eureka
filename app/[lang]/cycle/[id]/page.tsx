import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from 'i18n-config';
import Layout from '@/src/components/layout/Layout';
import Cycle from './component/Cycle';
import auth_config from 'auth_config';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getCyclePosts } from '@/src/hooks/useCyclePosts';
import { getCycle } from '@/src/actions/cycle/getCycle';
import { getCycleParticipants } from '@/src/actions/cycle/getParticipants';


interface Props {
  params:{lang:Locale,id:string}
}
const CyclePage = async ({params:{lang,id}}:Props) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
     ...dictionary['topics'],...dictionary['navbar'],
     ...dictionary['signInForm'],
     ...dictionary['cycleDetail'],
      ...dictionary['createPostForm'] 
    }
    const session = await getServerSession(auth_config(lang));

    let cycle = await getCycle(+id);
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

    // const { DATE_FORMAT_SHORT } = process.env;
    
    // const { works } = await getWorks(langs,wcw, origin);
    const posts = await getCyclePosts(+id);
    const participants = await getCycleParticipants(+id);

    const qc = new QueryClient();
    qc.prefetchQuery({
        queryKey:['CYCLE',id.toString()],
        queryFn:()=>getCycle(+id)
    })
    qc.prefetchQuery({
        queryKey:['CYCLE',id.toString(),'POSTS'],
        queryFn: ()=> posts
    })
        posts.forEach(p=>{
            qc.prefetchQuery({
                queryKey:['POST',id.toString()],
                queryFn:()=> p
            })
        })

    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString(),'PARTICIPANTS'],
      queryFn: ()=> participants
    })
        participants.forEach(p=>{
            qc.prefetchQuery({
                queryKey:['USER',id.toString()],
                queryFn:()=> p
            })
        })

    return   <Layout dict={dict}>
      <HydrationBoundary state={dehydrate(qc)}>
        <Cycle/>
      </HydrationBoundary>
    </Layout>
};

export default CyclePage;
