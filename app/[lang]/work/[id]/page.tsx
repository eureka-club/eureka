import { NextPage } from 'next';
import Head from "next/head";
import {getCycles} from '@/src/hooks/useCycles'
import {getPosts} from '@/src/hooks/usePosts'
import Work from './component/Work';
import { getServerSession } from 'next-auth';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import auth_config from '@/auth_config';
import { getWork } from '@/src/hooks/useWork';
import Layout from '@/src/components/layout/Layout';
import { LANGUAGES } from '@/src/constants';

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

    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    const workCyclesWhere = {
        where:{
          works:{
            some:{
              id:+id
            }
          }
        }
      }
      const workPostsWhere = {take:8,where:{works:{some:{id:+id}}}}
      let work = await getWork(+id,langs,origin);
      let {cycles} = await getCycles(langs,workCyclesWhere,origin);
      let {posts} = await getPosts(workPostsWhere,origin);
  
    return (<>
      <Head>
        <meta name="title" content={dict['aboutUsTitle']}></meta>
        <meta name="description" content={dict['aboutUsDescription']}></meta>
      </Head>
  
      <Layout dict={dict}>
        <Work session={session!} work={work} workCycles={cycles} workPosts={posts}/>
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
