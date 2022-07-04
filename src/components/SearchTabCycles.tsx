import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row,Tab, Col} from 'react-bootstrap';

import MosaicItem from '@/components/cycle/MosaicItem'

import useCycles,{getCycles} from '@/src/useCycles'

import useFilterEngineCycles from './useFilterEngineCycles';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
interface Props{
    
}
const take = 2;
const SearchTabCycles: FunctionComponent<Props> = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const {FilterEngineCycles} = useFilterEngineCycles({
    filtersTypeChanged:async (filtersType)=>{
      const {public:pb,private:pv} = filtersType;
      console.log("running filtersType changes",filtersType);
      setProps({
        take,
        where:{
          AND:{
            OR:[
              {
                ... pb && {access:1}
              },
              {
                ... pv && {access:2}
              }
            ]
          }
        }
      })
  
    }
  })

  const terms = router?.query.q?.toString()!.split(" ") || [];
  const [props,setProps]=useState<Prisma.CycleFindManyArgs>({
    where:{
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
      ]
    },
    take,
  })
  const {data:{total,fetched,cycles:c}={total:0,fetched:0,cycles:[]}} = useCycles(props,{enabled:!!router.query?.q});
  const [cycles,setCycles] = useState(c)

  useEffect(()=>{
    if(c)setCycles(c)
  },[c])

  const [refCycles, inViewCycles] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{debugger;
    if(inViewCycles && router && cycles.length && fetched){
      const fi = async ()=>{
        const {id} = cycles.slice(-1)[0]
        const r = await getCycles({...props,skip:1,cursor:{id}});
        setCycles(c=>[...c,...r.cycles])
      }
      if(fetched)
        fi()
    }
  },[inViewCycles])

  const renderCycles=()=>{
    if(c)
      return <div>
        <FilterEngineCycles/>
        <Row>
            {c.map(p=><Col xs={12} className="mb-3" key={p.id}><MosaicItem cycleId={p.id} cacheKey={['CYCLE',p.id.toString()]}  /></Col>)}
      </Row>
      {c?.length<total && <Spinner ref={refCycles} animation="grow" />}
      </div>
      return ''
  }

  return <div>
  {renderCycles()}
  </div>
};
export default SearchTabCycles;
