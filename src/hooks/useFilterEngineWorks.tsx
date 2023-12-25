import React, { useState,ChangeEvent  } from "react"
import { Form } from 'react-bootstrap';

import FilterEngineCountries,{FiltersRegionsType} from '@/src/components/FilterEngineCountries'
import { useDictContext } from "./useDictContext";
import { t } from "../get-dictionary";
import { Option } from "react-bootstrap-typeahead/types/types";

export type WorkFiltersType  = Record<string,boolean>;
const useFilterEngineWorks = ()=>{
  // const { t } = useTranslation('searchEngine');
  const{dict}=useDictContext()
    const [filtersType,setFiltersType]=useState<WorkFiltersType>({
      book:true,
      'fiction-book':true,
      movie:true,
      documentary:true
    })
    const [hasChangedFiltersType,sethasChangedFiltersType] = useState(false);
    const [hasChangedFiltersCountries,sethasChangedFiltersCountries] = useState(false);

    const [filtersCountries,setFiltersCountries]=useState<Option[]>([])
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
      sethasChangedFiltersType(true);
    };
    
    const FilterEngineWork: React.FC = ()=>{
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <Form.Check data-cy="check-fiction-book" inline
      type="checkbox"
      label={t(dict,'Fiction books')}
      checked={filtersType['fiction-book']}
      onChange={(e) => handlerComboxesChangeType(e, 'fiction-book')}
      />
      <Form.Check data-cy="check-book" inline
      type="checkbox"
      label={t(dict,'Nofictions books')}
      checked={filtersType['book']}
      onChange={(e) => handlerComboxesChangeType(e, 'book')}
      />
      <Form.Check data-cy="check-movie" inline
      type="checkbox"
      label={t(dict,'Movies')}
      checked={filtersType.movie}
      onChange={(e) => handlerComboxesChangeType(e, 'movie')}
      />
      <Form.Check data-cy="check-documentary" inline
      type="checkbox"
      label={t(dict,'Documentaries')}
      checked={filtersType.documentary}
      onChange={(e) => handlerComboxesChangeType(e, 'documentary')}
      />
    </div>
    <div className="my-3">
      <FilterEngineCountries 
        filtersCountries={filtersCountries}
        setFiltersCountries={(v)=>{
          setFiltersCountries(v);
          sethasChangedFiltersCountries(true);
        }}
        filtersRegions={filtersRegions}
        setFiltersRegions={(v)=>{
          setFiltersRegions(v);
          sethasChangedFiltersCountries(true);
        }}
      />
    </div>
    </section>
    }
    return {FilterEngineWork,filtersType,filtersCountries,hasChangedFiltersType,hasChangedFiltersCountries};
}
export default useFilterEngineWorks