import { FunctionComponent, useState, useEffect, SyntheticEvent } from 'react';
import { Autocomplete, CircularProgress, AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';
import { TextField } from '@mui/material';
import { SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '@/src/types';
import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import CycleTypeaheadSearchItem from '@/src/components/cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '@/src/components/work/TypeaheadSearchItem';


export type AsyncTypeaheadMaterialProp = {
  item: SearchResult | null;
  searchType: string,
  workSelected?: SearchResult | null; // para buscar solo ciclos donde este la obra
  label?: string;
  helperText?: string;
  onSelected: (value: SearchResult | null) => void;
};

const AsyncTypeaheadMaterial: FunctionComponent<AsyncTypeaheadMaterialProp> = (props: AsyncTypeaheadMaterialProp) => {
  const {/*items,*/item, searchType, workSelected, onSelected, label = '', helperText = ''/*, readOnly = false*/ } = props;
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [value, setValue] = useState<SearchResult | null>(null);
  const [work, setWork] = useState<SearchResult | null>(null);

  const [isSearchLoading, setIsSearchLoading] = useState(false);


  useEffect(() => {
    setValue((item || null));
    if (workSelected)
      setWork(workSelected)
    else if (!workSelected)
      setWork(null)
  }, [item, workSelected])

  //console.log(work, 'work')


  function onTagsUpdate(event: SyntheticEvent<Element, Event>, value: SearchResult | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<SearchResult | null> | undefined) {
    setValue(value);
    onSelected(value);
    setSearchResults([]);
  }

  const handleSearchWorkOrCycle = async (query: string) => {
    if (query.length) {
      setIsSearchLoading(true);
      //const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
      const response = await fetch(`/api/search/works-or-cycles?q=${query}`);//&include=${includeQP}
      const itemsSWC: SearchResult[] = await response.json();
      setSearchResults(itemsSWC);
      setIsSearchLoading(false);
    }
  };

  const handleSearchCycle = async (query: string = "") => {
    if (query.length) {
      let criteria;
      if (work != null) {
        criteria = `where=${JSON.stringify({ title: { contains: query }, works: { some: { id: work.id } } })}`;
        // criteria = `q=${JSON.stringify({
        //   title: { contains: query },
        //   works: { some: { id: work.id } },
        // })}`;
      }
      //const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));

      setIsSearchLoading(true);
      const response = await fetch(`/api/search/cycles?${criteria}`);//&include=${includeQP}
      const itemsCL: CycleMosaicItem[] = await response.json();
      setSearchResults(itemsCL);
      setIsSearchLoading(false);
    }
  };

  if (searchType == 'all')
    return (
      <Autocomplete
        id="typeahead-mui"
        getOptionLabel={option => (isCycleMosaicItem(option) || isWorkMosaicItem(option)) ? `${option.title}` : `${option.id}`}
        size="small"
        loading={isSearchLoading}
        filterOptions={(x) => x}
        options={searchResults}
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No options"
        onChange={onTagsUpdate}
        onInputChange={(event, newInputValue) => {
          handleSearchWorkOrCycle(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} helperText={helperText} fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (<>
                {isSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
            return <li {...props}><WorkTypeaheadSearchItem key={`work-${option.id}`} work={option as WorkMosaicItem} /></li>
          }
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}

      />
    );
  else if (searchType == 'cycles')
    return (
      <Autocomplete
        id="typeahead-mui-only-cycles"
        getOptionLabel={(option) => `${(option as CycleMosaicItem).title}`}
        size="small"
        loading={isSearchLoading}
        filterOptions={(x) => x}
        options={searchResults}
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No options"
        onChange={onTagsUpdate}
        onOpen={(event) => {
          handleSearchCycle();
        }}
        onInputChange={(event, newInputValue) => {
          handleSearchCycle(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} helperText={helperText} fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (<>
                {isSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}</>
              )
            }}
          />
        )}
        renderOption={(props, option) => {
          return <li {...props}>{(option as CycleMosaicItem).title}</li>
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    );
  else
    return (<></>)
}


export default AsyncTypeaheadMaterial;
