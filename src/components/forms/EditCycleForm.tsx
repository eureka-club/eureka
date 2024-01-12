import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { usePathname, useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';;
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Cycle } from '@prisma/client';
import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import TagsInput from './controls/TagsInput';
// import i18nConfig from '../../../i18n';
import useTopics from '../../useTopics';


import {
  DATE_FORMAT_PROPS,
} from '../../constants';
import {
  CycleMosaicItem,
  // ComplementaryMaterial,
  EditCycleClientPayload,
} from '../../types/cycle';
import LanguageSelect from './controls/LanguageSelect';
import styles from './CreateCycleForm.module.css';
import { getLocale_In_NextPages } from '@/src/lib/utils';

dayjs.extend(utc)
interface Props {
  className?: string;
  cycle: Cycle;
}

// const COMPLEMENTARY_MATERIAL_MAX_SINGLE_FILE_SIZE = 1024 * 1024 * 10;

const EditCycleForm: FunctionComponent<Props> = ({ className, cycle }) => {
  const editorRef = useRef<any>(null);
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const asPath=usePathname()!;
  const locale = getLocale_In_NextPages(asPath)

  const router = useRouter();
  const typeaheadRefOC = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
  const [countryOrigin, setCountryOrigin] = useState<string>();
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);
  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [tags, setTags] = useState<string>('');
  const [namespace, setNamespace] = useState<Record<string,string>>();
  const { data: topics } = useTopics();
  const [items, setItems] = useState<string[]>([]);
  const [access, setAccess] = useState<number | undefined>(1);
  const [language, setLanguage] = useState<string>('');
  const [cycleAccessChecked, setCycleAccessChecked] = useState<{
    public: boolean;
    private: boolean;
    secret: boolean;
    payment: boolean
  }>({
    private: false,
    public: false,
    secret: false,
    payment: false
  });
  const queryClient = useQueryClient()

  useEffect(() => {
    if (cycle) {
      const pc = cycle.access === 1;
      const pr = cycle.access === 2;
      const secret = cycle.access === 3;
      const payment = cycle.access === 4;
      setCycleAccessChecked(() => ({ public: pc, private: pr, secret, payment}));
      setAccess(cycle.access);
    }
    if (cycle && cycle.languages) setLanguage(cycle.languages);

  }, [cycle]);

  useEffect(() => {
    setTags(cycle.tags!);
    const fn = async () => {
      // const r = await i18nConfig.loadLocaleFrom(locale, 'countries');
      const res = await fetch('/api/taxonomy/countries')
      const {result} = await res.json()
      let r = (result as {code:string,label:string,parent:{code:string}}[]);
      let n:Record<string,string>|{} = {};
      n  = r.reduce((p,c)=>{
        p = {...p,[c.code]:c.label};
        return p;
      },{});
      setNamespace(n);
    };
    fn();
    if (cycle.topics?.length){
        for(let topic of cycle.topics.split(',')){
          if(!items.includes(topic))
            items.push(...cycle.topics.split(','));
      }
    } 

  }, []);

  const {
    mutate: execEditCycle,
    data: editedCycleData,
    error: editCycleReqError,
    isPending: isEditCycleReqLoading,
    isError: isEditCycleReqError,
    isSuccess: isEditCycleReqSuccess,
  } = useMutation(
    {
    mutationFn:async (payload: EditCycleClientPayload) => {
    const res = await fetch(`/api/cycle/${cycle.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
    onMutate(vars){
      const ck = ['CYCLE',`${cycle.id}`];
      queryClient.cancelQueries({queryKey:ck})
      const ss = queryClient.getQueryData<CycleMosaicItem>(ck)
      queryClient.setQueryData(ck,{...ss,...vars})
      return {ss,ck}
    },
    onSettled(data,error,vars,context){
      type ctx = {ck:string[],ss:CycleMosaicItem}
      const {ss,ck} = context as ctx;
      if(error){
        queryClient.setQueryData(ck,ss)
      }
      queryClient.invalidateQueries({queryKey:['CYCLE',`${cycle.id}`]})
    }
  });

  const { t } = useTranslation('createCycleForm');

  
  const handlerCycleAccessCheckedChange = (val: string) => {
    setCycleAccessChecked(() => ({
      private: false,
      public: false,
      secret: false,
      payment: false,
    }));
    setAccess(() => {
      return { public: 1, private: 2, secret: 3, payment: 4 }[`${val}`];
    });
    setCycleAccessChecked((res) => ({ ...res, [`${val}`]: true }));
  };

  const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();


    if (formRef.current != null) {
      const form = formRef.current;

      form.cycleTitle.value = '';
      form.languages.value = '';
      // form.topics.value = '';
      setTags('');
      form.startDate.value = '';
      form.endDate.value = '';
      form.description.value = '';
      editorRef.current.setContent('');
    }
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    
    const form = ev.currentTarget;
    const payload: EditCycleClientPayload = {
      id: cycle.id,
      // includedWorksIds: selectedWorksForCycle.map((work) => work.id),
      // coverImage: cycleCoverImageFile,
      access: access || 1,
      title: form.cycleTitle.value,
      languages: language,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      countryOfOrigin: countryOrigin,
      // contentText: form.description.value,
      contentText: editorRef.current.getContent(), // ;form.description.value,
      // complementaryMaterials,
      tags,
      topics: items.join(','),
    };

    await execEditCycle(payload);
  };

  // const chosenWorksBoxes = [0, 1, 2, 3, 4];

  useEffect(() => {
    if (!isEditCycleReqError && isEditCycleReqSuccess && editedCycleData != null) {
      router.push(`/cycle/${cycle.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditCycleReqError, isEditCycleReqSuccess, editedCycleData]);


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
      // setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
      // setAddWorkModalOpened(false);
    }
  };

  const onSelectLanguage = (language: string) => {
    setLanguage(language)
  };

  return (
    <>
      {cycle && (
        <Form onSubmit={handleSubmit} ref={formRef} className={className}>
          <h4 className="mt-2 mb-4">{t('Edit Cycle')}</h4>

          <Row className="mb-5">
            
            <Col /* md={{ span: 12 }} */>
              <FormGroup controlId="cycleTitle">
                <FormLabel>*{t('newCycleTitleLabel')}</FormLabel>
                <FormControl type="text" maxLength={80} required defaultValue={cycle.title} />
              </FormGroup>
              <FormGroup controlId="languages">
                <FormLabel>*{t('newCycleLanguageLabel')}</FormLabel>
                <LanguageSelect onSelectLanguage={onSelectLanguage} defaultValue={language} label={t('newCycleLanguageLabel')} />
              </FormGroup>
              <FormGroup controlId="topics">
                <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel>
                <TagsInputTypeAhead
                  data={topics as {code:string,label:string}[]}
                  items={items}
                  setItems={setItems}
                  labelKey={(res) => t(`topics:${res.code}`)}
                  formatValue={(v: string) => t(`topics:${v}`)} 
                  max={3}
                />
              </FormGroup>
              <TagsInput tags={tags} setTags={setTags} label={t('newCycleTopicsLabel')} />
              {/* <FormGroup controlId="topics">
                <FormLabel>{t('newCycleTopicsLabel')}</FormLabel>
                <FormControl type="text" />
              </FormGroup> */}
              <FormGroup controlId="startDate">
                <FormLabel>*{t('newCycleStartDateLabel')}</FormLabel>
                <FormControl
                  type="date"
                  required
                  defaultValue={dayjs(cycle.startDate).utc().format(DATE_FORMAT_PROPS)}
                />
              </FormGroup>
              <FormGroup controlId="endDate">
                <FormLabel>*{t('newCycleEndDateLabel')}</FormLabel>
                <FormControl
                  type="date"
                  required
                  defaultValue={dayjs(cycle.endDate).utc().format(DATE_FORMAT_PROPS)}
                  min={dayjs(cycle.startDate).format(DATE_FORMAT_PROPS)}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>{t('countryFieldLabel')}</FormLabel>
                <AsyncTypeahead
                  id="create-work--search-country"
                  // Bypass client-side filtering. Results are already filtered by the search endpoint
                  filterBy={() => true}
                  // inputProps={{ required: true }}
                  // placeholder={t('addWrkTypeaheadPlaceholder')}
                  ref={typeaheadRefOC}
                  isLoading={isCountriesSearchLoading}
                  labelKey={(res) => `${res.label}`}
                  minLength={2}
                  onSearch={handleSearchCountry}
                  options={countrySearchResults}
                  onChange={handleSearchCountrySelect}
                  placeholder={namespace && cycle.countryOfOrigin ? namespace[cycle.countryOfOrigin] : ''}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
              <FormGroup controlId="description">
                <FormLabel>*{t('newCyclePitchLabel')}</FormLabel>
                {/* <FormControl defaultValue={cycle.contentText as string} as="textarea" rows={5} required /> */}
                {/* @ts-ignore*/}
                <EditorCmp
                  apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
                  onInit={(_: any, editor) => {
                    editorRef.current = editor;
                  }}
                  initialValue={cycle.contentText!}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
                      'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount', 'emoticons'
                    ],
                    emoticons_database: 'emojiimages',
                    relative_urls: false,
                    forced_root_block : "div",
                    toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link | emoticons  | help',
                    // toolbar:
                    //   'undo redo | formatselect | ' +
                    //   'bold italic backcolor | alignleft aligncenter ' +
                    //   'alignright alignjustify | bullist numlist outdent indent | ' +
                    //   'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group className={`${styles.cycleAccesForGroup}`}>
                <Form.Label className="h5">{t('Privacy settings')}</Form.Label>
                <Form.Check
                  label={t('Public')}
                  type="radio"
                  onChange={() => handlerCycleAccessCheckedChange('public')}
                  checked={cycleAccessChecked.public}
                />
                <small className="ms-3 text-muted">{t('cycleAccesPublicInfo')}.</small>
                <Form.Check
                  label={t('Private')}
                  type="radio"
                  onChange={() => handlerCycleAccessCheckedChange('private')}
                  checked={cycleAccessChecked.private}
                />
                <small className="ms-3 text-muted">{t('cycleAccesPrivateInfo')}.</small>
                <Form.Check
                  label={t('Secret')}
                  type="radio"
                  onChange={() => handlerCycleAccessCheckedChange('secret')}
                  checked={cycleAccessChecked.secret}
                />
                <small className="ms-3 text-muted">{t('cycleAccesSecretInfo')}.</small>
                <Form.Check
                  label={t('Payment')}
                  type="radio"
                  onChange={() => handlerCycleAccessCheckedChange('payment')}
                  checked={cycleAccessChecked.payment}
                />
                {/* <small className="ms-3 text-muted">{t('cycleAccesPaymentInfo')}.</small> */}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex justify-content-end mt-4 mb-2'>
               {/*<Button
               variant="warning"
                //onClick={handleFormClear}
                className="text-white me-3 mt-3"
                style={{ width: '10em' }}
              >
                {t('resetBtnLabel')}
              </Button>*/}
              <Button
                disabled={isEditCycleReqLoading}
                type="submit"
                className=" btn-eureka mt-3"
                style={{ width: '10em' }}
              >
                <>
                  {t('Edit Cycle')}
                  {isEditCycleReqLoading && (
                    <Spinner animation="grow" variant="info" className={styles.loadIndicator} />
                  )}
                </>
              </Button>
           
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default EditCycleForm;
