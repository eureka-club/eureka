import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import useAutocompleteRegions from "./useAutocompleteRegions";
export interface FiltersType {
  public:boolean;
  private:boolean
} 
const useFilterEngineCycles = ()=>{
  const { t } = useTranslation('searchEngine');
    const [filtersType,setFiltersType]=useState<FiltersType>({private:true,public:true})
    
    const{AutocompleteRegions,countries:filtersCountries}=useAutocompleteRegions();

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
          <AutocompleteRegions/>
        }
      />
      </FormGroup>
    </div>
    </section>
    }
    return {FilterEngineCycles,filtersType,filtersCountries};
}
export default useFilterEngineCycles