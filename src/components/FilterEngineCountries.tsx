import React, { useState,ChangeEvent, useEffect,Dispatch,SetStateAction  } from "react"
import styles from './FilterEngine.module.css';
import { Country } from "../types";
import useTranslation from 'next-translate/useTranslation';

import { Form, OverlayTrigger, Popover, Button,ButtonGroup} from 'react-bootstrap';
import TagsInputTypeAhead from './forms/controls/TagsInputTypeAhead';
import useCountries from '@/src/useCountries'
import { ImCancelCircle } from 'react-icons/im';

interface Props{
  filtersCountries:string[];
  setFiltersCountries: Dispatch<SetStateAction<string[]>>;
  filtersRegions:FiltersRegionsType;
  setFiltersRegions: Dispatch<SetStateAction<FiltersRegionsType>>;
}
export interface FiltersRegionsType {
  Asia:boolean;
  Europe:boolean;
  ['Latin America and the Caribbean']:boolean;
  ['Middle East and North Africa']:boolean;
  ['Northern America']:boolean;
  Oceania:boolean;
  ['Sub-Saharan Africa']:boolean;
} 

const FilterEngineCountries:React.FC<Props> = ({filtersCountries,setFiltersCountries,filtersRegions,setFiltersRegions})=>{
    const { t } = useTranslation('searchEngine');

    const [fc,setFC]=useState<string[]>(filtersCountries)
    const [fr,setFR]=useState<FiltersRegionsType>(filtersRegions)

    const handlerComboxesChangeRegions = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const parentCode = q;
      const rch = {...fr, [`${parentCode}`]: e.target.checked};
      setFR(rch)
      const countriesByRegion = countriesAll.filter(c=>c.parentCode == parentCode).map(i=>i.code)

      if(e.target.checked){
        setFC(res=>[...res,...countriesByRegion]);
      }
      else{
        const countries = fc.filter(c=>!countriesByRegion.includes(c))
        setFC(countries);

      }
    };
  
    const {data} = useCountries()
    const [countriesAll,setCountriesAll] = useState<{code:string,label:string,parentCode:string}[]>([]);
    useEffect(()=>{
      if(data)setCountriesAll(data.map((d:Country)=>({code:d.code,label:d.code,parentCode:d.parent!.code})))
    },[data])
    
    const getPopoverGeography = () => {
      return <Popover data-cy='popover-geography' className="position-absolute top-0">
        <Popover.Body>
              <div>
                <Form.Label>
                        <strong>{t('Regions')}</strong>
                </Form.Label>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Asia')} `}
                    checked={fr.Asia}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Asia')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Europe')} `}
                    checked={fr.Europe}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Europe')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Latin America and the Caribbean')} `}
                    checked={fr['Latin America and the Caribbean']}
                    data-cy="check-laac"
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Latin America and the Caribbean')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Middle East and North Africa')} `}
                    checked={fr['Middle East and North Africa']}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Middle East and North Africa')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Northern America')} `}
                    checked={fr['Northern America']}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Northern America')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Oceania')}`}
                    checked={fr.Oceania}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Oceania')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Sub-Saharan Africa')}`}
                    checked={fr['Sub-Saharan Africa']}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Sub-Saharan Africa')}
                  />
                </Form.Group>

              </div>
              <div>
                <Form.Label>
                  <strong>{t('Countries')}</strong>
                </Form.Label>
                <TagsInputTypeAhead
                  data={countriesAll}
                  items={fc}
                  setItems={setFC}
                  max={50}
                  labelKey={(res) => `${t(`countries:${res.code}`)}`}
                />

              </div>
              <div className="d-flex justify-content-end">
               <ButtonGroup  className="py-3">
                <Button
                variant="warning"
                onClick={()=>{setFC([])}}
                className="text-white"
                >
                <ImCancelCircle />
              </Button>  
              <Button className="btn-eureka" onClick={()=>{
                setFiltersCountries(fc)
                setFiltersRegions(fr)
                }}>{t('common:select')}
              </Button>
              </ButtonGroup>
              </div>
        </Popover.Body>
      </Popover>
    };

    // return <>
    //     <Button className="ms-3" variant="light" onClick={
    //       ()=>{
    //         show(getPopoverGeography(),'ver asd')
    //       }
    //     }>{t('Geography')}</Button>

    // </>
    return <OverlayTrigger trigger="click" placement="bottom" overlay={getPopoverGeography()}>
        <Button className="ms-3" data-cy="btn-filters-geography" variant="light">{t('Geography')}</Button>
      </OverlayTrigger>

  }
  export default FilterEngineCountries;