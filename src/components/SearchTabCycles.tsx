import { useState, FunctionComponent, useEffect } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Spinner,Row, Col, Tab} from 'react-bootstrap';

import MosaicItem from '@/src/components/cycle/MosaicItem'

import useCycles,{getCycles} from '@/src/useCycles'

import useFilterEngineCycles from './useFilterEngineCycles';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { CycleSumary } from '../types/cycle';
import cycle from 'pages/api/cycle';
import { useDictContext } from '../hooks/useDictContext';

const take = 8;
interface Props{
}
const SearchTabCycles:FunctionComponent<Props> = () => {
  const { t, dict } = useDictContext();
  const router = useRouter();
  const{lang}=useParams<{lang:string}>()!;

  const searchParams=useSearchParams();
  const q=searchParams?.get('q');
  const terms = q?.toString()!.split(" ") || [];
  const cacheKey = `cycles-search-${q?.toString()}`;
  const {FilterEngineCycles,filtersType,filtersCountries} = useFilterEngineCycles()

  const getProps = ()=>{
    const res:Prisma.CycleWhereInput = {
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
    if(filtersType){
      const access = {
        access:{
          in:[
            ...filtersType.public ? [1,4] : [],
            ...filtersType.private ? [2] : [],
          ]
        }
      }
      res.AND = {
        ...res.AND ? res.AND : {},
        ...access
      };
    }
    if(filtersCountries && filtersCountries.length){
      res.AND = {
        ...res.AND ? res.AND : {},
        creator:{
          countryOfOrigin:{
            in:filtersCountries
          }
        }
      }
    }
    return res;
  };

  const [props,setProps]=useState<Prisma.CycleFindManyArgs>({take,where:{...getProps()}})

  const {data:{total,fetched,cycles:c}={total:0,fetched:0,cycles:[]}} = useCycles(props,{cacheKey,enabled:!!q});
  const [cycles,setCycles] = useState<CycleSumary[]>([])

  useEffect(()=>{
    let props: Prisma.CycleWhereInput|undefined = undefined;
    if(q && (filtersType||(filtersCountries && filtersCountries.length))){
      props = getProps();
    }
    if(props)
      setProps(s=>({...s,where:{...props}}))
  },[filtersType.public,filtersType.private,filtersCountries,q])

  useEffect(()=>{
    if(c){
      setCycles(c);
    }
  },[c])

  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(inView && cycles.length < total){
      const fi = async ()=>{
        const {id} = cycles.slice(-1)[0]
        const r = await getCycles(lang,{...props,skip:1,cursor:{id}});
        setCycles((c: any)=>[...c,...r.cycles])
      }
      fi()
    }
  },[inView])

  const render=()=>{
    if(cycles)
      return <>
          <FilterEngineCycles/>
          <Row>
              {cycles.map(p=><Col xs={12} sm={6} lg={3} xxl={2} className="mb-5 d-flex justify-content-center  align-items-center" key={p.id}>
                <MosaicItem cycle={p} cycleId={p.id} className="" imageLink={true} cacheKey={['CYCLE',p.id.toString()]} size={'md'} /></Col>)}
          </Row>
          {cycles?.length!=total && <Spinner ref={ref} animation="grow" />}
      </>
    return <></>    
  }

  return  render();
  

};
export default SearchTabCycles;
