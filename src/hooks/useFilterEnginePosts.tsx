import React, { useState  } from "react"
import FilterEngineCountries,{FiltersRegionsType} from '@/src/components/FilterEngineCountries'


const useFilterEnginePosts = ()=>{
    const [hasChangedFiltersCountries,sethasChangedFiltersCountries] = useState(false)
    const [filtersCountries,setFiltersCountries]=useState<any[]>([])
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
    return <section className="d-flex flex-row align-items-center justify-content-center justify-content-sm-end my-2">
    <div className="my-3">
      <FilterEngineCountries 
        filtersCountries={filtersCountries}
        setFiltersCountries={(v)=>{
          setFiltersCountries(v);
          sethasChangedFiltersCountries(true)
        }}
        filtersRegions={filtersRegions}
        setFiltersRegions={(v)=>{
          setFiltersRegions(v)
          sethasChangedFiltersCountries(true)
        }}
      />
    </div>
    </section>
  }
  return {FilterEnginePosts,filtersCountries,hasChangedFiltersCountries};
}
export default useFilterEnginePosts