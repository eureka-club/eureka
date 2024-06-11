import { useState, FunctionComponent, useEffect, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

import MosaicItem from '@/components/work/MosaicItem'

import useFilterEngineWorks from './useFilterEngineWorks';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { WorkSumary } from '../types/work';
import { getWorksProps } from '../types/work';
import useWorksSumary, { getWorksSumary } from '../useWorksSumary';
import { Alert } from '@mui/material';
import { MosaicsGrid } from './MosaicsGrid';

const take = 8;
const SearchTabworks:FunctionComponent = () => {
  const { t,lang } = useTranslation('common');
  const router = useRouter();
  const terms = router?.query.q?.toString()!.split(" ") || [];

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
  const cacheKey = useMemo(()=>[`works-search-${JSON.stringify(props)}`],[props]);

  const {data:{total,fetched,works:c}={total:0,fetched:0,works:[]},isLoading} = useWorksSumary(props,{cacheKey,enabled:!!router.query?.q});
  const [works,setWorks] = useState<WorkSumary[]>([])
  
  useEffect(()=>{

    let props: Prisma.WorkWhereInput|undefined = undefined;
    if(router.query.q && (filtersType||(filtersCountries && filtersCountries.length))){
      props = getProps();
    }
    if(props){
      setProps(s=>({...s,where:{...props}}))
    }
  },[filtersType,filtersCountries,router.query.q])

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
        const r = await getWorksSumary(lang,{...props,skip:1,cursor:{id}});
        setWorks((c: any)=>[...c,...r.works])
      }
      fi()
    }
  },[inView])

  return  <>
    <FilterEngineWork/>
    {/* {
      works?.length==0
        ? <Alert>{t('ResultsNotFound')}</Alert>
        : <></>
    } */}
    <MosaicsGrid isLoading={isLoading}>
        {works?.map(p=>
          <MosaicItem key={p.id} work={p} workId={p.id} className="" imageLink={true} cacheKey={cacheKey} size={'md'}  />
        )}
    </MosaicsGrid>
    {/* {works?.length!=total && <CircularProgress ref={ref} />} */}
    {works?.length!=total && <hr ref={ref}/>}

  </>
};
export default SearchTabworks;
