import React, { useState,ChangeEvent  } from "react"
import useTranslation from 'next-translate/useTranslation';

import { Container, Row, Col, Form, OverlayTrigger, Popover, Button } from 'react-bootstrap';

const useFilterEnginePosts = ()=>{
  const { t } = useTranslation('searchEngine');

    const [filtersChecked,setFiltersChecked]=useState<Record<string,boolean>>({
        'fiction-book':false
    })

    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
        e.stopPropagation();
        const types = type.split('|');
        types.forEach((ty: string) => {
            setFiltersChecked((res) => ({ ...res, [`${ty}`]: !res[`${ty}`] }));
        });
           console.log(filtersChecked) 
      };
    

const FilterEngineWorks: React.FC = ()=>{
    return <Form.Group className="my-3">
    <Form.Check inline
    type="checkbox"
    label={t('Fiction books')}
    checked={filtersChecked['fiction-book']}
    onChange={(e) => handlerComboxesChangeType(e, 'fiction-book')}
    />
    <Form.Check inline
    type="checkbox"
    label={t('Nofictions books')}
    checked={filtersChecked['book']}
    onChange={(e) => handlerComboxesChangeType(e, 'book')}
    />
    <Form.Check inline
    type="checkbox"
    label={t('Movies')}
    checked={filtersChecked.movie}
    onChange={(e) => handlerComboxesChangeType(e, 'movie')}
    />
    <Form.Check inline
    type="checkbox"
    label={t('Documentaries')}
    checked={filtersChecked.documentary}
    onChange={(e) => handlerComboxesChangeType(e, 'documentary')}
    />
  </Form.Group>}
  return {FilterEngineWorks,filtersChecked}
}
export default useFilterEnginePosts