import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, ChangeEvent, useState, useEffect } from 'react';
import { Container, Row, Col, Form, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import TagsInputTypeAhead from './forms/controls/TagsInputTypeAhead';
import globalSearchEngineAtom from '../atoms/searchEngine';
import styles from './FilterEngine.module.css';
interface Props {
  fictionOrNotFilter?: boolean;
  geographyFilter?: boolean;
  // sortBy?: false;
}
const FilterEngine: FunctionComponent<Props> = ({
  fictionOrNotFilter = true,
  geographyFilter = true,
  // sortBy = false,
}) => {
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const router = useRouter();
  const { t } = useTranslation('searchEngine');
  const [tags /* , setTags */] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);
  const [filtersChecked, setFiltersChecked] = useState<Record<string, boolean>>({
    movie: false,
    documentary: false,
    book: false,
    'fiction-book': false,
  });
  useEffect(() => {
    globalSearchEngineState.only = []
    globalSearchEngineState.onlyByCountries = [];
    setGlobalSearchEngineState({...globalSearchEngineState});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  useEffect(() => {
    const onlyByCountries = [...new Set([...(globalSearchEngineState.onlyByCountries || []), ...items])];
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      ...{ onlyByCountries },
    });
  }, [tags]);

  useEffect(() => {
    if (globalSearchEngineState.only.length) {
      const o: Record<string, boolean> = {};

      const idxbook = globalSearchEngineState.only.findIndex((i) => i === 'book');
      if (idxbook > -1) o.book = true;
      else o.book = false;

      const idxfictionBook = globalSearchEngineState.only.findIndex((i) => i === 'fiction-book');
      if (idxfictionBook > -1) o['fiction-book'] = true;
      else o['fiction-book'] = false;

      const idxmovie = globalSearchEngineState.only.findIndex((i) => i === 'movie');
      if (idxmovie > -1) o.movie = true;
      else o.movie = false;

      const idxdocumentary = globalSearchEngineState.only.findIndex((i) => i === 'documentary');
      if (idxdocumentary > -1) o.documentary = true;
      else o.documentary = false;

      setFiltersChecked((res) => ({
        ...res,
        ...o,
      }));
    }
    // else{
    //   setFiltersChecked((res) => ({
    //     movie: false,
    //     documentary: false,
    //     book: false,
    //     'fiction-book': false,
    //   }));
    // }
  }, [globalSearchEngineState]);

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
    e.stopPropagation();
    const { only } = globalSearchEngineState;

    const types = type.split('|');

    types.forEach((ty: string) => {
      const idx = only.findIndex((i: string) => i === ty);
      if (idx === -1) {
        only.push(ty);
        setFiltersChecked((res) => ({ ...res, [`${ty}`]: true }));
      } else if (!e.target.checked) {
        only.splice(idx, 1);
        setFiltersChecked((res) => ({ ...res, [`${ty}`]: false }));
      }
    });
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      ...{ only },
    });    
  };

  const handlerComboxesChangeRegion = (e: ChangeEvent<HTMLInputElement>, q: string) => {
    const fc = {...filtersChecked, [`${q}`]: e.target.checked};
    setFiltersChecked(fc);
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

  const getPopoverBooks = () => {
    return <Popover id='popover-books'>
      {/* <Popover.Header as="h3">{`Popover books`}</Popover.Header> */}
      <Popover.Body>
      <div>
      <Form.Label>
                  <strong>{t('Books')}</strong>
                </Form.Label>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={t('Fiction books')}
                    checked={filtersChecked['fiction-book']}
                    onChange={(e) => handlerComboxesChangeType(e, 'fiction-book')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
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
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={t('Movies')}
                    checked={filtersChecked.movie}
                    onChange={(e) => handlerComboxesChangeType(e, 'movie')}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Check
                    className={styles.filter}
                    type="checkbox"
                    label={t('Documentaries')}
                    checked={filtersChecked.documentary}
                    onChange={(e) => handlerComboxesChangeType(e, 'documentary')}
                  />
                </Form.Group>
                </div>
      </Popover.Body>
    </Popover>
  };
              
  const getPopoverGeography = () => {
    return <Popover id='popover-geography'>
      <Popover.Body>
      <Form.Label>
                    <strong>{t('Regions')}</strong>
                  </Form.Label>
                  <Form.Group className={styles.formGroup}>
                    <Form.Check
                      className={styles.filter}
                      type="checkbox"
                      label={`${t('countries:Asia')} `}
                      checked={filtersChecked.Asia}
                      onChange={(e) => handlerComboxesChangeRegion(e, 'Asia')}
                    />
                  </Form.Group>
                  <Form.Group className={styles.formGroup}>
                    <Form.Check
                      className={styles.filter}
                      type="checkbox"
                      label={`${t('countries:Europe')} `}
                      checked={filtersChecked.Europe}
                      onChange={(e) => handlerComboxesChangeRegion(e, 'Europe')}
                    />
                  </Form.Group>
                  <Form.Group className={styles.formGroup}>
                    <Form.Check
                      className={styles.filter}
                      type="checkbox"
                      label={`${t('countries:Latin America and the Caribbean')} `}
                      checked={filtersChecked['Latin America and the Caribbean']}
                      onChange={(e) => handlerComboxesChangeRegion(e, 'Latin America and the Caribbean')}
                    />
                  </Form.Group>
                  <Form.Group className={styles.formGroup}>
                    <Form.Check
                      className={styles.filter}
                      type="checkbox"
                      label={`${t('countries:Middle East and North Africa')} `}
                      checked={filtersChecked['Middle East and North Africa']}
                      onChange={(e) => handlerComboxesChangeRegion(e, 'Middle East and North Africa')}
                    />
                  </Form.Group>
                  <Form.Group className={styles.formGroup}>
                    <Form.Check
                      className={styles.filter}
                      type="checkbox"
                      label={`${t('countries:Northern America')} `}
                      checked={filtersChecked['Northern America']}
                      onChange={(e) => handlerComboxesChangeRegion(e, 'Northern America')}
                    />
                  </Form.Group>
                  <Form.Group className={styles.formGroup}>
                    <Form.Check
                      className={styles.filter}
                      type="checkbox"
                      label={`${t('countries:Oceania')}`}
                      checked={filtersChecked.Oceania}
                      onChange={(e) => handlerComboxesChangeRegion(e, 'Oceania')}
                    />
                  </Form.Group>
                  <Form.Group className={styles.formGroup}>
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
                    onTagCreated={() => {
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
      </Popover.Body>
    </Popover>
  };

  return (
    (globalSearchEngineState.show && (
      <Container className={styles.container}>
        <Row className='ms-1'>
          <Col className='d-flex flex-row'>
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
                checked={filtersChecked.movie && filtersChecked.documentary}
                onChange={(e) => handlerComboxesChangeType(e, 'movie|documentary')}
              />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Check
                className={styles.filter}
                inline
                type="checkbox"
                label={t('Books')}
                checked={filtersChecked.book && filtersChecked['fiction-book']}
                onChange={(e) => handlerComboxesChangeType(e, 'book|fiction-book')}
              />
            </Form.Group>
          </Col>
          <Col  as={Row} className="pe-0">
            <aside className="d-flex justify-content-start justify-content-md-end me-0 pe-0">

            {fictionOrNotFilter && (
              <OverlayTrigger rootClose placement="bottom" trigger="click" overlay={getPopoverBooks()}>
                <span className="d-inline-block">
                  <Button variant="light">{t('Fiction/nonfiction')}</Button>
                </span>
              </OverlayTrigger>
            )}

            {geographyFilter && (
              <OverlayTrigger rootClose placement="bottom" trigger="click" overlay={getPopoverGeography()}>
              <span className="d-inline-block">
                <Button className="ms-3" variant="light">{t('Geography')}</Button>
              </span>
            </OverlayTrigger>
            )}
            </aside>
          </Col>
        </Row>
      </Container>
    )) ||
    null
  );
};

export default FilterEngine;
