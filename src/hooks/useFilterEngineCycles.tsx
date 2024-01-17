import React, { useState,ChangeEvent  } from "react"
import { Form } from 'react-bootstrap';

import FilterEngineCountries,{FiltersRegionsType} from '@/src/components/FilterEngineCountries'
const{lang}=useParams<{lang:string}>()!;
import { useDictContext } from '@/src/hooks/useDictContext';
import { useParams } from "next/navigation";
export interface FiltersType {
  public:boolean;
  private:boolean;
  
} 
const useFilterEngineCycles = ()=>{
  const [hasChangedFiltersCountries,sethasChangedFiltersCountries] = useState(false)

    const [filtersType,setFiltersType]=useState<FiltersType>({private:true,public:true})
    const{t,dict}=useDictContext()
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

    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const fc = {...filtersType, [`${q}`]: e.target.checked};
      setFiltersType(fc);
      // if(filtersTypeChanged)
      //   filtersTypeChanged(fc)
    };
    
    const FilterEngineCycles: React.FC = ()=>{
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <Form.Check inline
      type="checkbox"
      label={t(dict,'private')}
      checked={filtersType['private']}
      data-cy="check-private"
      onChange={(e) => handlerComboxesChangeType(e, 'private')}
      />
      <Form.Check inline
      type="checkbox"
      label={t(dict,'public')}
      checked={filtersType['public']}
      data-cy="check-public"
      onChange={(e) => handlerComboxesChangeType(e, 'public')}
      />
    </div>
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
    return {FilterEngineCycles,filtersType,filtersCountries,hasChangedFiltersCountries};
}
export default useFilterEngineCycles