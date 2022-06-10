import { NextPage, GetServerSideProps } from 'next';
import Head from "next/head";
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useState,MouseEvent, Suspense, lazy, useEffect } from 'react';
// import { RiArrowDownSLine } from 'react-icons/ri';
import { Spinner } from 'react-bootstrap';
import TagsInput from '@/components/forms/controls/TagsInput';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import HomeNotSingIn from '@/components/HomeNotSingIn';
// const Carousel = lazy(()=>import('@/components/Carousel')) ;
import Carousel from '@/components/Carousel';
import { v4 } from 'uuid';
import { WEBAPP_URL } from '../src/constants';
// import {QueryClient, dehydrate} from 'react-query'
// import useWorks,{getWorks} from '@/src/useWorks'
// import { WorkMosaicItem } from '@/src/types/work';
// import { CycleMosaicItem } from '@/src/types/cycle';
import { GetAllByResonse } from '@/src/types';
import WorkMosaic from '@/components/work/MosaicItem'
import CycleMosaic from '@/src/components/work/MosaicItem';
import { useInView } from 'react-intersection-observer';
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
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  
  const [gbt, setGBT] = useState({...groupedByTopics});
  const getTopicsBadgedLinks = () => {
    return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
  };

  const [topicIdx,setTopicIdx] = useState(Object.keys(gbt).length-1)
  const [ref, inView] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

  useEffect(()=>{
    const idx = topicIdx+1;
    if(idx < topics.length){
      const exist = topics[idx] in gbt;
  
      const fi = async ()=>{
        const r = await fetchItems(0,topics[idx]);
        gbt[topics[idx]] = r;
        if(r){
          setGBT({...gbt});
          setTopicIdx(idx);
        }
      }
      if(inView){ 
        if(!exist)
          fi()
      }

    }
  },[inView, gbt, topicIdx]); 

  const renderSpinnerForLoadNextCarousel = ()=>{
    if(topicIdx < topics.length-1) return <Spinner ref={ref} animation="grow" />
    return '';
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
      <>
        <div>
          {Object.entries(gbt).map(([topic,apiResponse])=>{
              return <div className='mb-5' style={{minHeight:"448px"}} key={v4()}>
                <Carousel topic={topic} apiResponse={apiResponse} />
              </div>
          })}
        </div>
        <div className="mb-5">
          {renderSpinnerForLoadNextCarousel()}
        </div>
      </>

    </SimpleLayout>)}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let groupedByTopics:Record<string,GetAllByResonse>={};
  
  let r = await fetchItems(0,topics[0])
  groupedByTopics[topics[0]] = r;

  let r1 = await fetchItems(0,topics[1])
  groupedByTopics[topics[1]] = r1;

  return {
    props: {
      groupedByTopics,
      // dehydratedState: dehydrate(queryClient),      
    },
  };
  
};

export default IndexPage;
