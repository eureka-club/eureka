import { NextPage, GetServerSideProps } from 'next';
import Head from "next/head";
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useState,MouseEvent, Suspense, lazy } from 'react';
// import { RiArrowDownSLine } from 'react-icons/ri';
import { Spinner } from 'react-bootstrap';
import TagsInput from '../src/components/forms/controls/TagsInput';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import HomeNotSingIn from '../src/components/HomeNotSingIn';
const Carousel = lazy(()=>import('../src/components/Carousel')) ;

import { v4 } from 'uuid';
import { WEBAPP_URL } from '../src/constants';
// import {QueryClient, dehydrate} from 'react-query'
// import useWorks,{getWorks} from '@/src/useWorks'
// import { WorkMosaicItem } from '@/src/types/work';
// import { CycleMosaicItem } from '@/src/types/cycle';
import { GetAllByResonse } from '@/src/types';

const topics = ['gender-feminisms', 'technology', 'environment',
'racism-discrimination',
    'wellness-sports','social issues',
    'politics-economics','philosophy',
    'migrants-refugees','introspection',
    'sciences','arts-culture','history',
]


interface Props{
  groupedByTopics: Record<string,GetAllByResonse>;
}

const fetchItems = async (pageParam: number,topic:string):Promise<GetAllByResonse> => {
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/getAllBy?topic=${topic}&cursor=${pageParam}`;
  const q = await fetch(url);
  return q.json();
};

const IndexPage: NextPage<Props> = ({groupedByTopics}) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState<string[]>(['gender-feminisms', 'technology', 'environment']);
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  const [hide /* , setHide */] = useState<string[]>([
    'racism-discrimination',
    'wellness-sports',
    'social issues',
    'politics-economics',
    'philosophy',
    'migrants-refugees',
    'introspection',
    'sciences',
    'arts-culture',
    'history',
  ]);

  
  const getTopicsBadgedLinks = () => {
    return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...show, ...hide].join()} readOnly />;
  };
  const showTopic = (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (hide.length) {
      const topic = hide.splice(0, 3);
      setShow([...show, ...topic]);
    }
  };

  const renderCarousels = ()=>{
    let items = Object.entries(groupedByTopics).slice(0,3)
    return <main>        
      {
      items
        .map(([topic,apiResponse],idx)=>{
      return <section key={v4()}>
       {idx !== items.length-1
            ?
            <section   className="mb-5">  
             <Suspense fallback={<Spinner animation='grow'/>}>
              <Carousel topic={topic} apiResponse={apiResponse} />   
               </Suspense>             
            </section>
            :
            <section className="mb-5">    
            <Suspense  fallback={<Spinner animation='grow'/>}>
              <Carousel topic={topic} apiResponse={apiResponse} />   
              </Suspense>           
            </section>
}      </section>

        })
    }
    </main>
  }

  return (<>
    <Head>
        <meta property="og:title" content='Eureka'/>
        <meta property="og:description" content="Activa tu mente, transforma el mundo"/>
        <meta property="og:url" content={`${WEBAPP_URL}`} />
        <meta property="og:image" content={`${WEBAPP_URL}/logo.jpg`} />
        <meta property="og:type" content='website' />

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content="Eureka"></meta>
        <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
        <meta name="twitter:image" content={`${WEBAPP_URL}/logo.jpg`} ></meta>
        <meta name="twitter:url" content={`${WEBAPP_URL}`} ></meta>  
    </Head>
    {/* ESTO SERIA PAGINA USUARIO NO LOGUEADO  PAG ARQUIMEDES y EXPLORE */}
    {!session && !isLoadingSession && (<HomeNotSingIn/>)}
    {/* ESTO SERIA PAGINA USUARIO LOGUEADO */}
    {session && session.user && (
    <SimpleLayout showHeader title={t('browserTitleWelcome')}>
      <h1 className="text-secondary fw-bold">{t('Trending topics')}</h1>
      <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
      {/* <>{show && show.map((item, idx) => <Carousel className="mt-5" key={`carousel-${idx}`} topic={item} />)}</> */}
      {renderCarousels()}
      {/* <Button className="my-3 pe-3 rounded-pill text-white" onClick={e=>showTopic(e)} disabled={hide.length === 0}>
        <span>
          <RiArrowDownSLine /> {t('loadMoreTopics')}
        </span>
      </Button>  */}
    </SimpleLayout>)}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let groupedByTopics:Record<string,GetAllByResonse>={};

  
  
  let r = await Promise.all(
    topics.slice(0,3).map((topic, idx)=>{
      return fetchItems(0,topic)
    })
  );

  topics.slice(0,3).forEach((topic,idx)=>{
    groupedByTopics[topic] = r[idx];
  })
  


  return {
    props: {
      groupedByTopics,
      // dehydratedState: dehydrate(queryClient),      
    },
  };
  
};

export default IndexPage;
