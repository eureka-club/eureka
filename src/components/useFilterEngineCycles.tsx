import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';
import { Checkbox, FormControlLabel, FormGroup, Stack } from "@mui/material";
import useAutocompleteRegions from "./useAutocompleteRegions";
export interface FiltersType {
  public:boolean;
  private:boolean
} 
const useFilterEngineCycles = ()=>{
  const { t } = useTranslation('searchEngine');
    const [filtersType,setFiltersType]=useState<FiltersType>({private:true,public:true})
    
    const{AutocompleteRegions,countries:filtersCountries}=useAutocompleteRegions();

    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const fc = {...filtersType, [`${q}`]: e.target.checked};
      setFiltersType(fc);
      // if(filtersTypeChanged)
      //   filtersTypeChanged(fc)
    };
    
    const FilterEngineCycles: React.FC = ()=>{
      
    return <Stack paddingTop={2} paddingBottom={2} justifyContent={'center'} alignItems={'center'}>
      <FormGroup row sx={{justifyContent:'center'}}>
        <FormControlLabel label={t('private')}control={
          <Checkbox data-cy="check-private" checked={filtersType['private']} onChange={(e) => handlerComboxesChangeType(e, 'private')}/>
        }/>
        <FormControlLabel label={t('public')} control={
          <Checkbox data-cy="check-public" checked={filtersType['public']} onChange={(e) => handlerComboxesChangeType(e, 'public')}/>
        }/>
      </FormGroup>
      <AutocompleteRegions/>
    </Stack>
    }
    return {FilterEngineCycles,filtersType,filtersCountries};
}
export default useFilterEngineCycles