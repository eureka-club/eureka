import { FunctionComponent, useState, useEffect, useRef } from 'react';
// import FormControl from 'react-bootstrap/FormControl';
import { Form, Badge, InputGroup } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { Typeahead } from 'react-bootstrap-typeahead';
import { AiOutlineSearch } from 'react-icons/ai';
import { useAtom } from 'jotai';

// import { SearchResult } from '../../../types';
// import useCountries from '../../../useCountries';
import styles from './TagsInputTypeAhead.module.css';
// import globalSearchEngineAtom from '../../../atoms/searchEngine';

export type TagsInputProp = {
  // tags: string;
  // setTags?: (value: string) => void;
  label?: string;
  labelKey?: (res: { code: string }) => string;
  readOnly?: boolean | null;
  data: { code: string; label: string }[];
  items: string[];
  setItems: (value: string[]) => void;
  max?: number;
  onTagCreated?: (e: { code: string; label: string }) => void;
  onTagDeleted?: (code: string) => void;
};

const TagsInputTypeAhead: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { data, max = 5, onTagCreated, onTagDeleted, labelKey } = props;
  const { t } = useTranslation('createWorkForm');
  // const { tags, setTags, label = '', readOnly = false } = props;
  const { items, setItems, label = '', readOnly = false } = props;
  const ref = useRef<Typeahead<{ code: string; label: string }>>(null);
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

  const onNewTagAdded = (e: { code: string; label: string }[]) => {
    if (e.length) {
      items.push(e[0].code);
      setItems([...new Set(items)]);
      // const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
      // setGlobalSearchEngineState({
      //   ...globalSearchEngineState,
      //   ...{ onlyByCountries },
      // });
      // if (setTags) setTags(items.join(','));
      ref.current!.clear();
      if (onTagCreated) onTagCreated(e[0]);
    }
  };

  const deleteTag = (idx: number): void => {
    const code = items.splice(idx, 1)[0];
    setItems([...new Set(items)]);
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

  return (
    <Form.Group controlId="tags">
      {label && <Form.Label>{label}</Form.Label>}
      <div>
        {items.map((v, idx) => {
          return (
            <span key={`${idx + 1}${t}`}>
              <Badge variant="info">
                {v}{' '}
                {!readOnly && (
                  <Badge style={{ cursor: 'pointer' }} onClick={() => deleteTag(idx)} pill variant="secondary">
                    X
                  </Badge>
                )}
              </Badge>{' '}
            </span>
          );
        })}
        {!readOnly && items.length < max && data && data.length && (
          <InputGroup>
            <Typeahead
              ref={ref}
              id="TagsInputTypeAhead"
              filterBy={['label']}
              labelKey={(res: { code: string }) => (labelKey ? labelKey(res) : `${t(`${res.code}`)}`)}
              onChange={onNewTagAdded}
              // onKeyPress={onKeyPressOnInput}
              options={data}
              className={styles.textInput}
            />
            <InputGroup.Append className={styles.searchButton}>
              {/* <Button
              onClick={() => { }}
                variant="outline-secondary"> */}
              <AiOutlineSearch onClick={() => ({})} />
              {/* </Button> */}
            </InputGroup.Append>
          </InputGroup>
        )}
      </div>
    </Form.Group>
  );
};

export default TagsInputTypeAhead;
