import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner,Row, Col} from 'react-bootstrap';

import MosaicItem from '@/components/cycle/MosaicItem'

import useCycles,{getCycles} from '@/src/useCycles'

import useFilterEngineCycles from './useFilterEngineCycles';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { CycleMosaicItem } from '../types/cycle';
interface Props {
  cyclesData:{total:number,fetched:number,cycles:CycleMosaicItem[]};
}
const take = 8;
const SearchTabCycles: FunctionComponent<Props> = ({cyclesData}) => {
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

  const [props,setProps]=useState<Prisma.CycleFindManyArgs>({take,where:{...baseProps(terms)}})
  const {data:{total,fetched,cycles:c}={total:0,fetched:0,cycles:[]}} = useCycles(props,{enabled:!!router.query?.q});
  const [cycles,setCycles] = useState<CycleMosaicItem[]>([])
  // const {total,fetched} = cyclesData;

  useEffect(()=>{
    if(c)setCycles(c)
  },[c])

  // useEffect(()=>{
  //   if(cyclesData.cycles)setCycles(cyclesData.cycles)
  // },[cyclesData.cycles])

  useEffect(()=>{
    if(router.query.q){
      const terms = router?.query.q?.toString()!.split(" ") || [];

      setProps(()=>({take,where:{...baseProps(terms)}}))
    }
  },[router.query.q])

  const [ref, inView] = useInView({
    triggerOnce: false,
  });
  useEffect(()=>{
    if(inView && cycles.length < total){
      const fi = async ()=>{
        const {id} = cycles.slice(-1)[0]
        const r = await getCycles({...props,skip:1,cursor:{id}});
        setCycles((c: any)=>[...c,...r.cycles])
      }
      fi()
    }
  },[inView])

  const {FilterEngineCycles,filtersType} = useFilterEngineCycles()
  console.log('filtersType',filtersType)

  useEffect(()=>{debugger;
    if(filtersType){
      const {OR} = baseProps(terms)
      const access = {
        access:{
          in:[1,2,3]
        }
      }
      
      setProps(()=>({take,where:{
        OR:[
          ...OR,
        ],
        AND:{
          ...access,
        }
      }}))
    }
  },[filtersType])



  const renderCycles=()=>{
    if(cycles)
      return <div>
        <FilterEngineCycles/>
        <Row>
            {cycles.map(p=><Col xs={12} sm={6} lg={3} className="mb-3 d-flex justify-content-center  align-items-center" key={p.id}><MosaicItem cycleId={p.id} cacheKey={['CYCLE',p.id.toString()]}  /></Col>)}
      </Row>
      {cycles?.length!=total && <Spinner ref={ref} animation="grow" />}
      </div>
      return ''
  }

  return <div>
  {renderCycles()}
  </div>
};
export default SearchTabCycles;
