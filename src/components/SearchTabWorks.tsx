import { useState, FunctionComponent, useEffect } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Spinner,Row, Col} from 'react-bootstrap';

import MosaicItem from '@/components/work/MosaicItem'

import useWorks,{getWorks} from '@/src/useWorks'

import useFilterEngineWorks from './useFilterEngineWorks';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { WorkDetail } from '../types/work';
import { getWorksProps } from '../types/work';
import { useDictContext } from '../hooks/useDictContext';

const take = 8;
const SearchTabworks:FunctionComponent = () => {
  const { t, dict } = useDictContext();
  const router = useRouter();
  const{lang}=useParams<{lang:string}>()!;
  const searchParams=useSearchParams();
  const q=searchParams?.get('q');
  const terms = q?.toString()!.split(" ") || [];

  const cacheKey = `works-search-${q?.toString()}`;

  const {FilterEngineWork,filtersType,filtersCountries} = useFilterEngineWorks()

  const getProps = ()=>{
    const res:Prisma.WorkWhereInput = {
     ... getWorksProps(terms)
    }
    if(filtersType){
      const typesChecked = Object.entries(filtersType).filter(([_,v])=>v).map(([k,_])=>k)
      res.AND = {
        ...res.AND ? res.AND : {},
        type:{
          in:typesChecked
        }
      }
    }
    if(filtersCountries && filtersCountries.length){
      res.AND = {
        ...res.AND ? res.AND : {},
        OR:[
          {countryOfOrigin:{
            in:filtersCountries
        }},
        {countryOfOrigin2:{
          in:filtersCountries
      } }
        ]
      }
    }
    return res;
  };

  const [props,setProps]=useState<Prisma.WorkFindManyArgs>({take,where:{...getProps()}})
  const {data:{total,fetched,works:c}={total:0,fetched:0,works:[]}} = useWorks(props,{cacheKey,enabled:!!q});
  const [works,setWorks] = useState<WorkDetail[]>([])
  
  useEffect(()=>{

    let props: Prisma.WorkWhereInput|undefined = undefined;
    if(q && (filtersType||(filtersCountries && filtersCountries.length))){
      props = getProps();
    }
    if(props){
      setProps(s=>({...s,where:{...props}}))
    }
  },[filtersType,filtersCountries,q])

  useEffect(()=>{
    if(c)setWorks(c)
  },[c])

  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(inView && works.length < total){
      const fi = async ()=>{
        const {id} = works.slice(-1)[0]
        const r = await getWorks(lang,{...props,skip:1,cursor:{id}});
        setWorks((c: any)=>[...c,...r.works])
      }
      fi()
    }
  },[inView])

  const renderWorks=()=>{
    if(works)
      return <>
        <FilterEngineWork/>
        <Row>
            {works.map(p=><Col xs={12} sm={6} lg={3} xxl={2} className="mb-5 d-flex justify-content-center  align-items-center" key={p.id}>
              <MosaicItem work={p} workId={p.id} className="" imageLink={true} cacheKey={['WORK',p.id.toString()]} size={'md'}  /></Col>)}
        </Row>
        {works?.length!=total && <Spinner ref={ref} animation="grow" />}
      </>
      return <></>
  }

  return renderWorks()
};
export default SearchTabworks;
