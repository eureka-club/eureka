
import { FunctionComponent, useEffect, useState, lazy } from 'react';
import useTranslation from 'next-translate/useTranslation';
import {Spinner} from 'react-bootstrap';
import TagsInput from '@/components/forms/controls/TagsInput';
import { GetAllByResonse } from '@/src/types';
import { useInView } from 'react-intersection-observer';
import { CycleMosaicItem } from '../../src/types/cycle';
import useCycles from '@/src/useCycles';
import CarouselStatic from '@/src/components/CarouselStatic';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import globalSearchEngineAtom from '../../src/atoms/searchEngine';

const Carousel = lazy(()=>import('@/components/Carousel'));

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

const cyclesCreatedOrJoinedWhere = (id:number) => ({
  where:{
    OR:[
      {
        participants:{some:{id}},
      },
      {
        creatorId:id
      }
    ]
  }
}) 
interface Props{
        groupedByTopics: Record<string,GetAllByResonse>;
      }
      
const HomeSingIn: FunctionComponent<Props> = ({ groupedByTopics}) => {
  const {data:session, status} = useSession();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [gbt, setGBT] = useState([...Object.entries(groupedByTopics||[])]);
  const [id, setId] = useState<string>('');
  const [topicIdx,setTopicIdx] = useState(gbt.length-1)
  const [ref, inView] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });
 const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);

  useEffect(()=>{
    const idx = topicIdx+1;
    if(inView && idx < topics.length){
      const exist = topics[idx] in gbt;
  
      const fi = async ()=>{
        const r = await fetchItems(0,topics[idx]);
        gbt.push([topics[idx],r])
        if(r){
          setGBT([...gbt]);
          setTopicIdx(idx);
        }
      }
      if(!exist)
        fi()

    }
  },[inView, gbt, topicIdx]); 

   useEffect(() => {
     if (session) setId(session.user.id.toString());
  }, [session, router]);


 const {data:dataCycles} = useCycles(cyclesCreatedOrJoinedWhere(+id),
    {enabled:!!id}
  )
  const [cycles,setCycles] = useState(dataCycles?.cycles)
  useEffect(()=>{
    if(dataCycles)setCycles(dataCycles.cycles)
  },[dataCycles])

const getTopicsBadgedLinks = () => {
        return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
      };

const renderSpinnerForLoadNextCarousel = ()=>{
if(topicIdx < topics.length-1) return <Spinner ref={ref} animation="grow" />
        return '';
}

  const seeAll = async (data: CycleMosaicItem[], q: string, showFilterEngine = true): Promise<void> => {
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      itemsFound: data,
      q,
      show: showFilterEngine,
    });
    router.push(`/search?q=${q}`);
  };

const cyclesJoined = () => {
    return (cycles && cycles.length) 
    ? <div>      
       <h1 className="text-secondary fw-bold">{t('Cycles I created or joined')}</h1>
       <CarouselStatic
        cacheKey={['CYCLES',JSON.stringify(cyclesCreatedOrJoinedWhere(+id))]}
         onSeeAll={async () => seeAll(cycles, t('Cycles I created or joined'))}
        data={cycles}
        iconBefore={<></>}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />
      </div>
    : <></>;
  };

const renderCarousels =  ()=>{
        return <>
                {gbt.map(([topic,apiResponse])=>{
                return <div className='mb-5' style={{minHeight:"448px"}} key={topic}>
                <Carousel topic={topic} apiResponse={apiResponse} />
                </div>
                })}
        </>
}    

  return <>  
  {cyclesJoined()}
  <h1 className="text-secondary fw-bold">{t('Trending topics')}</h1>
  <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
  <>
    <div>
      {renderCarousels()}
    </div>
    <div className="mb-5">
      {renderSpinnerForLoadNextCarousel()}
    </div>
  </>
</>


}


export default HomeSingIn;
