import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';

import FilterEngineCountries,{FiltersRegionsType} from '@/components/FilterEngineCountries'
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import useAutocompleteCountries from "./useAutocompleteCountries";
export interface FiltersType {
  public:boolean;
  private:boolean
} 
const useFilterEngineCycles = ()=>{
  const { t } = useTranslation('searchEngine');
    const [filtersType,setFiltersType]=useState<FiltersType>({private:true,public:true})
    
    const{AutocompleteCountries,countries:filtersCountries}=useAutocompleteCountries();

    // const [filtersCountries,setFiltersCountries]=useState<string[]>([])
    const [filtersRegions,setFiltersRegions]=useState<FiltersRegionsType>({
      Asia:false,
      Europe:false,
      ['Latin America and the Caribbean']:false,
      ['Middle East and North Africa']:false,
      ['Northern America']:false,
      Oceania:false,
      ['Sub-Saharan Africa']:false,
    })

    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, q: string) => {debugger;
      const fc = {...filtersType, [`${q}`]: e.target.checked};
      setFiltersType(fc);
      // if(filtersTypeChanged)
      //   filtersTypeChanged(fc)
    };
    
    const FilterEngineCycles: React.FC = ()=>{
      
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <FormGroup row>
        <FormControlLabel label={t('private')}control={
          <Checkbox data-cy="check-private" checked={filtersType['private']} onChange={(e) => handlerComboxesChangeType(e, 'private')}/>
        }/>
        <FormControlLabel label={t('public')} control={
          <Checkbox data-cy="check-public" checked={filtersType['public']} onChange={(e) => handlerComboxesChangeType(e, 'public')}/>
        }/>
        <FormControlLabel label='' control={
          <AutocompleteCountries/>
          // <FilterEngineCountries 
          // filtersCountries={filtersCountries}
          // setFiltersCountries={setFiltersCountries}
          // filtersRegions={filtersRegions}
          // setFiltersRegions={setFiltersRegions}/>
        }
      />
      </FormGroup>
      {/* <Form.Check inline
      type="checkbox"
      label={t('private')}
      checked={filtersType['private']}
      data-cy="check-private"
      onChange={(e) => handlerComboxesChangeType(e, 'private')}
      /> */}
      {/* <Form.Check inline
      type="checkbox"
      label={t('public')}
      checked={filtersType['public']}
      data-cy="check-public"
      onChange={(e) => handlerComboxesChangeType(e, 'public')}
      /> */}
    </div>
    {/* <div className="my-3">
      <FilterEngineCountries 
        filtersCountries={filtersCountries}
        setFiltersCountries={setFiltersCountries}
        filtersRegions={filtersRegions}
        setFiltersRegions={setFiltersRegions}
      />
    </div> */}
    </section>
    }
    return {FilterEngineCycles,filtersType,filtersCountries};
}
export default useFilterEngineCycles