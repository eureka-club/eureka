import { lazy,Suspense } from 'react';
import { NextPage } from 'next';
import {GetServerSideProps} from 'next';
import Head from "next/head";
import { Spinner } from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession, getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { GetAllByResonse } from '@/src/types';
import {getMyCycles,myCyclesWhere} from '@/src/useMyCycles';
import { dehydrate,QueryClient } from 'react-query';
const HomeNotSingIn = lazy(()=>import('@/components/HomeNotSingIn'));
const HomeSingIn = lazy(()=>import('@/src/components/HomeSingIn'));

const topics = ['gender-feminisms', 'technology', 'environment',
 'racism-discrimination',
    'wellness-sports','social issues',
    'politics-economics','philosophy',
    'migrants-refugees','introspection',
    'sciences','arts-culture','history',
];
const fetchItems = async (pageParam: number,topic:string):Promise<GetAllByResonse> => {
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/getAllBy?topic=${topic}&cursor=${pageParam}`;
  const q = await fetch(url);
  return q.json();
};

interface Props{
  groupedByTopics: Record<string,GetAllByResonse>;
}

const IndexPage: NextPage<Props> = ({groupedByTopics}) => {
  const { t } = useTranslation('common');
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  
  return <>
    <Head>
        <meta property="og:title" content='Eureka'/>
        <meta property="og:description" content="Activa tu mente, transforma el mundo"/>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} />
        <meta property="og:type" content='website' />

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content="Eureka"></meta>
        <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} ></meta>
        <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} ></meta>  
    </Head>
     {/* ESTO SERIA PAGINA USUARIO NO LOGUEADO  PAG ARQUIMEDES y EXPLORE */}
     {!session && !isLoadingSession && <SimpleLayout allPageSize={true} title={t('browserTitleWelcome')}> 
       <Suspense fallback={<Spinner animation="grow" />}>
            <HomeNotSingIn/>
        </Suspense>

      </SimpleLayout>
     }
    {session && session.user && <SimpleLayout showHeader title={t('browserTitleWelcome')}>
      <Suspense fallback={<Spinner animation="grow" />}>
        {/* ESTO SERIA PAGINA USUARIO LOGUEADO */}
        <HomeSingIn groupedByTopics={groupedByTopics} />
      </Suspense>
    </SimpleLayout>
    }
  </>
};

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const session = await getSession({req});
  if(!session)
    return {props:{groupedByTopics:null}};
    
  const id = session.user.id;  
  let groupedByTopics:Record<string,GetAllByResonse>={};
  
  let r = await fetchItems(0,topics[0])
  groupedByTopics[topics[0]] = r;

  let r1 = await fetchItems(0,topics[1])
  groupedByTopics[topics[1]] = r1;

  const qc = new QueryClient()
  const k = myCyclesWhere(session.user.id)
  await qc.fetchQuery(['CYCLES',JSON.stringify(k)],()=>getMyCycles(id,8))

  return {
    props: {
      groupedByTopics,
      dehydratedState: dehydrate(qc),      
    },
  };
  
};


export default IndexPage;
