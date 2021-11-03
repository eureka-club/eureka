import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, useEffect, useState, FunctionComponent, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation, useQueryClient } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import TagsInput from './controls/TagsInput';
import { EditWorkClientPayload, WorkMosaicItem } from '../../types/work';
// import ImageFileSelect from './controls/ImageFileSelect';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreateWorkForm.module.css';
import i18nConfig from '../../../i18n';
import useTopics from '../../useTopics';

dayjs.extend(utc);
const EditWorkForm: FunctionComponent = () => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [publicationYearLabel, setPublicationYearLabel] = useState('...');
  // const [coverFile, setCoverFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation('createWorkForm');
  const router = useRouter();
  const [tags, setTags] = useState<string>('');
  const [work, setWork] = useState<WorkMosaicItem | null>(null);
  const [publicationLengthLabel, setPublicationLengthLabel] = useState('...');
  const typeaheadRef = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);
  const [isCountriesSearchLoading2, setIsCountriesSearchLoading2] = useState(false);
  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [countryOrigin, setCountryOrigin] = useState<string>();
  const [countryOrigin2, setCountryOrigin2] = useState<string | null>();
  const [hasCountryOrigin2, sethasCountryOrigin2] = useState<boolean>();
  const { data: topics } = useTopics();
  const [items, setItems] = useState<string[]>([]);

  const { locale } = useRouter();
  const [namespace, setNamespace] = useState<Record<string, string>>();

  useEffect(() => {
    const fn = async () => {
      const r = await i18nConfig.loadLocaleFrom(locale, 'countries');
      setNamespace(r);
    };
    fn();
  }, [locale]);

  const labelsChange = (fieldName: string) => {
    switch (fieldName) {
      case 'fiction-book':
      case 'book':
        setPublicationLengthLabel(t('Length pages'));
        setPublicationYearLabel(t('Publication year'));
        break;
      case 'movie':
      case 'documentary':
        setPublicationYearLabel(t('releaseYearFieldLabel'));
        setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
        break;

      default:
        setPublicationYearLabel('...');
        setPublicationLengthLabel('...');
    }
  };

  useEffect(() => {
    const fetchWork = async () => {
      const res: Response = await fetch(`/api/work/${router.query.id}`);
      const { status, work: w = null } = await res.json();
      if (status === 'OK') {
        setWork(w);
        setTags(() => {
          const ts = w.tags;
          return ts;
        });
        labelsChange(w.type);
      }
    };
    fetchWork();
  }, [router.query.id]);

  useEffect(() => {
    if (work) {
      if (work.countryOfOrigin2) setCountryOrigin2(work.countryOfOrigin2);
      // setTopicsTags(work.topics || '');
      if (work.topics) items.push(...work.topics.split(','));
    }
  }, [work]);

  const {
    mutate: execEditWork,
    error: editWorkError,
    isError,
    isLoading,
    isSuccess,
  } = useMutation(async (payload: EditWorkClientPayload) => {
    const res = await fetch(`/api/work/${router.query.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  });

  const handleWorkTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    labelsChange(ev.currentTarget.value);
    /* switch (ev.currentTarget.value) {
      case 'book':
        setPublicationLengthLabel(`${t('Length')} (${t('pages')})`);
        break;
      case 'movie':
      case 'documentary':
        setPublicationYearLabel(t('releaseYearFieldLabel'));
        setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
        break;

      default:
        setPublicationYearLabel(t('publicationYearFieldLabel'));
        setPublicationLengthLabel(`${t('Length')} | ${t('Duration')}`);
    } */
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // if (coverFile == null) {
    //   return;
    // }

    const form = ev.currentTarget;
    const payload: EditWorkClientPayload = {
      id: router.query.id as string,
      type: form.type.value,
      title: form.workTitle.value,
      author: form.author.value,
      authorGender: form.authorGender.value.length ? form.authorGender.value : null,
      authorRace: form.authorRace.value.length ? form.authorRace.value : null,
      // cover: coverFile,
      contentText: form.description.value.length ? form.description.value : null,
      link: form.link.value.length ? form.link.value : null,
      countryOfOrigin: countryOrigin,
      countryOfOrigin2: countryOrigin2,
      publicationYear: form.publicationYear.value.length ? form.publicationYear.value : null,
      length: form.workLength.value.length ? form.workLength.value : null,
      tags,
      topics: items.join(),
    };

    await execEditWork(payload);
  };

  const handlerchange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (work && ev.currentTarget.id in work) {
      let w: WorkMosaicItem & { [key: string]: unknown } = work;
      w = work;
      w[ev.currentTarget.id] = ev.currentTarget.value;
      setWork(w);
    }
  };

  useEffect(() => {
    if (isSuccess === true) {
      setGlobalModalsState({ ...globalModalsState, ...{ editWorkModalOpened: false } });
      queryClient.invalidateQueries('works.mosaic');
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSearchCountry = async (query: string) => {
    setIsCountriesSearchLoading(true);
    const response = await fetch(`/api/taxonomy/countries?q=${query}`);
    const itemsSC: { id: number; code: string; label: string }[] = (await response.json()).result;
    itemsSC.forEach((i, idx: number) => {
      itemsSC[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
    });
    setCountrySearchResults(itemsSC);
    setIsCountriesSearchLoading(false);
  };

  const handleSearchCountrySelect = (selected: { id: number; code: string; label: string }[]): void => {
    if (selected[0] != null) {
      setCountryOrigin(selected[0].code);
    }
  };

  const toogleCountryOrigin2Handler = (countryOpt?: number) => {
    if (countryOpt === 2) {
      sethasCountryOrigin2(false);
      setCountryOrigin2(null);
    } else {
      sethasCountryOrigin2(true);
      setCountryOrigin2(null);
    }
  };

  const handleSearchCountry2Select = (selected: { id: number; code: string; label: string }[]): void => {
    if (selected[0] != null) {
      // if (hasCountryOrigin2)
      setCountryOrigin2(selected[0].code);
    }
  };

  const handleSearchCountry2 = async (query: string) => {
    setIsCountriesSearchLoading2(true);
    const response = await fetch(`/api/taxonomy/countries?q=${query}`);
    const itemsSC2: { id: number; code: string; label: string }[] = (await response.json()).result;
    itemsSC2.forEach((i, idx: number) => {
      itemsSC2[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
    });
    setCountrySearchResults(itemsSC2);
    setIsCountriesSearchLoading2(false);
  };

  return (
    work && (
      <Form onSubmit={handleSubmit}>
        <ModalHeader closeButton>
          <Container>
            <ModalTitle>{t('titleEdit')}</ModalTitle>
          </Container>
        </ModalHeader>

        <ModalBody>
          <Container>
            <Row>
              <Col>
                <FormGroup controlId="type">
                  <FormLabel>*{t('typeFieldLabel')}</FormLabel>
                  <Form.Select as="select" required onChange={handleWorkTypeChange} defaultValue={work.type}>
                    <option value="">{t('typeFieldPlaceholder')}</option>
                    <option value="book">{t('common:book')}</option>
                    <option value="fiction-book">{t('common:fiction-book')}</option>
                    <option value="documentary">{t('common:documentary')}</option>
                    <option value="movie">{t('common:movie')}</option>
                  </Form.Select>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="workTitle">
                  <FormLabel>*{t('titleFieldLabel')}</FormLabel>
                  <FormControl type="text" required defaultValue={work.title} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup controlId="author">
                  <FormLabel>*{t('authorFieldLabel')}</FormLabel>
                  <FormControl type="text" required defaultValue={work.author} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="link">
                  <FormLabel>{t('linkFieldLabel')}</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="http://"
                    defaultValue={work.link?.toString()}
                    onChange={handlerchange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup controlId="publicationYear">
                  <FormLabel>{publicationYearLabel}</FormLabel>
                  <FormControl
                    defaultValue={dayjs(work.publicationYear?.toString()).utc().year()}
                    type="number"
                    min="-5000"
                    max="2200"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="countryOfOrigin1">
                  <FormLabel>{t('countryFieldLabel')}</FormLabel>
                  <AsyncTypeahead
                    id="create-work--search-country"
                    // Bypass client-side filtering. Results are already filtered by the search endpoint
                    filterBy={() => true}
                    // inputProps={{ required: true }}
                    // placeholder={t('addWrkTypeaheadPlaceholder')}
                    ref={typeaheadRef}
                    isLoading={isCountriesSearchLoading}
                    labelKey={(res) => `${res.label}`}
                    minLength={2}
                    onSearch={handleSearchCountry}
                    options={countrySearchResults}
                    onChange={handleSearchCountrySelect}
                    placeholder={namespace && work.countryOfOrigin ? namespace[work.countryOfOrigin] : ''}
                    // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                  />
                  {!countryOrigin2 && !hasCountryOrigin2 && (
                    <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler()}>
                      {t('Add a second origin country')}
                    </Button>
                  )}
                </FormGroup>
              </Col>
              {(countryOrigin2 || hasCountryOrigin2) && (
                <Col>
                  <FormGroup controlId="countryOfOrigin2">
                    <FormLabel>{t('countryFieldLabel')} 2</FormLabel>
                    <AsyncTypeahead
                      id="create-work--search-country2"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      // inputProps={{ required: true }}
                      // placeholder={t('addWrkTypeaheadPlaceholder')}
                      // ref={typeaheadRef}
                      isLoading={isCountriesSearchLoading2}
                      labelKey={(res) => `${res.label}`}
                      minLength={2}
                      onSearch={handleSearchCountry2}
                      options={countrySearchResults}
                      onChange={handleSearchCountry2Select}
                      placeholder={namespace && countryOrigin2 ? namespace[countryOrigin2] : ''}
                      // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                    />
                    <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler(2)}>
                      {t('Remove the second origin country')}
                    </Button>
                  </FormGroup>
                </Col>
              )}
              <Col>
                <FormGroup controlId="workLength">
                  <FormLabel>{publicationLengthLabel}</FormLabel>
                  <FormControl defaultValue={work.length?.toString()} type="number" min="0" max="999999" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <TagsInput tags={tags} setTags={setTags} label={t('topicsFieldLabel')} />
              </Col>
              {/* <Col>
                <ImageFileSelect acceptedFileTypes="image/*" file={coverFile} setFile={setCoverFile} required>
                  {(imagePreview) => (
                    <FormGroup>
                      <FormLabel>*{t('imageCoverFieldLabel')}</FormLabel>
                      <div className={styles.imageControl}>
                        {coverFile != null && imagePreview != null ? (
                          <>
                            <span className={styles.imageName}>{coverFile?.name}</span>
                            <img src={imagePreview} className="float-right" alt="Work cover" />
                          </>
                        ) : (
                          t('imageCoverFieldPlaceholder')
                        )}
                      </div>
                    </FormGroup>
                  )}
                </ImageFileSelect>
              </Col> */}
            </Row>

            <Row>
              <Col>
                <FormGroup controlId="authorGender">
                  <FormLabel>{t('authorGenderFieldLabel')}</FormLabel>
                  <FormControl as="select" defaultValue={work.authorGender?.toString()}>
                    <option value="">{t('authorGenderFieldPlaceholder')}</option>
                    <option value="female">{t('authorGenderFemale')}</option>
                    <option value="male">{t('authorGenderMale')}</option>
                    <option value="non-binary">{t('authorGenderNonbinary')}</option>
                    <option value="trans">{t('authorGenderTrans')}</option>
                    <option value="other">{t('authorGenderOther')}</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="authorRace">
                  <FormLabel>{t('authorEthnicityFieldLabel')}</FormLabel>
                  <FormControl as="select" defaultValue={work.authorRace?.toString()}>
                    <option value="">{t('authorEthnicityFieldPlaceholder')}</option>
                    <option value="white">{t('authorEthnicityIsWhite')}</option>
                    <option value="non-white">{t('authorEthnicityIsNotWhite')}</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup controlId="topics">
                  <FormLabel>{t('topicsLabel')}</FormLabel>
                  <TagsInputTypeAhead
                    data={topics}
                    items={items}
                    setItems={setItems}
                    max={3}
                    labelKey={(res) => t(`topics:${res.code}`)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <FormGroup controlId="description" as={Col}>
                <FormLabel>{t('workSummaryFieldLabel')}</FormLabel>
                <FormControl as="textarea" rows={6} maxLength={4000} defaultValue={work.contentText?.toString()} />
              </FormGroup>
            </Row>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Container className="py-3">
            <Button variant="primary" type="submit" className="pl-5 pr-4 float-right">
              {t('titleEdit')}
              {isLoading ? (
                <Spinner animation="grow" variant="info" className={styles.loadIndicator} />
              ) : (
                <span className={styles.placeholder} />
              )}
              {isError && editWorkError}
            </Button>
          </Container>
        </ModalFooter>
      </Form>
    )
  );
};

export default EditWorkForm;
