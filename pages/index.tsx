import { lazy,Suspense } from 'react';
import { NextPage } from 'next';
import {GetServerSideProps} from 'next';
import Head from "next/head";
import { Spinner } from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { GetAllByResonse, Session } from '@/src/types';
// import {getMyCycles,myCyclesWhere} from '@/src/useMyCycles';
import { dehydrate,QueryClient } from 'react-query';
import {getbackOfficeData} from '@/src/useBackOffice'
import { getFeaturedEurekas } from '@/src/useFeaturedEurekas';
import {getInterestedCycles} from '@/src/useInterestedCycles';
import { featuredWorksWhere, getFeaturedWorks } from '@/src/useFeaturedWorks';
import { getHyvorComments } from '@/src/useHyvorComments';
// import { backOfficeData } from '@/src/types/backoffice';
import {getItemsByTopic} from '@/src/useItemsByTopic';
import { getUser } from '@/src/useUser';

//const HomeNotSingIn = lazy(()=>import('@/components/HomeNotSingIn')); ARQUIMEDES
const HomeSingIn = lazy(()=>import('@/src/components/HomeSingIn'));

const topics = ['gender-feminisms', 'technology', 'environment',
 'racism-discrimination',
    'wellness-sports','social issues',
    'politics-economics','philosophy',
    'migrants-refugees','introspection',
    'sciences','arts-culture','history',
];
// const fetchItems = async (pageParam: number,topic:string):Promise<GetAllByResonse> => {
//   const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/getAllBy?topic=${topic}&cursor=${pageParam}`;
//   const q = await fetch(url);
//   return q.json();
// };

interface Props{
  // groupedByTopics: Record<string,GetAllByResonse>;
  session: Session;
  language:string;
}

const IndexPage: NextPage<Props> = ({language,session}) => {
  const { t } = useTranslation('common');
  // const {data:session,status} = useSession();
  // const isLoadingSession = status === "loading"
  return (
    <>
      <Head>
        <meta name="title" content={t('meta:indexTitle')}></meta>
        <meta name="description" content={t('meta:indexDescription')}></meta>
        <meta property="og:title" content="Eureka" />
        <meta property="og:description" content="Activa tu mente, transforma el mundo" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content="Eureka"></meta>
        <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`}></meta>
        <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`}></meta>
      </Head>

      {/* ESTO SERIA PAGINA USUARIO NO LOGUEADO  PAG ARQUIMEDES y EXPLORE */}
      {/*!session && <SimpleLayout allPageSize={true} title={t('browserTitleWelcome')}> 
       <Suspense fallback={<Spinner animation="grow" />}>
            <HomeNotSingIn/>
        </Suspense>

      </SimpleLayout>
         */}
      {/*{session && session.user &&  */}

      <SimpleLayout showCustomBaner={(!session) ? true : false} title={t('browserTitleWelcome')}>
        <Suspense fallback={<Spinner animation="grow" />}>
          <HomeSingIn language={language}/>
        </Suspense>
      </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  // if(!session)
  // return {props:{groupedByTopics:null}};
  // const id = session.user.id;  
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL
  let groupedByTopics:Record<string,GetAllByResonse>={};
  const user = await  getUser(session?.user.id!,origin);
  const bo =  await getbackOfficeData(origin)
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
  bo.PostExplorePage.split(',').forEach((x:string)=> postsId.push(parseInt(x)));
  
  let cyclesIds:number[] = [];
  if(bo && bo.CyclesExplorePage)
  bo.CyclesExplorePage.split(',').forEach((x:string)=> cyclesIds.push(parseInt(x)));
  
  let worksIds:number[] = [];
  if(bo && bo.FeaturedWorks)
  bo.FeaturedWorks.split(',').forEach((x) => worksIds.push(parseInt(x)));
  
  let promises:Promise<any>[] = [
    getFeaturedEurekas(postsId,undefined,origin),
    getInterestedCycles(cyclesIds,undefined,origin),
    getFeaturedWorks(worksIds,8,origin),
    ...worksIds.map(id=>getHyvorComments(`work-${id}`,origin)),
  ]
  let resolved = await Promise.all(promises);
  const featuredEurekas = resolved[0];
  const interestedCycles = resolved[1];
  const featuredWorks = resolved[2];
  const hyvorComments = promises.slice(3);

  
  promises = [
    getItemsByTopic(0,topics[0],user?.language!),
    getItemsByTopic(0,topics[1],user?.language!)
  ]
  resolved = await Promise.all(promises);
  // groupedByTopics[topics[0]] = resolved[0];
  // groupedByTopics[topics[1]] = resolved[1];
  const qc = new QueryClient();

  await qc.fetchQuery(['ITEMS-BY-TOPIC',`${topics[0]}-${0}`],()=>resolved[0])
  await qc.fetchQuery(['ITEMS-BY-TOPIC',`${topics[1]}-${0}`],()=>resolved[1])

  await qc.fetchQuery(['BACKOFFICE', `1`], () => bo)
  await qc.fetchQuery(['POSTS','eurekas-of-interest'],()=>featuredEurekas)
  await qc.fetchQuery(['CYCLES','cycles-of-interest'],()=>interestedCycles)
  await qc.fetchQuery(['WORKS',`${JSON.stringify(featuredWorksWhere(worksIds))}`],()=>featuredWorks)
  await worksIds.forEach(async (id,idx)=>{
    await qc.fetchQuery(['HYVOR-COMMENTS', `work-${id}`],()=>hyvorComments[idx])
  });
  
  // const k = myCyclesWhere(session.user.id)
  // await qc.fetchQuery(['CYCLES',JSON.stringify(k)],()=>getMyCycles(id,8,origin))

  return {
    props: {
      session,
      language:user?.language,
      dehydratedState: dehydrate(qc),      
    },
  };
  
};


export default IndexPage;
