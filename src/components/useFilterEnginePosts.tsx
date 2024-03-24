import React from "react"
// import useTranslation from 'next-translate/useTranslation';
import useAutocompleteRegions from "./useAutocompleteRegions"

const useFilterEnginePosts = ()=>{
  // const { t } = useTranslation('searchEngine');
    const{AutocompleteRegions,countries:filtersCountries}=useAutocompleteRegions();
    console.log('filtersCountries ',filtersCountries)
    
    const FilterEnginePosts: React.FC = ()=>{
    return <section className="d-flex flex-row align-items-center justify-content-end my-2">
    <div className="my-3">
      <AutocompleteRegions/>
    </div>
    </section>
  }
  return {FilterEnginePosts,filtersCountries};
}
export default useFilterEnginePosts