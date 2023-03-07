import { FunctionComponent, useState ,useEffect, useRef, Dispatch, SetStateAction, SyntheticEvent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Autocomplete, CircularProgress,AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';
import { TextField } from '@mui/material';
import { SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '@/src/types';
import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import CycleTypeaheadSearchItem from '@/src/components/cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '@/src/components/work/TypeaheadSearchItem';


export type AsyncTypeaheadMaterialProp = {
  // tags: string;
  // setTags?: (value: string) => void;
  label?: string;
  helperText?: string;
  //labelKey?: (res: { code: string }) => string;
  //readOnly?: boolean | undefined;
  //data: { code: string; label: string }[];
  //items: string[];
  onSelected: (value: SearchResult | null) => void;
  // max?: number;
  // onTagCreated?: (e: { code: string; label: string }) => void;
  //  onTagDeleted?: (code: string) => void;
  //placeholder?: string;
  //style?: { [key: string]: string };
  //className?: string;
  //formatValue?: (v: string) => string;

};

  const AsyncTypeaheadMaterial: FunctionComponent<AsyncTypeaheadMaterialProp> = (props: AsyncTypeaheadMaterialProp) => {
    const {/*items,*/ onSelected, label = '',helperText=''/*, readOnly = false*/ } = props;
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [value, setValue] = useState<SearchResult | null>(null);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);

/*
   useEffect(() => {
    let value =[];
    if(data.length && items.length){
      
      for (let i of items){
         let d = data.filter(x => x.code == i ) 
         if(d.length)
           value.push(d[0])

       } 
    }
   setValue(value)
  },[data,items])


  function onTagsUpdate(event: SyntheticEvent<Element, Event>, value: {code: string; label: string;}[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<{
    code: string; label: string;}> | undefined) {
  
    if (value && value.length <= max) {
      setValue(value)
      setItems([...new Set(value.map(v => v.code))]);
    }

  }*/

   function onTagsUpdate(event: SyntheticEvent<Element, Event>, value: SearchResult | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<SearchResult | null> | undefined) {
      
     //setSearchWorkOrCycleResults([]);
     setValue(value);
     onSelected(value);

  }

   const handleSearchWorkOrCycle = async (query: string) => {
        setIsSearchWorkOrCycleLoading(true);
        const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
        const response = await fetch(`/api/search/works-or-cycles?q=${query}&include=${includeQP}`);
        const itemsSWC: SearchResult[] = await response.json();
        setSearchWorkOrCycleResults(itemsSWC);
        setIsSearchWorkOrCycleLoading(false);
  };


 return (
    <Autocomplete
      id="typeahead-mui"
      getOptionLabel={ option => (isCycleMosaicItem(option) || isWorkMosaicItem(option) ) ? `${option.title}` : `${option.id}`}
      size="small" 
      loading={isSearchWorkOrCycleLoading}
      filterOptions={(x) => x}
      options={searchWorkOrCycleResults}
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No options"
      /*onChange={(event: any, newValue: SearchResult | null) => {
        setSearchWorkOrCycleResults([]);
        setValue(newValue);
      }}*/
      onChange={onTagsUpdate}

      onInputChange={(event, newInputValue) => {
        handleSearchWorkOrCycle(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} helperText={helperText}  fullWidth 
           InputProps={{
            ...params.InputProps,
            endAdornment: (<>
                {isSearchWorkOrCycleLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}</>
            )
          }}
        />
      )}
      renderOption={(props, option) => {
              if (isCycleMosaicItem(option)) {
               return <li {...props}><CycleTypeaheadSearchItem key={`cycle-${option.id}`} cycle={option as CycleMosaicItem} /></li>
             }
           if (isWorkMosaicItem(option)) {
              return <li {...props}><WorkTypeaheadSearchItem key={`work-${option.id}`} work={option as WorkMosaicItem}  /></li>
               }
      }}
        isOptionEqualToValue={(option, value) => option.id === value.id}

    />
  );

}

export default AsyncTypeaheadMaterial;
