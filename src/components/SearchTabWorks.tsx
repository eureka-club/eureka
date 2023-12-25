"use client"

import { useState, FunctionComponent, useEffect } from 'react';
import MosaicItem from '@/src/components/work/MosaicItem'
import useFilterEngineWorks from '@/src/hooks/useFilterEngineWorks';
import { Prisma } from '@prisma/client';
import { WorkMosaicItem } from '@/src/types/work';
import { getWorksProps } from '@/src/types/work';
import { useSearchParams } from 'next/navigation';
import { Grid } from '@mui/material';

// import { useRouter } from 'next/router';
// import useWorks,{getWorks} from '@/src/hooks/useWorks'
// import { useInView } from 'react-intersection-observer';

const take = 8;
interface Props{
  works:WorkMosaicItem[]
}
const SearchTabWorks:FunctionComponent<Props> = ({works}) => {
  // const { t,lang } = useTranslation('common');
  // const {langs}=useDictContext()
  
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const terms = q?.split(" ") || [];
  // const cacheKey = `works-search-${q}`;

  const {FilterEngineWork,filtersType,filtersCountries,hasChangedFiltersType,hasChangedFiltersCountries} = useFilterEngineWorks()

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
            in:(filtersCountries as string[])
        }},
        {countryOfOrigin2:{
          in:(filtersCountries as string[])
      } }
        ]
      }
    }
    return res;
  };

  const [props,setProps]=useState<Prisma.WorkFindManyArgs>({/*take,*/where:{...getProps()}})

  // let {data:{total,fetched,works:worksFiltered}={total:0,fetched:0,works:null}} = useWorks(props,{cacheKey,enabled:!!q});
  // const [works,setWorks] = useState<WorkMosaicItem[]>([])
  // worksFiltered = worksFiltered??works;

  let worksFiltered = [...works];

  if(hasChangedFiltersType){
    const wf = worksFiltered.filter(w=>{
      return filtersType[w.type];
    })
    worksFiltered = wf;
  }

  if(hasChangedFiltersCountries && filtersCountries){
    if(filtersCountries.length){
      worksFiltered = worksFiltered.filter(w=>{
        return (w.countryOfOrigin && filtersCountries.includes(w.countryOfOrigin)) || (w.countryOfOrigin2 && filtersCountries.includes(w.countryOfOrigin2));
      })
    }
  }

  // useEffect(()=>{
  //   if(hasChangedFiltersType){
  //     let props: Prisma.WorkWhereInput|undefined = undefined;
  //     if(q && (filtersType||(filtersCountries && filtersCountries.length))){
  //       props = getProps();
  //     }
  //     if(props){
  //       setProps(s=>({...s,where:{...props}}))
  //     }
  //   }
  // },[hasChangedFiltersType])

  // useEffect(()=>{
  //   if(c)setWorks(c)
  // },[c])

  // const [ref, inView] = useInView({
  //   triggerOnce: false,
  // });

  // useEffect(()=>{
  //   if(inView && works.length < total){
  //     const fi = async ()=>{
  //       const {id} = works.slice(-1)[0]
  //       // const r = await getWorks(langs,{...props,skip:1,cursor:{id}});
  //       // setWorks((c: any)=>[...c,...r.works])
  //       const props = getProps();
  //       if(props){
  //         setProps(s=>({...s,where:{...props,skip:1,cursor:{id}}}))
  //       }
  //     }
  //     fi()
  //   }
  // },[inView])

  const renderWorks=()=>{
    if(works)
      return <>
        <FilterEngineWork/>
        <Grid container className='justify-content-center justify-content-sm-between column-gap-4'>
            {worksFiltered?.map(p=><Grid item  className="mb-5 d-flex justify-content-center  align-items-center" key={p.id} sx={{
              '@media (min-width: 800px)':{
                ':last-child':{marginRight:'auto'}
              }
            }}>
              <MosaicItem work={p} workId={p.id} className="" imageLink={true} cacheKey={['WORK',p.id.toString()]} size={'md'}  /></Grid>)}
        </Grid>
        {/* {works?.length!=total && <Spinner ref={ref} animation="grow" />} */}
      </>
      return <></>
  }

  return renderWorks()
};
export default SearchTabWorks;
