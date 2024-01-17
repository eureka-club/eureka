import React, { useState  } from "react"
// 

import FilterEngineCountries,{FiltersRegionsType} from '@/components/FilterEngineCountries'

const useFilterEnginePosts = ()=>{
  // const { t, dict } = useDictContext();
    
    const [filtersCountries,setFiltersCountries]=useState<string[]>([])
    const [filtersRegions,setFiltersRegions]=useState<FiltersRegionsType>({
      Asia:false,
      Europe:false,
      ['Latin America and the Caribbean']:false,
      ['Middle East and North Africa']:false,
      ['Northern America']:false,
      Oceania:false,
      ['Sub-Saharan Africa']:false,
    })
    
const FilterEnginePosts: React.FC = ()=>{
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <FilterEngineCountries 
        filtersCountries={filtersCountries}
        setFiltersCountries={setFiltersCountries}
        filtersRegions={filtersRegions}
        setFiltersRegions={setFiltersRegions}
      />
    </div>
    </section>
  }
  return {FilterEnginePosts,filtersCountries};
}
export default useFilterEnginePosts