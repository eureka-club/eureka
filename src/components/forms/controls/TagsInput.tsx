import { FunctionComponent, useState, useEffect, ChangeEvent, KeyboardEvent,useRef } from 'react';
import { Form, InputGroup,Button, Badge, Spinner,Col } from 'react-bootstrap';
import { TextField,FormGroup,FormControl,InputLabel,Input,FormHelperText,FormControlLabel} from '@mui/material';
import useTranslation from 'next-translate/useTranslation'; 
import { useAtom } from 'jotai'; 
import { useRouter } from 'next/router';
import searchEngine from '@/src/atoms/searchEngine';
import { BiPlus} from 'react-icons/bi';

export type TagsInputProp = {
  tags: string;
  setTags?: (value: string) => void;
  label?: string;
  readOnly?: boolean | null;
  max?: number;
  className?: string;
  formatValue?: (v: string) => string;
};
const TagsInput: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { t } = useTranslation('createWorkForm');
  const formRef=useRef<HTMLFormElement>(null)
  const { tags, setTags, label = '', readOnly = false, max = 2, className, formatValue = undefined } = props;
  const [loading, setLoading] = useState<Record<string,boolean>>({});
  const [tagInput, setTagInput] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);
  const router = useRouter();
  const [, setSearchEngineState] = useAtom(searchEngine);

  useEffect(() => {
    if (tags && tags.length) setItems(tags.split(','));
    else
    setItems([]);
  }, [tags]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.currentTarget.value);
  };

  const onKeyPressOnInput = (e: KeyboardEvent) => {
    if (['Enter', 'Comma'].includes(e.code)) {
      e.preventDefault();
      if (tagInput) {
        if (max > items.length) {
          items.push(tagInput);
          setItems([...items]);
          if (setTags) setTags(items.join());
        }
      }
      setTagInput('');    }
  };

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

  const deleteTag = (e:React.MouseEvent<HTMLElement>,idx: number): void => {
    e.preventDefault()
    e.stopPropagation()
    items.splice(idx, 1);
    if (setTags) setTags(items.join());
  };
  const handlerBadgeClick = (v: string) => {
    if(loading[v])return;
    setLoading(() => ({[`${v}`]: true}));
    setSearchEngineState((res)=>({...res,itemsFound:[]}))
    router.push(`/search?q=${v}`);    
  };
  return ( 
    <Form.Group controlId="tags" className={`${className}`}>
      {/*label && <Form.Label>{label}</Form.Label>*/}
      <div>
        {items.map((v, idx) => {
          return (
            <span key={`${idx + 1}${t}`} data-cy="tag">
              <Badge
                className="fw-light fs-6 cursor-pointer"
                pill
                bg="secondary px-2 py-1 mb-1 me-1"
                onClick={() => handlerBadgeClick(v)}
              >
                {formatValue ? formatValue(v) : v}{' '}
                {!readOnly && (
                  !loading[v] && <Badge className="bg-warning text-withe rounded-pill ms-2" style={{ cursor: 'pointer' }} onClick={(e) => deleteTag(e,idx)} pill bg="default">
                    X
                  </Badge> || <Spinner size="sm" animation="grow"/>
                )}
                {!readOnly && (loading[v] && <Spinner size="sm" animation="grow"/>)}
              </Badge>{' '}
            </span>
          );
        })}
        {!readOnly && items.length < max && (<>
          <div className='d-none d-lg-block mt-2'>
              <Form.Group controlId="tag" >
                 <TextField  className="w-100" label={label} helperText={t('tagsInputPlaceholder')} 
                 variant="outlined" size="small" value={tagInput} onChange={onChangeInput}
                onKeyPress={onKeyPressOnInput}> </TextField>
              </Form.Group>
              {/*<Form.Control
                type="text"
                placeholder={t('tagsInputPlaceholder')}
                onChange={onChangeInput}
                onKeyPress={onKeyPressOnInput}
              />*/}
          </div>
          <div className='d-block d-lg-none mt-3'>
            <InputGroup className="w-100">
              <Col className='col-11'> 
              <Form ref={formRef} className='me-2 ' >
                <Form.Group controlId='tag' >
                  <FormControl className='w-100'>
                      <TextField  id="tag"  label={label}  variant="outlined" size="small" />
                </FormControl>
                </Form.Group>
              </Form>
              </Col>
              <Col className='col-1 d-flex align-items-center'> 
                 <Button className="w-100 h-100   p-0 text-white"  onClick={addTag} ><BiPlus /></Button>            
            </Col>
            </InputGroup>
          </div>
          </>
        )}
      </div>
    </Form.Group>
  );
};

export default TagsInput;
