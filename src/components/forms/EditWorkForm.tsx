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
import LanguageSelect from './controls/LanguageSelect';
//import FormControl from 'react-bootstrap/FormControl';
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
import { Country } from '@/src/types';
// import ImageFileSelect from './controls/ImageFileSelect';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './EditWorkForm.module.css';
import i18nConfig from '../../../i18n';
import useTopics from '../../useTopics';
import useCountries from 'src/useCountries';
import useWork from '@/src/useWork'
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import TagsInputTypeAheadMaterial from '@/components/forms/controls/TagsInputTypeAheadMaterial';
import TagsInputMaterial from '@/components/forms/controls/TagsInputMaterial';
import ImageFileSelect from '@/components/forms/controls/ImageFileSelectMUI';
import LocalImageComponent from '../LocalImage';
import { PostMosaicItem } from '@/src/types/post';

dayjs.extend(utc);

interface FormValues {
  type: string;
  title: string;
  language: string | null;
  link: string | null;
  author: string;
  authorGender: string | null;
  authorRace: string | null;
  publicationYear: number | null;
  workLength: string | null;
  description: string | null;
}

const EditWorkForm: FunctionComponent = () => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('createWorkForm')
  const [countrySearchResults, setCountrySearchResults] = useState<{ code: string; label: string }[]>([]);
  const [formValues, setFormValues] = useState<FormValues>({
    type: '',
    title: '',
    language:'',
    link: '',
    author: '',
    authorGender: '',
    authorRace: '',
    publicationYear: null,
    workLength: '',
    description: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [countryOrigin, setCountryOrigin] = useState<string[]>([]);
  const [tags, setTags] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [items, setItems] = useState<string[]>([]);  //topics
  const [publicationLengthLabel, setPublicationLengthLabel] = useState('...');
  const [publicationYearLabel, setPublicationYearLabel] = useState('...');
  const [publicationLinkLabel, setPublicationLinkLabel] = useState('...');
  const [ck, setCK] = useState<string[]>();

  const { data: topics } = useTopics();
  const { data: work } = useWork(+(router.query?.id?.toString()!), { enabled: !!router.query?.id, notLangRestrict: true })
  const { data: countries } = useCountries();


  useEffect(() => {
    if (countries) setCountrySearchResults(countries.map((d: Country) => ({ code: d.code, label: d.code })))
  }, [countries])

  useEffect(() => {
    if (router && router.query?.admin) {
      setIsAdmin(true);
    }
  }, [router])

  useEffect(() => {
    //console.log(work, 'work work')
    if (work) {
      let formValues = {
        type: work.type,
        title: work.title,
        language: work.language,
        link: work.link,
        author: work.author,
        authorGender: work.authorGender || '',
        authorRace: work.authorRace || '',
        publicationYear: dayjs(work.publicationYear?.toString()).utc().year(),
        workLength: work.length,
        description: work.contentText,
      }
      setFormValues(formValues);
      //console.log(formValues, 'formValues formValues')
      setTags(work.tags || '');
      labelsChange(work.type);
      if (work.topics?.length) {
        for (let topic of work.topics.split(',')) {
          if (!items.includes(topic))
            items.push(...work.topics.split(','));
        }
      }
      if (work.countryOfOrigin) setCountryOrigin(work.countryOfOrigin.split(','));
    }
  }, [work]);



  const labelsChange = (fieldName: string) => {
    switch (fieldName) {
      case 'movie':
        setPublicationLinkLabel('Streaming on')
        setPublicationYearLabel(t('releaseYearFieldLabel'));
        setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
        break;
      case 'documentary':
        setPublicationLinkLabel('Streaming on')
        setPublicationYearLabel(t('releaseYearFieldLabel'));
        setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
        break;
      case 'book':
        setPublicationLinkLabel(t('linkFieldLabel'));
        setPublicationLengthLabel(t('Length pages'));
        setPublicationYearLabel(t('Publication year'));
        break;
      case 'fiction-book':
        setPublicationLinkLabel(t('linkFieldLabel'));
        setPublicationLengthLabel(t('Length pages'));
        setPublicationYearLabel(t('Publication year'));
        break;
      default:
        setPublicationLinkLabel(t('linkFieldLabel'));
        setPublicationYearLabel('...');
        setPublicationLengthLabel('...');
    }
  };

  function handleChangeSelectField(ev: SelectChangeEvent) {
    ev.preventDefault();

    const { name, value } = ev.target;
    setFormValues({
      ...formValues,
      [name]: value
    });

    if (name === 'type') {
      switch (value) {
        case 'movie':
          setPublicationLinkLabel('Streaming on')
          setPublicationYearLabel(t('releaseYearFieldLabel'));
          setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
          break;
        case 'documentary':
          setPublicationLinkLabel('Streaming on')
          setPublicationYearLabel(t('releaseYearFieldLabel'));
          setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
          break;
        case 'book':
          setPublicationLinkLabel(t('linkFieldLabel'));
          setPublicationLengthLabel(t('Length pages'));
          setPublicationYearLabel(t('Publication year'));
          break;
        case 'fiction-book':
          setPublicationLinkLabel(t('linkFieldLabel'));
          setPublicationLengthLabel(t('Length pages'));
          setPublicationYearLabel(t('Publication year'));
          break;
        default:
          setPublicationLinkLabel(t('linkFieldLabel'));
          setPublicationYearLabel('...');
          setPublicationLengthLabel('...');
      }
      //setWorkType(ev.target.value as string);
    }
  }

  function handleChangeTextField(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    ev.preventDefault();
    console.log(ev.target,'event')
    const { name, value } = ev.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  }




  const {
    mutate: execEditWork,
    isLoading,
    isSuccess,
  } = useMutation(async (payload: EditWorkClientPayload) => {

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value);
      }
    });

    const res = await fetch(`/api/work/${work!.id}`, {
      method: 'POST',
     // headers: { 'Content-Type': 'application/json' },
      body: formData,//JSON.stringify(payload),
    });

    return res.json();
  }, {
    onMutate: async (variables) => {
      if (work) {
        const ck_ = ck || ['WORK', `${work.id}`];
        await queryClient.cancelQueries(ck_)
        const snapshot = queryClient.getQueryData<WorkMosaicItem>(ck_)
        const { title, contentText } = variables;
        if (snapshot) {
          queryClient.setQueryData(ck_, { ...snapshot, title, contentText });

          return { snapshot, ck: ck_ };
        }
      }
    },
    onSettled: (_work, error, _variables, context) => {
      if (error) {
        queryClient.invalidateQueries(ck);
        queryClient.invalidateQueries(['WORK', `${work!.id}`]);
      }
      queryClient.invalidateQueries(ck);

    },
  });



  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();


    const payload: EditWorkClientPayload = {
      id: router.query.id as string,
      type: formValues?.type!,
      title: formValues?.title!,
      language: formValues?.language!,
      author: formValues?.author!,
      authorGender: formValues.authorGender ? formValues.authorGender : null,
      authorRace: formValues.authorRace ? formValues.authorRace : null,
      cover: coverFile,
      contentText: formValues.description ? formValues.description : null,
      link: formValues.link ? formValues.link : null,
      countryOfOrigin: countryOrigin.join(',') || null,
      //countryOfOrigin2: countryOrigin2 || null,
      publicationYear: formValues.publicationYear ? formValues.publicationYear.toString() : null,
      length: formValues.workLength ? formValues.workLength : null,
      tags,
      topics: items.join(','),
    };
    //console.log(payload)
    await execEditWork(payload);
  };

 


  useEffect(() => {
    if (isSuccess === true) {
      setGlobalModalsState({ ...globalModalsState, ...{ editWorkModalOpened: false } });
      queryClient.invalidateQueries('works.mosaic');
      if(!isAdmin)
      router.push(`/work/${work!.id}`);
      else
        router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const onSelectLanguage = (language: string) => {
    setFormValues({
      ...formValues,
      ['language']: language
    });
  };


  if (!work) return <></>
  return (
    work && (
      <Form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle className='d-flex flex-row justified-content-between mt-sm-0 mt-2 mb-3  w-100'>
            <h1 className="text-secondary fw-bold w-100">{t('titleEdit')}</h1>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <span className='text-primary fw-bold'>{t('BasicInformation')}</span>
          <Row className='d-flex flex-column flex-lg-row mt-4'>
            <Col className="">
              <FormGroup controlId="type">
                <FormControl size="small" fullWidth>
                  <InputLabel id="type-label">*{t('typeFieldLabel')}</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formValues.type}
                    label={`*${t("typeFieldLabel")}`}
                    onChange={handleChangeSelectField}
                  //disabled={(selectedWork) ? true : false}
                  >
                    <MenuItem value="">{t('typeFieldPlaceholder')}</MenuItem>
                    <MenuItem value="book">{t('common:book')}</MenuItem>
                    <MenuItem value="fiction-book">{t('common:fiction-book')}</MenuItem>
                    <MenuItem value="documentary">{t('common:documentary')}</MenuItem>
                    <MenuItem value="movie">{t('common:movie')}</MenuItem>
                  </Select>
                </FormControl>
              </FormGroup>
            </Col>
            <Col className="mt-4 mt-lg-0">
              <TextField id="title" className="w-100" label={`*${t('titleFieldLabel')}`}
                variant="outlined" size="small" name="title"
                value={formValues.title!}
                type="text"
                onChange={handleChangeTextField}
              >
              </TextField>
            </Col>

          </Row>
          <><Row className='d-flex flex-column flex-lg-row mt-4 mb-4'>
            <Col className="d-flex flex-row ">
              <ImageFileSelect aceptedFileTypes="image/*" file={coverFile} setFile={setCoverFile} >
                {(imagePreview) => (
                  <div className={styles.imageControl}>
                    {coverFile != null && imagePreview != null ? (
                      <>
                        <img src={imagePreview} className="float-left" alt="Work cover" />
                      </>
                    ) : ""}
                  </div>
                )}
              </ImageFileSelect>
              <LocalImageComponent filePath={work.localImages[0].storedFile} alt='' width={75} className='ms-2 rounded-2' />
            </Col>
            <Col className="mt-4 mt-lg-0">
              <div className='mb-4'>
                <LanguageSelect onSelectLanguage={onSelectLanguage} defaultValue={formValues.language} label={t('languageFieldLabel')}/>
              </div>
              <TextField id="link" className="w-100" label={publicationLinkLabel}
                variant="outlined" size="small" name='link'
                value={formValues.link}
                type="text"
                onChange={handleChangeTextField}
              >
              </TextField>
            </Col>
          </Row>

            <span className='text-primary fw-bold'>{t('Authorship')}</span>
            <Row className='d-flex flex-column flex-lg-row mt-4 mb-4'>
              <Col className="">
                <TextField id="author" className="w-100" label={`*${t('authorFieldLabel')}`}
                  variant="outlined" size="small" name='author'
                  value={formValues.author}
                  type="text"
                  onChange={handleChangeTextField}
                >
                </TextField>


              </Col>
              <Col className="mt-4 mt-lg-0">
                <FormGroup controlId="countryOrigin">
                  <TagsInputTypeAheadMaterial
                    data={countrySearchResults}
                    items={countryOrigin}
                    setItems={setCountryOrigin}
                    formatValue={(v: string) => t(`countries:${v}`)}
                    max={2}
                    label={`${t('countryFieldLabel')} - 2 max`}
                  //placeholder={`${t('Type to add tag')}...`}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className='d-flex flex-column flex-lg-row mt-4 mb-4'>
              <Col className="">
                <FormGroup controlId="authorGender">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="authorGender-label">*{t('authorGenderFieldLabel')}</InputLabel>
                    <Select
                      labelId="authorGender-label"
                      id="authorGender"
                      name='authorGender'
                      value={formValues.authorGender!}
                      label={`*${t("authorGenderFieldLabel")}`}
                      onChange={handleChangeSelectField}
                    >
                      <MenuItem value="">{t('authorGenderFieldPlaceholder')}</MenuItem>
                      <MenuItem value="female">{t('authorGenderFemale')}</MenuItem>
                      <MenuItem value="male">{t('authorGenderMale')}</MenuItem>
                      <MenuItem value="non-binary">{t('authorGenderNonbinary')}</MenuItem>
                      <MenuItem value="trans">{t('authorGenderTrans')}</MenuItem>
                      <MenuItem value="other">{t('authorGenderOther')}</MenuItem>
                    </Select>
                  </FormControl>
                </FormGroup>

              </Col>
              <Col className=" mt-4 mt-lg-0">
                <FormGroup controlId="authorRace">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="authorRace-label">*{t('authorEthnicityFieldLabel')}</InputLabel>
                    <Select
                      labelId="authorRace-label"
                      id="authorRace"
                      name='authorRace'
                      value={formValues.authorRace!}
                      label={`*${t("authorEthnicityFieldLabel")}`}
                      onChange={handleChangeSelectField}
                    >
                      <MenuItem value="">{t('authorEthnicityFieldPlaceholder')}</MenuItem>
                      <MenuItem value="white">{t('authorEthnicityIsWhite')}</MenuItem>
                      <MenuItem value="non-white">{t('authorEthnicityIsNotWhite')}</MenuItem>
                    </Select>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>

            <span className='text-primary fw-bold'>{t('Content')}</span>
            <Row className='d-flex flex-column flex-lg-row mt-4'>
              <Col className="">
                <FormGroup controlId="topics">
                  <TagsInputTypeAheadMaterial
                    data={topics}
                    items={items}
                    setItems={setItems}
                    formatValue={(v: string) => t(`topics:${v}`)}
                    max={3}
                    label={t('topicsLabel')}
                   // placeholder={`${t('Type to add tag')}...`}
                  />
                </FormGroup>
              </Col>
              <Col className="mt-4 mt-lg-0">
                <TagsInputMaterial tags={tags} setTags={setTags} label={t('topicsFieldLabel')} />

              </Col>
            </Row>
            <span className='text-primary fw-bold'>{t('AdditionalInformation')}</span>
            <Row className='d-flex flex-column flex-lg-row mt-4'>
              <Col className="">
                <TextField id="publicationYear" className="w-100" label={publicationYearLabel}
                  variant="outlined" size="small" name="publicationYear"
                  value={formValues.publicationYear}
                  type="number"
                  onChange={handleChangeTextField}
                />
              </Col>
              <Col className="mt-4 mt-lg-0">
                <TextField id="workLength" className="w-100" label={publicationLengthLabel}
                  variant="outlined" size="small" name="workLength"
                  value={formValues.workLength}
                  type="text"
                  onChange={handleChangeTextField}
                />
              </Col>
            </Row>
            <Row className='d-flex flex-column flex-lg-row mt-4 mb-5'>
              <Col className="">
                <FormGroup controlId="description">
                  <FormLabel>{t('workSummaryFieldLabel')}</FormLabel>
                  <Textarea minRows={5} name="description" value={formValues.description!} onChange={handleChangeTextField} />
                </FormGroup>
              </Col>
            </Row>

          </>

        </ModalBody>
        <ModalFooter>
          <Row>
            <Col className='d-flex justify-content-end mt-4 mb-2'>
              <Button disabled={isLoading} type="submit" className="mt-3 btn-eureka" style={{ width: '10em' }}>
                <>
                  {t('titleEdit')}
                  {isLoading && (
                    <Spinner animation="grow" variant="info" className={`ms-2 ${styles.loadIndicator}`} size="sm" />
                  )}
                </>
              </Button>
            </Col>
          </Row>
        </ModalFooter>
      </Form>
    )
  );
};

export default EditWorkForm;
