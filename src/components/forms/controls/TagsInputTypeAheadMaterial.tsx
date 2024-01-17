import { FunctionComponent, useState ,useEffect, useRef, Dispatch, SetStateAction, SyntheticEvent } from 'react';

import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';
import { TextField } from '@mui/material';

export type TagsInputProp = {
  // tags: string;
  // setTags?: (value: string) => void;
  label?: string;
  //labelKey?: (res: { code: string }) => string;
  readOnly?: boolean | undefined;
  data: { code: string; label: string }[];
  items: string[];
  setItems?: (value: string[]) => void; //Dispatch<SetStateAction<string[]>>;
  max?: number;
 // onTagCreated?: (e: { code: string; label: string }) => void;
//  onTagDeleted?: (code: string) => void;
  placeholder?: string;
  style?: { [key: string]: string };
  className?: string;
  formatValue?: (v: string) => string;

};

const TagsInputTypeAheadMaterial: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { data, max = 5,  placeholder, style, className,formatValue = undefined  } = props;
  const {items, setItems, label = '', readOnly = false } = props;
  const [value, setValue] = useState<{code: string, label: string}[]>([]);


   useEffect(() => {
    let value =[];
    if(data && items.length){
      
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
      //setItems([...new Set(value.map(v => v.code))]);
      if (setItems) setItems(value.map(v => v.code));

    }

  }


  return (<>
  <Autocomplete
        multiple
        id="tags-standard"
        size="small" 
        onChange={onTagsUpdate}
        options={data || []}
        readOnly={readOnly}
        getOptionLabel={(option) => formatValue ? formatValue(option.code) : option.label}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small" 
            label={label}
            placeholder=''
          />
        )}
      />
  </>)

}

export default TagsInputTypeAheadMaterial;
