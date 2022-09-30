import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';

import { Row, Col, Form } from 'react-bootstrap';

import FilterEngineCountries from '@/components/FilterEngineCountries'

const useFilterEngineCycles = ()=>{
  const { t } = useTranslation('searchEngine');
    const [filtersType,setFiltersType]=useState<Record<string,boolean>>({private:true,public:true})
    
    const [filtersCountries,setFiltersCountries]=useState<string[]>([])
    const [filtersRegions,setFiltersRegions]=useState<Record<string,boolean>>({})

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
      label={t('private')}
      checked={filtersType['private']}
      onChange={(e) => handlerComboxesChangeType(e, 'private')}
      />
      <Form.Check inline
      type="checkbox"
      label={t('public')}
      checked={filtersType['public']}
      onChange={(e) => handlerComboxesChangeType(e, 'public')}
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
  return {FilterEngineCycles,filtersType,filtersCountries};
}
export default useFilterEngineCycles