// import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
// import { useSession } from 'next-auth/client';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import { setCookie } from 'nookies';
import { FunctionComponent, ChangeEvent, useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
// import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';

// import { AiOutlineSearch } from 'react-icons/ai';
// import Fuse from 'fuse.js';
// import TagsInput from './forms/controls/TagsInput';
import TagsInputTypeAhead from './forms/controls/TagsInputTypeAhead';

// import CycleTypeaheadSearchItem from './cycle/TypeaheadSearchItem';
// import WorkTypeaheadSearchItem from './work/TypeaheadSearchItem';
import PopoverContainer from './PopoverContainer';
// import useCountries from '../useCountries';

// import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
// import { Session, SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../types';

import globalSearchEngineAtom from '../atoms/searchEngine';
import styles from './FilterEngine.module.css';

// const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;
interface Props {
  fictionOrNotFilter?: boolean;
  geographyFilter?: boolean;
  // sortBy?: false;
}
const SearchEngine: FunctionComponent<Props> = ({
  fictionOrNotFilter = true,
  geographyFilter = true,
  // sortBy = false,
}) => {
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [session] = useSession() as [Session | null | undefined, boolean];
  // const router = useRouter();
  const { t } = useTranslation('searchEngine');
  const [tags, setTags] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);
  const [filtersChecked, setFiltersChecked] = useState<Record<string, boolean>>({});
  // const [onlyByCountries] = useState<string[]>([]);
  // const [countryQuery, setCountryQuery] = useState<string[] | undefined>([]);
  useEffect(() => {
    // debugger;
    const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      ...{ onlyByCountries },
    });
  }, [tags]);

  const fetchCountries = async () => {
    const res = await fetch(`/api/taxonomy/countries?q=all`);
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

  const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    let { only } = globalSearchEngineState;
    const types = type.split('|');
    setFiltersChecked({ ...filtersChecked, [`${type}`]: e.target.checked });
    types.forEach((ty: string) => {
      if (only.includes(ty)) only = only.filter((i) => i !== ty);
      else only.push(ty);
    });
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      ...{ only },
    });
  };

  const handlerComboxesChangeRegion = (e: ChangeEvent<HTMLInputElement>, q: string) => {
    setFiltersChecked({ ...filtersChecked, [`${q}`]: e.target.checked });
    if (globalSearchEngineState.countryQuery!.includes(q))
      setGlobalSearchEngineState({
        ...globalSearchEngineState,
        ...{ countryQuery: globalSearchEngineState.countryQuery!.filter((i) => i !== q) },
      });
    else
      setGlobalSearchEngineState({
        ...globalSearchEngineState,
        ...{ countryQuery: [...globalSearchEngineState.countryQuery!, q] },
      });
    // setCountryQuery(globalSearchEngineState.countryQuery);
    setItems([]);
  };

  // useEffect(() => {
  //   setGlobalSearchEngineState({
  //     ...globalSearchEngineState,
  //     ...{ onlyByCountries: [...(globalSearchEngineState.onlyByCountries || []), ...onlyByCountries] },
  //   });
  // }, [onlyByCountries]);

  return (
    (globalSearchEngineState.show && (
      <Container className={styles.container}>
        <Row>
          <Col md={8}>
            <Form.Group className={styles.formGroup}>
              <Form.Check
                className={styles.filter}
                inline
                type="checkbox"
                label={t('Cycles')}
                checked={filtersChecked.cycle}
                onChange={(e) => handlerComboxesChangeType(e, 'cycle')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Check
                className={styles.filter}
                inline
                type="checkbox"
                label={t('Eurekas')}
                onChange={(e) => handlerComboxesChangeType(e, 'post')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Check
                className={styles.filter}
                inline
                type="checkbox"
                label={t('Films')}
                onChange={(e) => handlerComboxesChangeType(e, 'movie|documentary')}
              />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                inline
                type="checkbox"
                label={t('Books')}
                onChange={(e) => handlerComboxesChangeType(e, 'book|fiction-book')}
              />
            </Form.Group>
          </Col>
          <Col md={4} className={styles.lastCol}>
            {fictionOrNotFilter && (
              <PopoverContainer title={t('Fiction/nonfiction')} className={styles.popover}>
                <Form.Label>
                  <strong>{t('Books')}</strong>
                </Form.Label>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={t('Fiction books')}
                    checked={filtersChecked['fiction-book']}
                    onChange={(e) => handlerComboxesChangeType(e, 'fiction-book')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={t('Nofictions books')}
                    checked={filtersChecked.book}
                    onChange={(e) => handlerComboxesChangeType(e, 'book')}
                  />
                </Form.Group>
                <br />
                <Form.Label>
                  <strong>{t('Films')}</strong>
                </Form.Label>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={t('Movies')}
                    checked={filtersChecked.movie}
                    onChange={(e) => handlerComboxesChangeType(e, 'movie')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={t('Documentaries')}
                    checked={filtersChecked.documentary}
                    onChange={(e) => handlerComboxesChangeType(e, 'documentary')}
                  />
                </Form.Group>
              </PopoverContainer>
            )}

            {geographyFilter && (
              <PopoverContainer title={`${t('Geography')}`} className={styles.popover}>
                <Form.Label>
                  <strong>{t('Regions')}</strong>
                </Form.Label>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Asia')} `}
                    checked={filtersChecked.Asia}
                    onChange={(e) => handlerComboxesChangeRegion(e, 'Asia')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Europe')} `}
                    checked={filtersChecked.Europe}
                    onChange={(e) => handlerComboxesChangeRegion(e, 'Europe')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Latin America and the Caribbean')} `}
                    checked={filtersChecked['Latin America and the Caribbean']}
                    onChange={(e) => handlerComboxesChangeRegion(e, 'Latin America and the Caribbean')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Middle East and North Africa')} `}
                    checked={filtersChecked['Middle East and North Africa']}
                    onChange={(e) => handlerComboxesChangeRegion(e, 'Middle East and North Africa')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Northern America')} `}
                    checked={filtersChecked['Northern America']}
                    onChange={(e) => handlerComboxesChangeRegion(e, 'Northern America')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Oceania')}`}
                    checked={filtersChecked.Oceania}
                    onChange={(e) => handlerComboxesChangeRegion(e, 'Oceania')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup} controlId="checkboxes">
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={`${t('countries:Sub-Saharan Africa')}`}
                    checked={filtersChecked['Sub-Saharan Africa']}
                    onChange={(e) => handlerComboxesChangeRegion(e, 'Sub-Saharan Africa')}
                  />
                </Form.Group>
                <br />
                <Form.Label>
                  <strong>{t('Countries')}</strong>
                </Form.Label>
                {/* <TagsInputTypeAhead data={countries} items={items} tags={tags} setTags={setTags} /> */}
                <TagsInputTypeAhead
                  data={countries}
                  items={items}
                  setItems={setItems}
                  max={5}
                  labelKey={(res) => `${t(`countries:${res.code}`)}`}
                  onTagCreated={(e) => {
                    const onlyByCountries = [
                      ...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items]),
                    ];
                    setGlobalSearchEngineState({
                      ...globalSearchEngineState,
                      ...{ onlyByCountries },
                    });
                  }}
                  onTagDeleted={(code) => {
                    const onlyByCountries = [
                      ...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items]),
                    ];
                    const idxOBC = onlyByCountries.findIndex((i: string) => i === code);
                    onlyByCountries.splice(idxOBC, 1);
                    setGlobalSearchEngineState({
                      ...globalSearchEngineState,
                      ...{ onlyByCountries },
                    });
                  }}
                />
              </PopoverContainer>
            )}
          </Col>
        </Row>
      </Container>
    )) ||
    null
  );
};

export default SearchEngine;
