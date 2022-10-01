import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';
import { Form } from 'react-bootstrap';

import FilterEngineCountries,{FiltersRegionsType} from '@/components/FilterEngineCountries'
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

    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const fc = {...filtersType, [`${q}`]: e.target.checked};
      setFiltersType(fc);
    };
    
    const FilterEngineWork: React.FC = ()=>{
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <Form.Check inline
      type="checkbox"
      label={t('Fiction books')}
      checked={filtersType['fiction-book']}
      onChange={(e) => handlerComboxesChangeType(e, 'fiction-book')}
      />
      <Form.Check inline
      type="checkbox"
      label={t('Nofictions books')}
      checked={filtersType['book']}
      onChange={(e) => handlerComboxesChangeType(e, 'book')}
      />
      <Form.Check inline
      type="checkbox"
      label={t('Movies')}
      checked={filtersType.movie}
      onChange={(e) => handlerComboxesChangeType(e, 'movie')}
      />
      <Form.Check inline
      type="checkbox"
      label={t('Documentaries')}
      checked={filtersType.documentary}
      onChange={(e) => handlerComboxesChangeType(e, 'documentary')}
      />
    </div>
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
    return {FilterEngineWork,filtersType,filtersCountries};
}
export default useFilterEngineWorks