import { NextPage } from 'next';
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from '@/i18n-config';
import Layout from '@/src/components/layout/Layout';
import Cycle from './component/Cycle';
import auth_config from '@/auth_config';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import {getCyclePosts} from '@/src/hooks/useCyclePosts';
import { getCycle } from '@/src/hooks/useCycle';
import { getCyclePaticipants } from '@/src/hooks/useCycleParticipants';
import { getCycleWorks } from '@/src/hooks/useCycleWorks';
import { find, participants as cycleParticipants, posts as cyclePosts, works as cycleWorks } from '@/src/facades/cycle';

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
    

  const session = await getServerSession(auth_config(lang));
    let metaTags = null;debugger;
    const cycle = await find(+id);
    const works = await cycleWorks(+id);

    if (cycle) {
        metaTags = {
        id: cycle?.id,
        title: cycle?.title,
        creator: cycle.creator.name,
        works: works?.map((x) => `${x.title} - ${x.author}`).join(),
        storedFile: cycle?.localImages[0].storedFile,
        };
    }

    const participants = await cycleParticipants(+id);
    const posts = await cyclePosts(+id)

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

    return  <HydrationBoundary state={dehydrate(qc)}>
        <Cycle />
    </HydrationBoundary>
      
};

export default CyclePage;