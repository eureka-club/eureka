import { FunctionComponent, useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
// import FormControl from 'react-bootstrap/FormControl';
import { Form, Badge, InputGroup } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { Typeahead } from 'react-bootstrap-typeahead';
import { AiOutlineSearch } from 'react-icons/ai';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { SearchResult } from '../../../types';
import useCountries from '../../../useCountries';
import styles from './TagsInputTypeAhead.module.css';
import globalSearchEngineAtom from '../../../atoms/searchEngine';

export type TagsInputProp = {
  tags: string;
  setTags?: (value: string) => void;
  label?: string;
  readOnly?: boolean | null;
};

const TagsInputTypeAhead: FunctionComponent<TagsInputProp> = (props: TagsInputProp) => {
  const { t } = useTranslation('createWorkForm');
  const { tags, setTags, label = '', readOnly = false } = props;
  const ref = useRef<Typeahead<{ code: string; label: string }>>(null);
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const fetchCountries = async () => {
    const res = await fetch(`/api/taxonomy/countries`);
    const { result = [] } = await res.json();
    const codes = result.map((i: { code: string; label: string }) => ({
      code: i.code,
      label: t(`countries:${i.code}`),
    }));
    return codes;
  };

  const { data: countries } = useQuery('COUNTRIESALL', fetchCountries, {
    staleTime: 1000 * 60 * 60,
  });

  // const [tagInput, setTagInput] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);
  // const [isSearchLoading, setIsSearchLoading] = useState(false);

  useEffect(() => {
    if (tags) setItems(tags.split(','));
    if (!tags) setItems([]);
  }, [tags]);

  // const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
  //   setTagInput(e.currentTarget.value);
  // };

  const onNewTagAdded = (e: { code: string; label: string }[]) => {
    if (e.length) {
      items.push(e[0].code);
      setItems([...new Set(items)]);
      const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
      setGlobalSearchEngineState({
        ...globalSearchEngineState,
        ...{ onlyByCountries },
      });
      if (setTags) setTags(items.join());
      ref.current!.clear();
    }
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

  const deleteTag = (idx: number): void => {
    const code = items.splice(idx, 1)[0];
    setItems([...new Set(items)]);
    const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
    const idxOBC = onlyByCountries.findIndex((i: string) => i === code);
    onlyByCountries.splice(idxOBC, 1);
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      ...{ onlyByCountries },
    });
    if (setTags) setTags(items.join());
  };

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
        {!readOnly && items.length < 5 && countries && countries.length && (
          <InputGroup>
            <Typeahead
              ref={ref}
              id="TagsInputTypeAhead"
              filterBy={['label']}
              labelKey={(res: { label: string }) => `${res.label}`}
              onChange={onNewTagAdded}
              // onKeyPress={onKeyPressOnInput}
              options={countries}
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
