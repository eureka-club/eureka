import { NextPage } from 'next';
import Head from "next/head";
import Work from './component/Work';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import auth_config from '@/auth_config';
import { getWork } from '@/src/hooks/useWork';
import Layout from '@/src/components/layout/Layout';
import { LANGUAGES } from '@/src/constants';
import { getWorkCycles } from './hooks/useWorkCycles';
import { HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getWorkPosts } from './hooks/useWorkPosts';

interface Props{
    params:{lang:Locale,id:string}
}
  const WorkPage: NextPage<Props> =async ({params:{lang,id}}) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
      ...dictionary['topics'], ...dictionary['countries'],...dictionary['navbar'],
     ...dictionary['signInForm'],...dictionary['workDetail'], 
     ...dictionary['cycleDetail'],
      ...dictionary['createPostForm'] 
    }
  
    const session = await getServerSession(auth_config(lang));
    const langs = session?.user.language??LANGUAGES[lang];

    const workPostsWhere = {take:8,where:{works:{some:{id:+id}}}}
      
    let work = await getWork(+id,langs);
    let cycles = await getWorkCycles(+id);
    let posts = await getWorkPosts(+id);
    
    const qc = new QueryClient();

    qc.prefetchQuery({
      queryKey:['WORK',id.toString()],
      queryFn:()=>work
    });
    qc.prefetchQuery({
      queryKey:['WORK',id.toString(),'CYCLES'],
      queryFn:()=>cycles
    });
      cycles.forEach(c=>{
        qc.prefetchQuery({
          queryKey:['CYCLE',id.toString()],
          queryFn:()=>c
        });
      });
    qc.prefetchQuery({
      queryKey:['WORK',id.toString(),'POSTS'],
      queryFn:()=>posts
    });
      posts.forEach(p=>{
        qc.prefetchQuery({
          queryKey:['POST',id.toString()],
          queryFn:()=>p
        });
      });
  
    return (<>
      <Head>
        <meta name="title" content={dict['aboutUsTitle']}></meta>
        <meta name="description" content={dict['aboutUsDescription']}></meta>
      </Head>
  
      <Layout dict={dict}>
        <HydrationBoundary state={qc}>
          <Work session={session!}/>
        </HydrationBoundary>
      </Layout>
    </>
    );
  };

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getSession(ctx)
//   const { params } = ctx
//   const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

//   const qc = new QueryClient()
//   if (params?.id == null || typeof params.id !== 'string') {
//     return { notFound: true };
//   }

//   const id = parseInt(params.id, 10);
//   if (!Number.isInteger(id)) {
//     return { notFound: true };
//   }
  
//   const workCyclesWhere = {
//     where:{
//       works:{
//         some:{
//           id
//         }
//       }
//     }
//   }
//   let lang = ctx.locale ?? "es";
//   let work = await getWork(id,lang,origin);
//   let metaTags:Record<string,any>={};
//   if(work){
//     metaTags = { id: work.id, title: work.title, author: work.author, storedFile: work.localImages[0].storedFile };
//     const workPostsWhere = {take:8,where:{works:{some:{id}}}}
//     await qc.prefetchQuery(['WORK', `${id}-${lang}`],()=>work)
//     await qc.prefetchQuery(['CYCLES',JSON.stringify(workCyclesWhere)],()=>getCycles(ctx.locale!,workCyclesWhere,origin))
//     await qc.prefetchQuery(['POSTS',JSON.stringify(workPostsWhere)],()=>getPosts(ctx.locale!,workPostsWhere,origin))
//   }
  
//   return {
//     props: {
//       workId: work?.id || null,
//       work,
//       session,
//       dehydratedState: dehydrate(qc),
//       metas:metaTags
//     },
//   }
// }

export default WorkPage;
