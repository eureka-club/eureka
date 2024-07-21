import { NextPage } from 'next';
import {GetServerSideProps} from 'next';
import Head from "next/head";
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { Session } from '@/src/types';
import { dehydrate,QueryClient } from 'react-query';
import {getbackOfficeData} from '@/src/useBackOffice'
import { getFeaturedEurekas } from '@/src/useFeaturedEurekas';
import {getInterestedCycles} from '@/src/useInterestedCycles';
import { featuredWorksWhere, getFeaturedWorks } from '@/src/useFeaturedWorks';
import { getHyvorComments } from '@/src/useHyvorComments';
import { getFeaturedUsers } from '@/src/useFeaturedUsers';
import HomeNotSession from '@/src/components/HomeNotSession';
import { UserSumary } from '@/src/types/UserSumary';
import { getUserSumary } from '@/src/useUserSumary';
import React from 'react';
import { getNotifications } from '@/src/useNotifications';
interface Props{
  session: Session;
  language:string;
}

const IndexPage: NextPage<Props> = ({session}) => {
  const { t } = useTranslation('common');

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
         <HomeNotSession/>
      </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // if(!session)
  // return {props:{groupedByTopics:null}};
  // const id = session.user.id;  
  // let groupedByTopics:Record<string,GetAllByResonse>={};
  // const user = await  getUserSumary(session?.user.id!);
  const bo =  await getbackOfficeData(ctx.locale!)
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
  bo.PostExplorePage.split(',').forEach((x:string)=> postsId.push(parseInt(x)));
  
  let cyclesIds:number[] = [];
  if(bo && bo.CyclesExplorePage)
  bo.CyclesExplorePage.split(',').forEach((x:string)=> cyclesIds.push(parseInt(x)));
  
  let worksIds:number[] = [];
  let usersIds:number[] = [];
  if(bo){
    if(bo.FeaturedWorks)
      bo.FeaturedWorks.split(',').forEach((x:any) => worksIds.push(+x));
    if(bo.FeaturedUsers)
      bo.FeaturedUsers.split(',').forEach((x:any) => usersIds.push(+x));
  }
  let promises:Promise<any>[] = [
    getUserSumary(session?.user.id!),
    getFeaturedEurekas(session?.user.id!,ctx.locale!,postsId,undefined),
    getInterestedCycles(ctx.locale!,cyclesIds,undefined),
    getFeaturedWorks(ctx.locale!,worksIds,8),
    getFeaturedUsers(usersIds,8),
    ...session?.user.id ?[getNotifications(session?.user.id!)]:[],
    ...worksIds.map(id=>getHyvorComments(`work-${id}`)),
  ];
  
  let resolved = await Promise.all(promises);

  const userOnSession = resolved[0];
  const featuredEurekas = resolved[1];
  const interestedCycles = resolved[2];
  const featuredWorks = resolved[3];
  const featuredUsers:UserSumary[] = resolved[4];
  const notifications = resolved[5];
  const hyvorComments = resolved.slice(6);
  const qc = new QueryClient();
  
  if(userOnSession)
    await qc.prefetchQuery({
      queryKey:["USER",`${userOnSession.id}`,"SUMARY"],
      queryFn:()=>userOnSession
    })
  await qc.prefetchQuery({
    queryKey:['BACKOFFICE', `1`],
    queryFn:()=>bo,
  })
  await qc.prefetchQuery({
    queryKey:[`eurekas-of-interest-${ctx.locale}`],
    queryFn:()=>featuredEurekas
  })
  await qc.prefetchQuery({
    queryKey:[`cycles-of-interest-${ctx.locale}`],
    queryFn:()=>interestedCycles
  })
    const promisesUser:Promise<void>[]=[]
    interestedCycles.cycles.forEach((c:{creator:UserSumary}) => {
      promisesUser.push(qc.prefetchQuery({
        queryKey:['USER',c.creator.id.toString(),'SUMARY'],
        queryFn:()=>c.creator
      }))
    });
    await Promise.all(promisesUser);

  await qc.prefetchQuery({
    queryKey:['featured-users'],
    queryFn:()=>featuredUsers
  });
  featuredUsers.forEach(u=> {
    qc.prefetchQuery({
      queryKey:['USER',u.id.toString(),'SUMARY'],
      queryFn:()=>u
    })
  });
  qc.prefetchQuery({
    queryKey:['WORKS',`${JSON.stringify(featuredWorksWhere(worksIds))}`],
    queryFn:()=>featuredWorks
  })
  worksIds.forEach((id,idx)=>{
    qc.prefetchQuery({
      queryKey:['HYVOR-COMMENTS', `work-${id}`],
      queryFn:()=>hyvorComments[idx]
    })
  });

  if(session?.user.id){
    qc.prefetchQuery({
      queryKey:['USER', `${session?.user.id}`, 'NOTIFICATIONS'],
      queryFn:()=>notifications
    })
  }
  
  return {
    props: {
      session,
      language:ctx.locale,
      dehydratedState: dehydrate(qc),      
    },
  };
  
};


export default IndexPage;
