import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { COUNTRIES, CountryType } from '../constants';


const useAutocompleteCountries = ()=>{
    const [value,setvalue] = React.useState<CountryType[]>();
    const [hasChanged,sethasChanged] = React.useState(false);
    
    function AutocompleteCountries() {
        return (
            <Autocomplete
                id="country-select-autocomplete"
                options={COUNTRIES}
                autoHighlight
                multiple={true}
                getOptionLabel={(option) => option.label}
                groupBy={(option) => option.parentCode}
                renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option.flag.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option.flag.toLowerCase()}.png`}
                    alt=""
                    />
                    {option.label} ({option.flag}) +{option.phone}
                </Box>
                )}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label=""
                    inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                />
                )}
                value={value}
                onChange={
                    (event, newValue) => {
                        setvalue(newValue as CountryType[]);
                        sethasChanged(true)
                    }
                }
            />
        );
    }
    return {AutocompleteCountries,value,hasChanged}
}

export default useAutocompleteCountries;