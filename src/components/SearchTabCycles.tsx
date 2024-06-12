import { useState, FunctionComponent, useEffect, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import MosaicItem from '@/src/components/cycle/MosaicItem'
import {getCycles} from '@/src/useCycles'
import useFilterEngineCycles from './useFilterEngineCycles';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { CycleSumary } from '../types/cycle';
import useCyclesSumary from '../useCyclesSumary';
import { MosaicsGrid } from './MosaicsGrid';
import { Alert, CircularProgress } from '@mui/material';

const take = 8;
interface Props{
}
const SearchTabCycles:FunctionComponent<Props> = () => {
  const { t,lang } = useTranslation('common');
  const router = useRouter();
  const terms = router?.query.q?.toString()!.split(" ") || [];
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
  const cacheKey = [`cycles-search-${lang}-${JSON.stringify(props)}`];
          
  const {data:{total,fetched,cycles:c}={total:0,fetched:0,cycles:[]},isLoading} = useCyclesSumary(lang,props,{cacheKey,enabled:!!router.query?.q});
  const [cycles,setCycles] = useState<CycleSumary[]>([])

  useEffect(()=>{
    let props: Prisma.CycleWhereInput|undefined = undefined;
    if(router.query.q && (filtersType||(filtersCountries && filtersCountries.length))){
      props = getProps();
    }
    if(props)
      setProps(s=>({...s,where:{...props}}))
  },[filtersType.public,filtersType.private,filtersCountries,router.query.q])

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

  return  <>
    <FilterEngineCycles/>
    {/* {
      cycles?.length==0
        ? <Alert>{t('ResultsNotFound')}</Alert>
        : <></>
    } */}
    <MosaicsGrid isLoading={isLoading}>
        {cycles?.map(p=>
          <MosaicItem key={p.id} cycle={p} cycleId={p.id} className="" imageLink={true} cacheKey={['CYCLE',p.id.toString()]} size={'md'} />
        )}
    </MosaicsGrid>
    {cycles?.length!=total && <CircularProgress ref={ref} />}
  </>
  

};
export default SearchTabCycles;
