import React, { useState,ChangeEvent, useEffect,Dispatch,SetStateAction  } from "react"
import styles from './FilterEngine.module.css';
import { Country } from "../types";

import { Form, OverlayTrigger, Popover, Button,ButtonGroup} from 'react-bootstrap';
import TagsInputTypeAhead from './forms/controls/TagsInputTypeAhead';
import useCountries from '@/src/hooks/useCountries'
import { ImCancelCircle } from 'react-icons/im';
import { t } from "../get-dictionary";
import { useDictContext } from "../hooks/useDictContext";
import { Option } from "react-bootstrap-typeahead/types/types";
import useAutocompleteCountries from "../hooks/useAutocompleteCountries";

interface Props{
  filtersCountries:Option[];
  setFiltersCountries: Dispatch<SetStateAction<Option[]>>;
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

    const [fc,setFC]=useState<Option[]>(filtersCountries)
    const [fr,setFR]=useState<FiltersRegionsType>(filtersRegions)
    const {dict}=useDictContext()
    const handlerComboxesChangeRegions = (e: ChangeEvent<HTMLInputElement>, q: string) => {
      const parentCode = q;
      const rch = {...fr, [`${parentCode}`]: e.target.checked};
      setFR(rch)
      const countriesByRegion = countriesAll.filter(c=>c.parentCode == parentCode).map(i=>i.code)

      if(e.target.checked){
        setFC(res=>[...res,...countriesByRegion]);
      }
      else{
        const countries = fc.filter(c=>!countriesByRegion.includes(c.toString()))
        setFC(countries);

      }
    };
  
    const {data} = useCountries()
    const [countriesAll,setCountriesAll] = useState<{code:string,label:string,parentCode:string}[]>([]);
    useEffect(()=>{
      if(data)setCountriesAll(data.map((d:Country)=>({code:d.code,label:d.code,parentCode:d.parent!.code})))
    },[data])

    const {AutocompleteCountries,value:countriesSelected,hasChanged} = useAutocompleteCountries()
    
    useEffect(()=>{
      if(hasChanged && countriesSelected){
        const a:Option[] = countriesSelected.map(c=>({code:c.code}));
        setFC(a);
        console.log("countriesSelected",countriesSelected)
      }
    },[hasChanged])
    
    
    const getPopoverGeography = () => {
      return <Popover data-cy='popover-geography' className="position-absolute top-0">
        <Popover.Body>
              <div>
                <Form.Label>
                        <strong>{t(dict,'Regions')}</strong>
                </Form.Label>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t(dict,'Asia')} `}
                    checked={fr.Asia}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Asia')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t(dict,'Europe')} `}
                    checked={fr.Europe}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Europe')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t(dict,'Latin America and the Caribbean')} `}
                    checked={fr['Latin America and the Caribbean']}
                    data-cy="check-laac"
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Latin America and the Caribbean')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t(dict,'Middle East and North Africa')} `}
                    checked={fr['Middle East and North Africa']}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Middle East and North Africa')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t(dict,'Northern America')} `}
                    checked={fr['Northern America']}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Northern America')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t(dict,'Oceania')}`}
                    checked={fr.Oceania}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Oceania')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t(dict,'Sub-Saharan Africa')}`}
                    checked={fr['Sub-Saharan Africa']}
                    onChange={(e) => handlerComboxesChangeRegions(e, 'Sub-Saharan Africa')}
                  />
                </Form.Group>

              </div>
              <div>
                <Form.Label>
                  <strong>{t(dict,'Countries')}</strong>
                </Form.Label>
                {/* <TagsInputTypeAhead
                  data={countriesAll}
                  items={fc}
                  setItems={(o)=>{
                    setFC(o)
                  }}
                  max={50}
                  labelKey={(res) => {
                    return `${t(dict,`${(res as {code:string}).code}`)}`;
                  }}
                /> */}
                <AutocompleteCountries/>
                
              </div>
              <div className="d-flex justify-content-end">
               <ButtonGroup  className="py-3">
                <Button
                variant="warning"
                onClick={()=>{
                  setFC([])
                  setFiltersCountries([])
                }}
                className="text-white"
                >
                <ImCancelCircle />
              </Button>  
              <Button className="btn-eureka" onClick={()=>{
                setFiltersCountries(fc)
                setFiltersRegions(fr)
                }}>{t(dict,'select')}
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
        <Button className="ms-3" data-cy="btn-filters-geography" variant="light">{t(dict,'Geography')}</Button>
      </OverlayTrigger>

  }
  export default FilterEngineCountries;