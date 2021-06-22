// import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import { setCookie } from 'nookies';
import { FunctionComponent, ChangeEvent, useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';

import { AiOutlineSearch } from 'react-icons/ai';
import Fuse from 'fuse.js';
import TagsInput from './forms/controls/TagsInput';
import TagsInputTypeAhead from './forms/controls/TagsInputTypeAhead';

import CycleTypeaheadSearchItem from './cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from './work/TypeaheadSearchItem';
import PopoverContainer from './PopoverContainer';
import useCountries from '../useCountries';

// import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import { Session, SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../types';

import globalSearchEngineAtom from '../atoms/searchEngine';
import styles from './FilterEngine.module.css';

const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const SearchEngine: FunctionComponent = () => {
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [session] = useSession() as [Session | null | undefined, boolean];
  const router = useRouter();
  const { t } = useTranslation('searchEngine');
  const [tags, setTags] = useState<string>('');
  // const [onlyByCountries] = useState<string[]>([]);
  // const [countryQuery, setCountryQuery] = useState<string[] | undefined>([]);

  const handlerComboxesChangeType = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    let { only } = globalSearchEngineState;
    const types = type.split('|');
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
    setTags('');
  };

  // useEffect(() => {
  //   setGlobalSearchEngineState({
  //     ...globalSearchEngineState,
  //     ...{ onlyByCountries: [...(globalSearchEngineState.onlyByCountries || []), ...onlyByCountries] },
  //   });
  // }, [onlyByCountries]);

  return (
    <Container className={styles.container}>
      <Row>
        <Col md={8}>
          <Form.Group className={styles.formGroup}>
            <Form.Check
              className={styles.filter}
              inline
              type="checkbox"
              label={t('Cycles')}
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
              onChange={(e) => handlerComboxesChangeType(e, 'movie')}
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
        <Col md={4}>
          <PopoverContainer title={t('Fiction/nonfiction')} className={styles.popover}>
            <Form.Label>
              <strong>{t('Books')}</strong>
            </Form.Label>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label="Fiction books"
                onChange={(e) => handlerComboxesChangeType(e, 'fiction-book')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label="Nofictions books"
                onChange={(e) => handlerComboxesChangeType(e, 'book')}
              />
            </Form.Group>
            <Form.Label>
              <strong>{t('Films')}</strong>
            </Form.Label>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label="Movies"
                onChange={(e) => handlerComboxesChangeType(e, 'movie')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label="Documentary"
                onChange={(e) => handlerComboxesChangeType(e, 'documentary')}
              />
            </Form.Group>
          </PopoverContainer>

          <PopoverContainer title={`${t('Geography')}`} className={styles.popover}>
            <Form.Label>
              <strong>{t('Regions')}</strong>
            </Form.Label>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label={`${t('countries:Asia')} `}
                onChange={(e) => handlerComboxesChangeRegion(e, 'Asia')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label={`${t('countries:Europe')} `}
                onChange={(e) => handlerComboxesChangeRegion(e, 'Europe')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label={`${t('countries:Latin America and the Caribbean')} `}
                onChange={(e) => handlerComboxesChangeRegion(e, 'Latin America and the Caribbean')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label={`${t('countries:Middle East and North Africa')} `}
                onChange={(e) => handlerComboxesChangeRegion(e, 'Middle East and North Africa')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label={`${t('countries:Northern America')} `}
                onChange={(e) => handlerComboxesChangeRegion(e, 'Northern America')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label={`${t('countries:Oceania')}`}
                onChange={(e) => handlerComboxesChangeRegion(e, 'Oceania')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                className={styles.filter}
                type="checkbox"
                label={`${t('countries:Sub-Saharan Africa')}`}
                onChange={(e) => handlerComboxesChangeRegion(e, 'Sub-Saharan Africa')}
              />
            </Form.Group>

            <Form.Label>
              <strong>{t('Countries')}</strong>
            </Form.Label>
            <TagsInputTypeAhead tags={tags} setTags={setTags} />
          </PopoverContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchEngine;
