import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState, useRef,MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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
import TagsInput from './controls/TagsInput';
import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import toast from 'react-hot-toast'
import useTopics from '../../useTopics';
import { ImCancelCircle } from 'react-icons/im';

import { CreateWorkClientPayload } from '../../types/work';
import ImageFileSelect from './controls/ImageFileSelect';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreateWorkForm.module.css';

interface Props {
  noModal?: boolean;
}

const CreateWorkForm: FunctionComponent<Props> = ({noModal = false})=> {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [publicationYearLabel, setPublicationYearLabel] = useState('...');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('createWorkForm');
  const [publicationLengthLabel, setPublicationLengthLabel] = useState('...');
  const typeaheadRef = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);
  const [isCountriesSearchLoading2, setIsCountriesSearchLoading2] = useState(false);
  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [countryOrigin, setCountryOrigin] = useState<string>();
  const [hasCountryOrigin2, setHasCountryOrigin2] = useState<boolean>();
  const [countryOrigin2, setCountryOrigin2] = useState<string>();
  const [workId, setWorkId] = useState<number | undefined>();
  const { data: topics } = useTopics();
  const {
    mutate: execCreateWork,
    error: createWorkError,
    isError,
    isLoading,
    isSuccess,
  } = useMutation(
    async (payload: CreateWorkClientPayload) => {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });

      const res = await fetch('/api/work', {
        method: 'POST',
        body: formData,
      });

      if(res.ok){
         const json = await res.json();
         setWorkId(json.id);
         toast.success( t('WorkSaved'))
         return json.work;
      }
      return null;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('WORKS'); // setQueryData could not be used because relations are not returned when the work is created :|
      },
    },
  );

  const handleWorkTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    switch (ev.currentTarget.value) {
      case 'movie':
      case 'documentary':
        setPublicationYearLabel(t('releaseYearFieldLabel'));
        setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
        break;
      case 'fiction-book':
      case 'book':
        setPublicationLengthLabel(t('Length pages'));
        setPublicationYearLabel(t('Publication year'));
        break;
      default:
        setPublicationYearLabel('...');
        setPublicationLengthLabel('...');
    }
  };

  const handleSearchCountry = async (query: string) => {
    setIsCountriesSearchLoading(true);
    const response = await fetch(`/api/taxonomy/countries?q=${query}`);
    const itemsSC: { id: number; code: string; label: string }[] = (await response.json()).result;
    if (itemsSC) {
      itemsSC.forEach((i, idx: number) => {
        itemsSC[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
      });
      setCountrySearchResults(itemsSC);
    }
    setIsCountriesSearchLoading(false);
  };

  const handleSearchCountry2 = async (query: string) => {
    setIsCountriesSearchLoading2(true);
    const response = await fetch(`/api/taxonomy/countries?q=${query}`);
    const itemsC: { id: number; code: string; label: string }[] = (await response.json()).result;
    itemsC.forEach((i, idx: number) => {
      itemsC[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
    });
    setCountrySearchResults(itemsC);
    setIsCountriesSearchLoading2(false);
  };

  const handleSearchCountrySelect = (selected: { id: number; code: string; label: string }[]): void => {
    if (selected[0] != null) {
      setCountryOrigin(selected[0].code);
      // setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
      // setAddWorkModalOpened(false);
    }
  };

  const handleSearchCountry2Select = (selected: { id: number; code: string; label: string }[]): void => {
    if (selected[0] != null) {
      if (hasCountryOrigin2) setCountryOrigin2(selected[0].code);

      // setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
      // setAddWorkModalOpened(false);
    }
  };

  const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    /*setSelectedWorksForCycle([]);
    setCycleCoverImageFile(null);
    editorRef.current.setContent('');*/
    setItems([]);
    setTags('');


   /* if (formRef.current != null) {
      const form = formRef.current;

      form.cycleTitle.value = '';
      form.languages.value = '';
      form.startDate.value = '';
      form.endDate.value = '';
    }*/
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
/*
    if (coverFile == null) {
      return;
    }

    const form = ev.currentTarget;
    const payload: CreateWorkClientPayload = {
      type: form.type.value,
      title: form.workTitle.value,
      author: form.author.value,
      authorGender: form.authorGender.value.length ? form.authorGender.value : null,
      authorRace: form.authorRace.value.length ? form.authorRace.value : null,
      cover: coverFile,
      contentText: form.description.value.length ? form.description.value : null,
      link: form.link.value.length ? form.link.value : null,
      countryOfOrigin: countryOrigin || null,
      countryOfOrigin2: countryOrigin2 || null,
      publicationYear: form.publicationYear.value.length ? form.publicationYear.value : null,
      length: form.workLength.value.length ? form.workLength.value : null,
      tags,
      topics: items.join(','),
    };

    await execCreateWork(payload);*/
  };

  const toogleCountryOrigin2Handler = (countryOpt?: number) => {
    if (countryOpt === 2) setHasCountryOrigin2(false);
    else setHasCountryOrigin2(true);
  };

  useEffect(() => {
    if (isSuccess === true) {
      setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: false } });
      queryClient.invalidateQueries('works.mosaic');
      router.push(`/work/${workId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // const onNewTagAdded = (e: { code: string; label: string }[]) => {
  //   if (e.length) {
  //     // topicsTags.push(e[0].code);
  //     // setTopicsTags([...new Set(topicsTags)]);

  //     // if (setTags) setTags(items.join());
  //     refTopics.current!.clear();
  //   }
  // };

  return (
    <Form onSubmit={handleSubmit}>
      <ModalHeader closeButton={!noModal}>
         <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('title')}</h1></ModalTitle>
      </ModalHeader>

      <ModalBody>
            <Row className='d-flex flex-column flex-lg-row'>
            <Col className="mb-4">
              <FormGroup controlId="type">
                <FormLabel>*{t('typeFieldLabel')}</FormLabel>
                <Form.Select as="select" required onChange={handleWorkTypeChange}>
                  <option value="">{t('typeFieldPlaceholder')}</option>
                  <option value="book">{t('common:book')}</option>
                  <option value="fiction-book">{t('common:fiction-book')}</option>
                  <option value="documentary">{t('common:documentary')}</option>
                  <option value="movie">{t('common:movie')}</option>
                </Form.Select>
              </FormGroup>
            </Col>
            <Col className="mb-4">
              <FormGroup controlId="workTitle">
                <FormLabel>*{t('titleFieldLabel')}</FormLabel>
                <FormControl type="text" required />
              </FormGroup>
            </Col>
          </Row>
            <Row className='d-flex flex-column flex-lg-row'>
            <Col className="mb-4">
              <FormGroup controlId="author">
                <FormLabel>*{t('authorFieldLabel')}</FormLabel>
                <FormControl type="text" required />
              </FormGroup>
            </Col>
            <Col className="mb-4">
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
            </Col>
          </Row>
            <Row className='d-flex flex-column flex-lg-row'>
            <Col className="mb-4">
              <FormGroup controlId="publicationYear">
                <FormLabel>{publicationYearLabel}</FormLabel>
                <FormControl type="number" min="-5000" max="2200" />
              </FormGroup>
            </Col>
            {/* <Col>
              <FormGroup controlId="countryOfOrigin">
                <FormLabel>{t('countryFieldLabel')}</FormLabel>
                <FormControl type="text" />
              </FormGroup>
            </Col> */}
            <Col className="mb-4">
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
                  // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                />
                {!hasCountryOrigin2 && (
                  <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler()}>
                    {t('Add a second origin country')}
                  </Button>
                )}
              </FormGroup>
            </Col>
            {hasCountryOrigin2 && (
            <Col className="mb-4">
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
                    // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                  />
                  <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler(2)}>
                    {t('Remove the second origin country')}
                  </Button>
                </FormGroup>
              </Col>
            )}
            <Col className="mb-4">
              <FormGroup controlId="workLength">
                <FormLabel>{publicationLengthLabel}</FormLabel>
                <FormControl type="number" min="0" max="999999" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mb-4">
              <FormGroup controlId="topics">
                <FormLabel>{t('topicsLabel')}</FormLabel>
                <TagsInputTypeAhead
                  data={topics??[]}
                  items={items}
                  setItems={setItems}
                  labelKey={(res) => t(`topics:${res.code}`)}
                  max={3}
                  formatValue={(v: string) => t(`topics:${v}`)} 
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mb-4">
              <TagsInput tags={tags} setTags={setTags} label={t('topicsFieldLabel')}/>
            </Col>
          </Row>
          <Row>
            <Col className="mb-4">
              <FormGroup controlId="link">
                <FormLabel>{t('linkFieldLabel')}</FormLabel>
                <FormControl type="text" placeholder="http://" />
              </FormGroup>
            </Col>
          </Row>
            <Row className='d-flex flex-column flex-lg-row'>
            <Col className="mb-4">
              <FormGroup controlId="authorGender">
                <FormLabel>{t('authorGenderFieldLabel')}</FormLabel>
                <FormControl as="select">
                  <option value="">{t('authorGenderFieldPlaceholder')}</option>
                  <option value="female">{t('authorGenderFemale')}</option>
                  <option value="male">{t('authorGenderMale')}</option>
                  <option value="non-binary">{t('authorGenderNonbinary')}</option>
                  <option value="trans">{t('authorGenderTrans')}</option>
                  <option value="other">{t('authorGenderOther')}</option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col className="mb-4">
              <FormGroup controlId="authorRace">
                <FormLabel>{t('authorEthnicityFieldLabel')}</FormLabel>
                <FormControl as="select">
                  <option value="">{t('authorEthnicityFieldPlaceholder')}</option>
                  <option value="white">{t('authorEthnicityIsWhite')}</option>
                  <option value="non-white">{t('authorEthnicityIsNotWhite')}</option>
                </FormControl>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <FormGroup controlId="description" as={Col}  className="mb-4" >
              <FormLabel>{t('workSummaryFieldLabel')}</FormLabel>
              <FormControl as="textarea" rows={6} maxLength={4000} />
            </FormGroup>
          </Row>
      </ModalBody>

      <ModalFooter>
        <Container className="p-0 d-flex justify-content-end">
           <ButtonGroup  className="py-4">
            <Button
               variant="warning"
                onClick={handleFormClear}
                className="text-white"
              >
                <ImCancelCircle />
              </Button>
          <Button disabled={isLoading} type="submit" className="btn-eureka">
            <>
              {t('submitButtonLabel')}
              {isLoading && (
                <Spinner animation="grow" variant="info" className={`ms-2 ${styles.loadIndicator}`} size="sm"  />
              ) }
            </>
          </Button>
            </ButtonGroup>
          

        </Container>
      </ModalFooter>
    </Form>
  );
};

export default CreateWorkForm;
