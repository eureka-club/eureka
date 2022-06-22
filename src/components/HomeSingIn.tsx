
import { FunctionComponent, useEffect, useState, lazy } from 'react';
import useTranslation from 'next-translate/useTranslation';
import {Spinner} from 'react-bootstrap';
import TagsInput from '@/components/forms/controls/TagsInput';
import { GetAllByResonse } from '@/src/types';
import { useInView } from 'react-intersection-observer';

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
      }
      
const HomeSingIn: FunctionComponent<Props> = ({ groupedByTopics}) => {
  const { t } = useTranslation('common');
  const [gbt, setGBT] = useState([...Object.entries(groupedByTopics||[])]);
  

  const [topicIdx,setTopicIdx] = useState(gbt.length-1)
  const [ref, inView] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });

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
