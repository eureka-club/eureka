import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';
import { Checkbox, FormControlLabel, FormGroup, Stack } from "@mui/material";
import useAutocompleteRegions from "./useAutocompleteRegions";
export interface FiltersType {
  'fiction-book':boolean;
  book:boolean;
  movie:boolean;
  documentary:boolean;
} 
const useFilterEngineWorks = ()=>{
  const { t } = useTranslation('searchEngine');
    const [filtersType,setFiltersType]=useState<FiltersType>({
      book:true,
      'fiction-book':true,
      movie:true,
      documentary:true
    })
    
    const{AutocompleteRegions,countries:filtersCountries}=useAutocompleteRegions()

    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const fc = {...filtersType, [`${q}`]: e.target.checked};
      setFiltersType(fc);
    };
    
    const FilterEngineWork: React.FC = ()=>{
    return <Stack paddingTop={2} paddingBottom={2} justifyContent={'center'} alignItems={'center'}>
      <FormGroup row sx={{justifyContent:'center'}}>
        <FormControlLabel label={t('Fiction books')} control={
          <Checkbox data-cy="check-fiction-book" checked={filtersType['fiction-book']} onChange={(e) => handlerComboxesChangeType(e, 'fiction-book')}/>
        }/>
        <FormControlLabel label={t('Nofictions books')} control={
          <Checkbox data-cy="check-book" checked={filtersType['book']} onChange={(e) => handlerComboxesChangeType(e, 'book')}/>
        }/>
        <FormControlLabel label={t('Movies')} control={
          <Checkbox data-cy="check-movie" checked={filtersType.movie} onChange={(e) => handlerComboxesChangeType(e, 'movie')}/>
        }/>
        <FormControlLabel label={t('Documentaries')} control={
          <Checkbox data-cy="check-documentary" checked={filtersType.documentary} onChange={(e) => handlerComboxesChangeType(e, 'documentary')}/>
        }/>
      </FormGroup>
      <AutocompleteRegions/>
    </Stack>
    }
    return {FilterEngineWork,filtersType,filtersCountries};
}
export default useFilterEngineWorks