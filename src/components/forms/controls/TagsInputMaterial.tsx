import { FunctionComponent, useState, useEffect, ChangeEvent, KeyboardEvent,useRef, SyntheticEvent } from 'react';
import { Form, InputGroup,Button, Badge, Spinner,Col } from 'react-bootstrap';
 
import { useAtom } from 'jotai'; 
import { useRouter } from 'next/navigation';
import searchEngine from '@/src/atoms/searchEngine';
import { BiPlus} from 'react-icons/bi';
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';
import { TextField,Chip } from '@mui/material';
import { useDictContext } from '@/src/hooks/useDictContext';

export type TagsInputProp = {
  tags: string;
  setTags?: (value: string) => void;
  label?: string;
  readOnly?: boolean | null;
  br?: boolean | null;
  max?: number;
  className?: string;
  formatValue?: (v: string) => string;
};
const TagsInputMaterial: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { t, dict } = useDictContext();
  const formRef=useRef<HTMLFormElement>(null)
  const { tags, setTags, label = '', readOnly = false,br = false, max = 2, className, formatValue = undefined } = props;
  const [loading, setLoading] = useState<Record<string,boolean>>({});
  //const [tagInput, setTagInput] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);
  const router = useRouter();
  const [, setSearchEngineState] = useAtom(searchEngine);

  useEffect(() => {
    if (tags && tags.length) setItems(tags.split(','));
    else
    setItems([]);
  }, [tags]);

 const onTagsUpdate = (event: SyntheticEvent<Element, Event>, value: string[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string> | undefined) => {
          if (value && value.length <= max) {
             if (setTags) setTags(value.join());
       }
  };

 /* const onKeyPressOnInput = (e: KeyboardEvent) => {

    if (['Enter', 'Comma'].includes(e.code)) {
      e.preventDefault();
      if (items.length) {
        if (max > items.length) {
          console.log(items,'items-onKeyPressOnInput')
          if (setTags) setTags(items.join());
        }
      }
        }
  };*/

   const addTag= (e:React.MouseEvent<HTMLButtonElement>)=>{
    const form = formRef.current;
    if(form && form.tag.value) {
      if (max > items.length) {
          items.push(form.tag.value);
          setItems([...items]);
          if (setTags) setTags(items.join());
        }
        form.tag.value = "";
    }
  }


  return ( 
        <Autocomplete
        multiple
         id="tags-standard"
        size="small" 
        options={[]}
        freeSolo   
        value={items}    
        onChange={onTagsUpdate}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small" 
            label={label}
            placeholder=""
            helperText={t(dict,'tagsInputPlaceholder')} 
          />
        )}
      />
  );
};

export default TagsInputMaterial;
