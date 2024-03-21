import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useTranslation from 'next-translate/useTranslation';
import useCountries from '../useCountries';

interface Opt{
    code: string;
    label: string;
    // parent:{code:string,label:string};
}
export default function useAutocompleteRegions(){
    const [value,setvalue]=React.useState<{code:string,label:string,countries:Opt[]}>()
    const [countries,setcountries]=React.useState<string[]>();
    
    function AutocompleteRegions() {
        // const{onChange}=props;
        const { t } = useTranslation('searchEngine');
        const{data:countries}=useCountries();
        
        const regions = React.useMemo(()=>{
          let regionsGrouped:Record<string,{code:string,label:string,countries:Opt[]}>={};
          countries?.reduce((p,c)=>{
            const newC = {code:c.code,label:c.label};
            if(c.parent!.code in p){
                p[c.parent!.code].countries.push(newC)  
            }
            else{
               p[c.parent!.code] = {
                code:c.parent!.code,
                label:c.parent!.label,
                countries:[newC]
              }       
            }
           return p;
          },regionsGrouped);
          return Object.values(regionsGrouped);

        },[countries]);

        return (
            <Autocomplete
            //multiple
            value={value}
            onChange={(e,v) => {
              setvalue(v!);
              setcountries(v?v.countries.map(m=>m.code):[]);
            }}
            options={regions??[]}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={t('Geography')} />}
          />
        );
    }
    return {AutocompleteRegions,countries}
}
