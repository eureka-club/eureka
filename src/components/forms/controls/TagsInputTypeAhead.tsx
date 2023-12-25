import { FunctionComponent, /* useState, useEffect, */ createRef, Dispatch, SetStateAction } from 'react';
// import FormControl from 'react-bootstrap/FormControl';
import { Form, Badge, InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import TypeaheadType from 'react-bootstrap-typeahead/types/core/Typeahead';
import {Option} from 'react-bootstrap-typeahead/types/types';
// import { AiOutlineSearch } from 'react-icons/ai';
// import { useAtom } from 'jotai';

// import { SearchResult } from '../../../types';
// import useCountries from '../../../useCountries';
import styles from './TagsInputTypeAhead.module.css';
import { t } from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';
// import globalSearchEngineAtom from '../../../atoms/searchEngine';

export type TagsInputProp = {
  // tags: string;
  // setTags?: (value: string) => void;
  label?: string;
  labelKey?: (o:Option)=>string;
  readOnly?: boolean | null;
  data: Option[];
  items: Option[];
  setItems: Dispatch<SetStateAction<Option[]>>;
  max?: number;
  onTagCreated?: (e: Option) => void;
  onTagDeleted?: (code: Option) => void;
  placeholder?: string;
  style?: { [key: string]: string };
  className?: string;
  formatValue?: (o:Option) => React.ReactNode;
};

const TagsInputTypeAhead: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { data, max = 5, onTagCreated, onTagDeleted, labelKey, placeholder, style, className,formatValue  } = props;
  const {dict}=useDictContext()
  // const { t } = useTranslation('createWorkForm');
  // const { tags, setTags, label = '', readOnly = false } = props;
  const { items, setItems, label = '', readOnly = false } = props;
  const ref = createRef<TypeaheadType>();
  // const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);

  // const [tagInput, setTagInput] = useState<string>('');
  // const [, setItems] = useState<string[]>([]);
  // const [isSearchLoading, setIsSearchLoading] = useState(false);

  // useEffect(() => {
  //   if (tags) setItems(tags.split(','));
  //   if (!tags) setItems([]);
  // }, [tags]);

  // const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
  //   setTagInput(e.currentTarget.value);
  // };

  const onNewTagAdded = (e:Option[]) => {
    if (e.length) {
      items.push(e[0]);
      setItems([...Array.from(new Set(items))]);
      // const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
      // setGlobalSearchEngineState({
      //   ...globalSearchEngineState,
      //   ...{ onlyByCountries },
      // });
      // if (setTags) setTags(items.join(','));
      if (ref.current) ref.current.clear();
      if (onTagCreated) onTagCreated(e[0]);
    }
  };

  const deleteTag = (e:React.MouseEvent<HTMLElement>,idx: number): void => {
    e.preventDefault()
    e.stopPropagation()
    const code = items.splice(idx, 1)[0];
    setItems([...Array.from(new Set(items))]);
    // const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
    // const idxOBC = onlyByCountries.findIndex((i: string) => i === code);
    // onlyByCountries.splice(idxOBC, 1);
    // setGlobalSearchEngineState({
    //   ...globalSearchEngineState,
    //   ...{ onlyByCountries },
    // });
    // if (setTags) setTags(items.join(','));
    if (onTagDeleted) onTagDeleted(code);
  };

  // useEffect(() => {
  //   const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
  //   setGlobalSearchEngineState({
  //     ...globalSearchEngineState,
  //     ...{ onlyByCountries },
  //   });
  // }, [globalSearchEngineState, items]);
  // const onKeyPressOnInput = (e: KeyboardEvent) => {
  //   e.preventDefault();
  //   if (['Enter', 'Comma'].includes(e.code)) {
  //     (e.currentTarget as HTMLInputElement).value = '';
  //   }
  // };

  // const handleSearchWorkOrCycle = async (query: string) => {
  //   setIsSearchWorkOrCycleLoading(true);
  //   setGlobalSearchEngineState({ ...globalSearchEngineState, q: query });

  //   const responseWork = await (await fetch(`/api/work/?q=${query}`)).json();
  //   const responseCycle = await (await fetch(`/api/cycle/?q=${query}`)).json();

  //   const items: SearchResult[] = [
  //     ...((responseWork && responseWork.data) || []),
  //     ...((responseCycle && responseCycle.data) || []).map((i: CycleMosaicItem & { type: string }) => ({
  //       ...i,
  //       type: 'cycle',
  //     })),
  //   ];

  //   setSearchWorkOrCycleResults(items);
  //   setIsSearchWorkOrCycleLoading(false);
  // };

  const renderItems = ()=>{
    return items.length 
    ? items.map((v, idx) => {
      return (
        <span key={`${idx + 1}$q{t}`}>
          <Badge 
          className="fw-light fs-6 cursor-pointer"
          pill
          bg="secondary px-2 py-1 mb-1 me-1"
          >
            {formatValue ? formatValue(v) : <>{v}</>}{' '}
            {!readOnly && (
              <Badge className="bg-warning text-withe rounded-pill ms-2" style={{ cursor: 'pointer' }} onClick={(e) => deleteTag(e,idx)} pill bg="default">
                X
              </Badge>
            )}
          </Badge>{' '}
        </span>
      );
    })
    : <></>
  }
  const renderInput = ()=>{

    if(!readOnly && items.length < max && data && data.length){
      return <InputGroup style={style}>
      <Typeahead
        ref={ref}
        id="TagsInputTypeAhead"
        filterBy={['label']}
        labelKey={(res: Option) => (labelKey ? labelKey(res) : `${t(dict,`${(res as {code:string}).code}`)}`)}
        onChange={onNewTagAdded}
        // onKeyPress={onKeyPressOnInput}
        options={data}
        className={'w-100'}
        placeholder={placeholder}
      />
    </InputGroup>
    }
     return <></> 
  }
  return (
    <Form.Group controlId="tags" className={`${className}`}>
      {label && <Form.Label>{label}</Form.Label>}
      <div>
        {renderItems()}
        {renderInput()}
      </div>
    </Form.Group>
  );
};

export default TagsInputTypeAhead;
