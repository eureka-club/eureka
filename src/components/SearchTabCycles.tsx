"use client"

import { useState, FunctionComponent, useEffect } from 'react';
import { useRouter } from 'next/router';
import MosaicItem from '@/src/components/cycle/MosaicItem'
import useCycles,{getCycles} from '@/src/hooks/useCycles'
import useFilterEngineCycles from '@/src/hooks/useFilterEngineCycles';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { CycleMosaicItem } from '@/src/types/cycle';
import { useDictContext } from '../hooks/useDictContext';
import { Grid } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const take = 8;
interface Props{
  cycles:CycleMosaicItem[]
}
const SearchTabCycles:FunctionComponent<Props> = ({cycles}) => {
  const {FilterEngineCycles,filtersCountries,hasChangedFiltersCountries} = useFilterEngineCycles()

  let cyclesFiltered = [...cycles];

  if(hasChangedFiltersCountries && filtersCountries){
    if(filtersCountries.length){
      cyclesFiltered = cyclesFiltered.filter(w=>{
        return w.creator.countryOfOrigin && filtersCountries.includes(w.creator.countryOfOrigin);
      })
    }
  }

  const render=()=>{
    if(cycles)
      return <>
          <FilterEngineCycles/>
          <Grid container className='justify-content-center justify-content-sm-between column-gap-4'>
            {cyclesFiltered?.map(p=><Grid item  className="mb-5 d-flex justify-content-center  align-items-center" key={p.id} sx={{
              '@media (min-width: 800px)':{
                ':last-child':{marginRight:'auto'}
              }
            }}>
              <MosaicItem cycle={p} cycleId={p.id} className="" imageLink={true} cacheKey={['CYCLE',p.id.toString()]} size={'md'}  /></Grid>)}
          </Grid>
      </>
    return <></>    
  }

  return  render();
  

};
export default SearchTabCycles;
