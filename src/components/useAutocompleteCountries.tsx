import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useTranslation from 'next-translate/useTranslation';
import useCountries from '../useCountries';
import { useAutocomplete } from '@mui/material';

interface Opt{
    code: string;
    label: string;
    parent:{code:string}
}
export default function useAutocompleteCountries(){
    const [value,setvalue]=React.useState<{code:string,label:string}[]>()
    const [countries,setcountries]=React.useState<string[]>();
    
    function AutocompleteCountries() {
        // const{onChange}=props;
        const { t } = useTranslation('searchEngine');
        const{data:countries}=useCountries();console.log(countries)
        return (
            <Autocomplete
            multiple
            value={value}
            onChange={(e,v) => {
              setvalue(v);
              setcountries(v.map(i=>i.code));
            }}
            id="controllable-states-demo"
            options={countries??[]}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={t('Geography')} />}
          />
            // <Autocomplete
            //     sx={{width:'300px'}}
            //     id="AutocompleteCountries"
            //     options={countries!}
            //     onChange={(e,v)=>{
            //         onChange(e,v!);debugger;
            //         setvalue(()=>v!)
            //     }}
            //     value={value}
    
            //     getOptionLabel={(option) => option.label}
            //     renderInput={(params) => (
            //         <TextField
            //         {...params}
            //         variant="standard"
            //         placeholder={t('Geography')}
            //     />
            //     )}
            // />
        );
    }
    return {AutocompleteCountries,countries}
}
