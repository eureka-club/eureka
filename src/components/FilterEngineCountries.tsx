import React, { useState,ChangeEvent, useEffect,Dispatch,SetStateAction  } from "react"
import styles from './FilterEngine.module.css';
import { Country } from "../types";
import useTranslation from 'next-translate/useTranslation';

// import { Form, OverlayTrigger, Popover} from 'react-bootstrap';
import TagsInputTypeAhead from './forms/controls/TagsInputTypeAhead';
import useCountries from '@/src/useCountries'
import { ImCancelCircle } from 'react-icons/im';
import { Box, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
import { OverlayTrigger, Popover } from "react-bootstrap";

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
              
              <Stack alignItems={'center'}>
                <Typography variant="body1" fontWeight={'bold'}>{t('Regions')}</Typography>
                <FormGroup>
                  <FormControlLabel label={`${t('countries:Asia')} `} control={
                    <Checkbox checked={fr.Asia} onChange={(e) => handlerComboxesChangeRegions(e, 'Asia')}/>
                  }/>
                  <FormControlLabel label={`${t('countries:Europe')} `} control={
                    <Checkbox checked={fr.Europe} onChange={(e) => handlerComboxesChangeRegions(e, 'Europe')}/>
                  }/>
                  <FormControlLabel label={`${t('countries:Latin America and the Caribbean')} `} control={
                    <Checkbox
                      checked={fr['Latin America and the Caribbean']}
                      data-cy="check-laac"
                      onChange={(e) => handlerComboxesChangeRegions(e, 'Latin America and the Caribbean')}
                    />
                  }/>
                  <FormControlLabel label={`${t('countries:Middle East and North Africa')} `} control={
                    <Checkbox
                      checked={fr['Middle East and North Africa']}
                      onChange={(e) => handlerComboxesChangeRegions(e, 'Middle East and North Africa')}
                    />
                  }/>
                  <FormControlLabel label={`${t('countries:Northern America')} `} control={
                    <Checkbox
                      checked={fr['Northern America']}
                      onChange={(e) => handlerComboxesChangeRegions(e, 'Northern America')}
                    />
                  }/>
                  <FormControlLabel label={`${t('countries:Oceania')}`} control={
                    <Checkbox
                      checked={fr.Oceania}
                      onChange={(e) => handlerComboxesChangeRegions(e, 'Oceania')}
                    />
                  }/>
                  <FormControlLabel label={`${t('countries:Sub-Saharan Africa')}`} control={
                    <Checkbox
                      checked={fr['Sub-Saharan Africa']}
                      onChange={(e) => handlerComboxesChangeRegions(e, 'Sub-Saharan Africa')}
                    />
                  }/>
                </FormGroup>
                <Typography display={'block'} variant="body1">{t('Countries')}</Typography>
                <TagsInputTypeAhead
                  data={countriesAll}
                  items={fc}
                  setItems={setFC}
                  max={50}
                  labelKey={(res) => `${t(`countries:${res.code}`)}`}
                />
                <ButtonGroup variant="contained">
                  <Button
                  color="warning"
                  onClick={()=>{setFC([])}}
                  >
                  <ImCancelCircle />
                </Button>  
                <Button color='primary' onClick={()=>{
                  setFiltersCountries(fc)
                  setFiltersRegions(fr)
                  }}>{t('common:select')}
                </Button>
                </ButtonGroup>
              </Stack>
        </Popover.Body>
      </Popover>
    };

    return <OverlayTrigger trigger="click" placement="bottom" overlay={getPopoverGeography()}>
        <Button data-cy="btn-filters-geography" color="primary">{t('Geography')}</Button>
      </OverlayTrigger>

  }
  export default FilterEngineCountries;