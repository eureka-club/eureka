
import { FunctionComponent, useEffect, useState, lazy } from 'react';
import useTranslation from 'next-translate/useTranslation';
import {Spinner} from 'react-bootstrap';
import TagsInput from '@/components/forms/controls/TagsInput';
import { GetAllByResonse } from '@/src/types';
import { useInView } from 'react-intersection-observer';
import { CycleMosaicItem } from '../../src/types/cycle';
import CarouselStatic from '@/src/components/CarouselStatic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import slugify from 'slugify'
import useMyCycles,{myCyclesWhere} from '@/src/useMyCycles';
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

interface Props{
        groupedByTopics: Record<string,GetAllByResonse>;
        // myCycles?:CycleMosaicItem[]
      }
      
const HomeSingIn: FunctionComponent<Props> = ({ groupedByTopics}) => {
  const {data:session, status} = useSession();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [ref, inView] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });
  const [cycles,setCycles] = useState<CycleMosaicItem[]>()
 const {data:dataCycles} = useMyCycles(session?.user.id!)
  useEffect(()=>{
    if(dataCycles)setCycles(dataCycles.cycles)
  },[dataCycles])

  const [gbt, setGBT] = useState([...Object.entries(groupedByTopics||[])]);
  const [topicIdx,setTopicIdx] = useState(gbt.length-1)

  
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
   
const getTopicsBadgedLinks = () => {
        return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
      };

const renderSpinnerForLoadNextCarousel = ()=>{
if(topicIdx < topics.length-1) return <Spinner ref={ref} animation="grow" />
        return '';
}

const getMediathequeSlug = (id:number,name:string)=>{
    const s =`${name}`
    const slug = `${slugify(s,{lower:true})}-${id}` 
    return slug
}

  const seeAll = async (data: CycleMosaicItem[], q: string, showFilterEngine = true): Promise<void> => {
    if(session){
      const u = session.user
      router.push(`/user/${getMediathequeSlug(u.id,u.name||u.id.toString())}/my-cycles`);
    }
  };
//       <h1 className="text-secondary fw-bold">{t('myCycles')}</h1>

const cyclesJoined = () => {
  if(!session)return <></>
  const k = JSON.stringify(myCyclesWhere(session?.user.id))

    return (cycles && cycles.length) 
    ? <div data-cy="myCycles">
       <CarouselStatic
        cacheKey={['CYCLES',k]}
        onSeeAll={async () => seeAll(cycles, t('myCycles'))}
        title={t('myCycles')}
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
                return <div className='mb-5' data-cy-={`carousel-${topic}`} style={{minHeight:"448px"}} key={topic}>
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
