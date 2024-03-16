import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';
import FilterEngineCountries,{FiltersRegionsType} from '@/components/FilterEngineCountries'
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import useAutocompleteCountries from "./useAutocompleteCountries";
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
    
    const{AutocompleteCountries,countries:filtersCountries}=useAutocompleteCountries()
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

    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const fc = {...filtersType, [`${q}`]: e.target.checked};
      setFiltersType(fc);
    };
    
    const FilterEngineWork: React.FC = ()=>{
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <FormGroup row>
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
    </div>
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
    return {FilterEngineWork,filtersType,filtersCountries};
}
export default useFilterEngineWorks