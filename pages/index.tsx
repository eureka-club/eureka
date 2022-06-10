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
import Lazy from '@/components/Lazy'
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
  const [gbt, setGBT] = useState({...groupedByTopics});
  const [topicIdx, setTopicIdx] = useState(0)
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
    let items = Object.entries(groupedByTopics)
    return <main>        
      {
      items
        .map(([topic,apiResponse],idx)=>{
      return <section key={v4()}>
       {idx !== items.length-1
            ?
            <section   className="mb-5">  
          {/* <CycleMosaic/> */}
             {/* <Suspense fallback={<Spinner animation='grow'/>}> */}
              <Carousel topic={topic} apiResponse={apiResponse} />   
               {/* </Suspense>              */}
            </section>
            :
            <section className="mb-5">    
            {/* <WorkMosaic/> */}
            {/* <Suspense  fallback={<Spinner animation='grow'/>}> */}
              <Carousel topic={topic} apiResponse={apiResponse} />   
              {/* </Suspense>            */}
            </section>
}      </section>

        })
    }
    </main>
  }

  const [ref1, inView1 ] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

  const [ref2, inView2 ] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

  const [ref3, inView3 ] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

  useEffect(()=>{
    const fi1 = async ()=>{
      const r = await fetchItems(0,topics[1]);
      gbt[topics[1]] = r;
      setGBT({...gbt});
    }
    if(inView1){
      if(!(topics[1] in gbt))
        fi1()
    }
  },[inView1, gbt]); 

  useEffect(()=>{
    const fi2 = async ()=>{
      const r = await fetchItems(0,topics[2]);
      gbt[topics[2]] = r;
      setGBT({...gbt});
    }
    if(inView2){
      if(!(topics[2] in gbt))
        fi2()
    }
  },[inView2, gbt]);

  useEffect(()=>{
    const fi3 = async ()=>{
      const r = await fetchItems(0,topics[3]);
      gbt[topics[3]] = r;
      setGBT({...gbt});
    }
    if(inView3){
      if(!(topics[3] in gbt))
        fi3()
    }
  },[inView3, gbt]);
console.log(topicIdx,gbt)
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
      {/* {renderCarousels()} */}
    {/* <div className='mb-5' style={{minHeight:"448px"}}><Carousel topic={topics[topicIdx]} apiResponse={gbt[topics[0]]} /></div> */}
    
    {/* <div className='mb-5' style={{minHeight:"448px"}}>
      <Lazy child={<Carousel topic={topics[0]} apiResponse={gbt[topics[0]]} />} onLoaded={
        async()=>{
          const r = await fetchItems(0,topics[1]);
          gbt[topics[1]] = r;
          setGBT({...gbt});
          console.log(gbt)
        }
      } />
    </div>
     */}
    
    <div className='mb-5' style={{minHeight:"448px"}} >{<Carousel topic={topics[0]} apiResponse={gbt[topics[0]]} />}</div>

      <div className='mb-5' style={{minHeight:"448px"}} ref={ref1}>{inView1 && <Carousel topic={topics[1]} apiResponse={gbt[topics[1]]} />}</div>
      <div className='mb-5' style={{minHeight:"448px"}} ref={ref2}>{inView2 && <Carousel topic={topics[2]} apiResponse={gbt[topics[2]]} />}</div>
    <div className='mb-5' style={{minHeight:"448px"}} ref={ref3}>{inView3 && <Carousel topic={topics[3]} apiResponse={gbt[topics[3]]} />}</div> 


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

  /*let r = await Promise.all(
    topics.map((topic, idx)=>{
      return fetchItems(0,topic)
    })
  );

  topics.forEach((topic,idx)=>{
    groupedByTopics[topic] = r[idx];
  })*/
  
  let r = await fetchItems(0,topics[0])
  groupedByTopics[topics[0]] = r;

  // let r1 = await fetchItems(0,topics[1])
  // groupedByTopics[topics[1]] = r1;

  //  let r2 = await fetchItems(0,topics[2])
  // groupedByTopics[topics[2]] = r2;

  // let r3 = await fetchItems(0,topics[3])
  // groupedByTopics[topics[3]] = r3;


  return {
    props: {
      groupedByTopics,
      // dehydratedState: dehydrate(queryClient),      
    },
  };
  
};

export default IndexPage;
