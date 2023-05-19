import { FC, lazy, memo } from 'react';
import { GetAllByResonse } from '@/src/types';
const Carousel = lazy(()=>import('@/components/Carousel'));

interface Props{
    groupedByTopics: [string, GetAllByResonse][];
  }  
  const CarouselsByTopics:FC<Props> =  ({groupedByTopics})=>{
    return <>
            {groupedByTopics.map(([topic,apiResponse])=>{
              if(apiResponse.data.length){
                return <div className='mb-4' data-cy={`carousel-${topic}`} style={{minHeight:"300px"}} key={topic}>
                <Carousel topic={topic} apiResponse={apiResponse} />
                </div>
              }
              return <></>;
            })}
    </>
  } 
  export default CarouselsByTopics 
  