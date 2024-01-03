import { NextPage } from 'next';
// import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from '@/i18n-config';
// import Layout from '@/src/components/layout/Layout';
import CycleAbout from '../component/CycleAbout';
import auth_config from '@/auth_config';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { find, cycleWorksDates } from '@/src/facades/cycle';

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
    const cwds = await cycleWorksDates(+id);
    const worksDates = cwds.map(cwd=>cwd.work);

    if (cycle) {
        metaTags = {
        id: cycle?.id,
        title: cycle?.title,
        creator: cycle.creator.name,
        works: worksDates?.map((x) => `${x?.title} - ${x?.author}`).join(),
        storedFile: cycle?.localImages[0].storedFile,
        };
    }

    const qc = new QueryClient();
    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString()],
      queryFn: ()=> cycle
    })
    
    worksDates.forEach(w=>{
        qc.prefetchQuery({
          queryKey:['WORK',w?.id.toString()],
          queryFn: ()=> w
        })
      })

    return  <HydrationBoundary state={dehydrate(qc)}>
        <CycleAbout />
        
    </HydrationBoundary>
      
};

export default CyclePage;