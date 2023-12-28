import { NextPage } from 'next';
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from '@/i18n-config';
import Layout from '@/src/components/layout/Layout';
import Cycle from './component/Cycle';
import auth_config from '@/auth_config';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import GetPosts from '@/src/actions/GetPosts';
import { getCycle } from '@/src/hooks/useCycle';
import { getCyclePaticipants } from './hooks/useCycleParticipants';
import { getCycleWorks } from '../../../../src/hooks/useCycleWorks';

// import { findAll } from '@/src/facades/cycle';
// export async function generateStaticParams(){
//   const cycles = await findAll();
//   let paramsArray:{lang:Locale,id:string}[]=[];

//   return i18n.locales.reduce((p,lang)=>{
//     const res = cycles.map(({id})=>({lang,id:id.toString()}));
//     p = [...p,...res];
//     return p;
//   },paramsArray);
// }


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
    let metaTags = null;
    const cycle = await getCycle(+id);
    const works = await getCycleWorks(+id);

    if (cycle) {
        metaTags = {
        id: cycle?.id,
        title: cycle?.title,
        creator: cycle.creator.name,
        works: works?.map((x) => `${x.title} - ${x.author}`).join(),
        storedFile: cycle?.localImages[0].storedFile,
        };
    }

    const participants = await getCyclePaticipants(+id);
    const posts = await GetPosts(+id)

    const qc = new QueryClient();
    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString()],
      queryFn: ()=> cycle
    })
    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString(),'POSTS'],
      queryFn: ()=> posts
    })
      posts.forEach(p=>{
        qc.prefetchQuery({
          queryKey:['POST',id.toString()],
          queryFn: ()=> p
        })
      })
    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString(),'PARTICIPANTS'],
      queryFn: ()=> participants
    })
      participants.forEach(p=>{
        qc.prefetchQuery({
          queryKey:['USER',id.toString()],
          queryFn: ()=> p
        })
      })

    return   <Layout dict={dict} >
      <HydrationBoundary state={dehydrate(qc)}>
        <Cycle />
      </HydrationBoundary>
    </Layout>
      
};

export default CyclePage;