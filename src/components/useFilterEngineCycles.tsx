import React, { useState,ChangeEvent, useEffect  } from "react"
import styles from './FilterEngine.module.css';

import useTranslation from 'next-translate/useTranslation';

import { Container, Row, Col, Form, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import TagsInputTypeAhead from './forms/controls/TagsInputTypeAhead';

import useCountries from '@/src/useCountries'

interface Props{
  filtersTypeChanged?: (filtersType:Record<string,boolean>)=>Promise<void>;
}
const useFilterEngineCycles = (props:Props)=>{
  const { t } = useTranslation('searchEngine');
  const {filtersTypeChanged} = props;

    const [filtersType,setFiltersType]=useState<Record<string,boolean>>({private:true,public:true})
    const [filtersRegions,setFiltersRegions]=useState<Record<string,boolean>>({})
    const [filtersCountries,setFiltersCountries]=useState<Record<string,boolean>>({})

    const [onlyCountries,setOnlyCountries]=useState<string[]>([])


    const handlerComboxesChangeRegions = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const fc = {...filtersRegions, [`${q}`]: e.target.checked};
      setFiltersRegions(fc);console.log(fc)
    };
    
    const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const fc = {...filtersType, [`${q}`]: e.target.checked};
      setFiltersType(fc);
      if(filtersTypeChanged)
        filtersTypeChanged(fc)
    };
  
    const {data} = useCountries([...onlyCountries])
    const [countries,setCountries] = useState<string[]>([]);
    const [countriesAll,setCountriesAll] = useState<{code:string,label:string}[]>(data?data.map((code:string)=>({code,label:code})):[]);

    const getPopoverGeography = () => {
      return <Popover id='popover-geography' className="position-absolute top-0">
        <Popover.Body>
        <Form.Label>
                      <strong>{t('Regions')}</strong>
                    </Form.Label>
                    <Form.Group className={styles.formGroup}>
                      <Form.Check
                        className={styles.filter}
                        type="checkbox"
                        label={`${t('countries:Asia')} `}
                        checked={filtersRegions.Asia}
                        onChange={(e) => handlerComboxesChangeRegions(e, 'Asia')}
                      />
                    </Form.Group>
                    <Form.Group className={styles.formGroup}>
                      <Form.Check
                        className={styles.filter}
                        type="checkbox"
                        label={`${t('countries:Europe')} `}
                        checked={filtersRegions.Europe}
                        onChange={(e) => handlerComboxesChangeRegions(e, 'Europe')}
                      />
                    </Form.Group>
                    <Form.Group className={styles.formGroup}>
                      <Form.Check
                        className={styles.filter}
                        type="checkbox"
                        label={`${t('countries:Latin America and the Caribbean')} `}
                        checked={filtersRegions['Latin America and the Caribbean']}
                        onChange={(e) => handlerComboxesChangeRegions(e, 'Latin America and the Caribbean')}
                      />
                    </Form.Group>
                    <Form.Group className={styles.formGroup}>
                      <Form.Check
                        className={styles.filter}
                        type="checkbox"
                        label={`${t('countries:Middle East and North Africa')} `}
                        checked={filtersRegions['Middle East and North Africa']}
                        onChange={(e) => handlerComboxesChangeRegions(e, 'Middle East and North Africa')}
                      />
                    </Form.Group>
                    <Form.Group className={styles.formGroup}>
                      <Form.Check
                        className={styles.filter}
                        type="checkbox"
                        label={`${t('countries:Northern America')} `}
                        checked={filtersRegions['Northern America']}
                        onChange={(e) => handlerComboxesChangeRegions(e, 'Northern America')}
                      />
                    </Form.Group>
                    <Form.Group className={styles.formGroup}>
                      <Form.Check
                        className={styles.filter}
                        type="checkbox"
                        label={`${t('countries:Oceania')}`}
                        checked={filtersRegions.Oceania}
                        onChange={(e) => handlerComboxesChangeRegions(e, 'Oceania')}
                      />
                    </Form.Group>
                    <Form.Group className={styles.formGroup}>
                      <Form.Check
                        className={styles.filter}
                        type="checkbox"
                        label={`${t('countries:Sub-Saharan Africa')}`}
                        checked={filtersRegions['Sub-Saharan Africa']}
                        onChange={(e) => handlerComboxesChangeRegions(e, 'Sub-Saharan Africa')}
                      />
                    </Form.Group>
                    <br />
                    <Form.Label>
                      <strong>{t('Countries')}</strong>
                    </Form.Label>
                    {/* <TagsInputTypeAhead data={countries} items={items} tags={tags} setTags={setTags} /> */}
                    <TagsInputTypeAhead
                      data={countriesAll}
                      items={countries}
                      setItems={setCountries}
                      max={5}
                      labelKey={(res) => `${t(`countries:${res.code}`)}`}
                      onTagCreated={() => {
                        // const onlyByCountries = [
                        //   ...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items]),
                        // ];
                        // setGlobalSearchEngineState({
                        //   ...globalSearchEngineState,
                        //   ...{ onlyByCountries },
                        // });
                      }}
                      onTagDeleted={(code) => {
                        // const onlyByCountries = [
                        //   ...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items]),
                        // ];
                        // const idxOBC = onlyByCountries.findIndex((i: string) => i === code);
                        // onlyByCountries.splice(idxOBC, 1);
                        // setGlobalSearchEngineState({
                        //   ...globalSearchEngineState,
                        //   ...{ onlyByCountries },
                        // });

                      }}
                    />
        </Popover.Body>
      </Popover>
    };
  

    // const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    //     e.stopPropagation();
    //     const types = type.split('|');
    //     types.forEach((ty: string) => {
    //         setRegionsChecked((res) => ({ ...res, [`${ty}`]: !res[`${ty}`] }));
    //     });
    //        console.log(filtersChecked) 
    //   };
    
const [seeGeographyFilter,setSeeGeographyFilter] = useState(false)
const FilterEngineCycles: React.FC = ()=>{
    return <Row>
    <Col className="my-3">
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
    
  </Col>
    <Col >

                <Button className="ms-3" variant="light" onClick={()=>setSeeGeographyFilter(r=>!r)}>{t('Geography')}</Button>
                {seeGeographyFilter && <div className="position-relative">{getPopoverGeography()}</div>}
    </Col>
    </Row>
  }
  return {FilterEngineCycles,filtersType,filtersRegions,filtersCountries};
}
export default useFilterEngineCycles