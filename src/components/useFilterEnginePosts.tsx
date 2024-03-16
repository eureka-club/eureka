import React, { useEffect, useState  } from "react"
// import useTranslation from 'next-translate/useTranslation';

import FilterEngineCountries,{FiltersRegionsType} from '@/components/FilterEngineCountries'
import useAutocompleteCountries from "./useAutocompleteCountries"

const useFilterEnginePosts = ()=>{
  // const { t } = useTranslation('searchEngine');
    
    const [filtersRegions,setFiltersRegions]=useState<FiltersRegionsType>({
      Asia:false,
      Europe:false,
      ['Latin America and the Caribbean']:false,
      ['Middle East and North Africa']:false,
      ['Northern America']:false,
      Oceania:false,
      ['Sub-Saharan Africa']:false,
    })
    const{AutocompleteCountries,countries:filtersCountries}=useAutocompleteCountries();
    console.log('filtersCountries ',filtersCountries)
    
    const FilterEnginePosts: React.FC = ()=>{
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <AutocompleteCountries/>
    {/* <FilterEngineCountries 
        filtersCountries={filtersCountries}
        setFiltersCountries={setFiltersCountries}
        filtersRegions={filtersRegions}
        setFiltersRegions={setFiltersRegions}
      /> */}
    </div>
    </section>
  }
  return {FilterEnginePosts,filtersCountries};
}
export default useFilterEnginePosts