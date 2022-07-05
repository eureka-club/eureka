import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row,Tab, Col} from 'react-bootstrap';

import MosaicItem from '@/components/work/MosaicItem'

import {getWorks} from '@/src/useWorks'

// import useFilterEnginePosts from './useFilterEnginePosts';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { WorkMosaicItem } from '../types/work';
interface Props {
  worksData:{total:number,fetched:number,works:WorkMosaicItem[]};
}
const take = 8;
const SearchTabWorks: FunctionComponent<Props> = ({worksData}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const terms = router?.query.q?.toString()!.split(" ") || [];
  
  const baseProps = (terms:string[])=>{
    return {
      OR:[
        {
          AND:terms.map(t=>(
            { 
              title: { contains: t } 
            }
          ))
  
        },
        {
          AND:terms.map(t=>(
            { 
              contentText: { contains: t } 
            }
          ))
  
        },
        {
          AND:terms.map(t=>(
            { 
               tags: { contains: t } 
            }
          ))
        },
        {
          AND:terms.map(t=>(
            { 
               topics: { contains: t } 
            }
          ))
        }
      ],
    }
  };

  const [props,setProps]=useState<Prisma.WorkFindManyArgs>({take,where:{...baseProps(terms)}})
  // const {data:{total,fetched,works:c}={total:0,fetched:0,works:[]}} = useWorks(props,{enabled:!!router.query?.q});
  const [works,setWorks] = useState<WorkMosaicItem[]>([])
  const {total,fetched} = worksData;
  useEffect(()=>{
    if(worksData.works)setWorks(worksData.works)
  },[worksData.works])

  useEffect(()=>{
    if(router.query.q){
      const terms = router?.query.q?.toString()!.split(" ") || [];

      setProps(()=>({take,where:{...baseProps(terms)}}))
    }
  },[router.query.q])

  const [ref, inView] = useInView({
    triggerOnce: false,
  });
  console.log(works.length,total)
  useEffect(()=>{
    if(inView && works.length < total){
      const fi = async ()=>{
        const {id} = works.slice(-1)[0]
        const r = await getWorks({...props,skip:1,cursor:{id}});
        setWorks((c: any)=>[...c,...r.works])
      }
      fi()
    }
  },[inView])

  const renderWorks=()=>{
    if(works)
      return <div>
        {/* <FilterEngineCycles/> */}
        <Row>
            {works.map(p=><Col xs={12} sm={6} lg={3} className="mb-3" key={p.id}><MosaicItem workId={p.id} cacheKey={['WORK',p.id.toString()]}  /></Col>)}
      </Row>
      {works?.length!=total && <Spinner ref={ref} animation="grow" />}
      </div>
      return ''
  }

  return <div>
  {renderWorks()}
  </div>
};
export default SearchTabWorks;
