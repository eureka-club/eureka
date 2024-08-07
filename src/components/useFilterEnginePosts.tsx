import React from "react"
// import useTranslation from 'next-translate/useTranslation';
import useAutocompleteRegions from "./useAutocompleteRegions"
import { Stack } from "@mui/material";

const useFilterEnginePosts = ()=>{
  // const { t } = useTranslation('searchEngine');
    const{AutocompleteRegions,countries:filtersCountries}=useAutocompleteRegions();
    console.log('filtersCountries ',filtersCountries)
    
    const FilterEnginePosts: React.FC = ()=>{
    return <Stack direction={{sx:'column',sm:'row'}} paddingTop={2} paddingBottom={2} justifyContent={{sx:'center',md:'left'}} alignItems={{sx:'center',md:'left'}}>
      <AutocompleteRegions/>
    </Stack>
  }
  return {FilterEnginePosts,filtersCountries};
}
export default useFilterEnginePosts