// import classNames from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import Trans from 'next-translate/Trans';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
// import FormFile from 'react-bootstrap/FormFile';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
// import Modal from 'react-bootstrap/Modal';
// import ModalBody from 'react-bootstrap/ModalBody';
// import ModalHeader from 'react-bootstrap/ModalHeader';
// import ModalTitle from 'react-bootstrap/ModalTitle';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation, useQueryClient } from 'react-query';
// import { AsyncTypeahead } from 'react-bootstrap-typeahead';
// import { BiTrash } from 'react-icons/bi';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Cycle } from '@prisma/client';
import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import TagsInput from './controls/TagsInput';
import i18nConfig from '../../../i18n';
import useTopics from '../../useTopics';

import {
  DATE_FORMAT_PROPS,
  // DATE_FORMAT_SHORT_MONTH_YEAR
} from '../../constants';
import {
  CycleMosaicItem,
  // ComplementaryMaterial,
  EditCycleClientPayload,
} from '../../types/cycle';
// import { WorkWithImages } from '../../types/work';
// import LocalImageComponent from '../LocalImage';
// import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
// import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import styles from './CreateCycleForm.module.css';

interface Props {
  className?: string;
  cycle: Cycle;
}

// const COMPLEMENTARY_MATERIAL_MAX_SINGLE_FILE_SIZE = 1024 * 1024 * 10;

const EditCycleForm: FunctionComponent<Props> = ({ className, cycle }) => {
  const editorRef = useRef<any>(null);
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const { locale } = useRouter();

  // const [addWorkModalOpened, setAddWorkModalOpened] = useState(false);
  // const [isWorkSearchLoading, setIsWorkSearchLoading] = useState(false);
  // const [workSearchResults, setWorkSearchResults] = useState<WorkWithImages[]>([]);
  // const [workSearchHighlightedOption, setWorkSearchHighlightedOption] = useState<WorkWithImages | null>(null);
  // const [selectedWorksForCycle, setSelectedWorksForCycle] = useState<WorkWithImages[]>([]);
  // const typeaheadRef = useRef<AsyncTypeahead<WorkWithImages>>(null);

  // const [cycleCoverImageFile, setCycleCoverImageFile] = useState<File | null>(null);

  // const [addComplementaryMaterialModalOpened, setAddComplementaryMaterialModalOpened] = useState(false);
  // const [complementaryMaterialFile, setComplementaryMaterialFile] = useState<File | null>(null);
  // const [complementaryMaterialFileOversizeError, setComplementaryMaterialFileOversizeError] = useState(false);
  // const [complementaryMaterials, setComplementaryMaterials] = useState<ComplementaryMaterial[]>([]);
  const router = useRouter();
  const typeaheadRefOC = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
  const [countryOrigin, setCountryOrigin] = useState<string>();
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);
  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [tags, setTags] = useState<string>('');
  const [namespace, setNamespace] = useState<Record<string, string>>();
  const { data: topics } = useTopics();
  const [items, setItems] = useState<string[]>([]);
  const [access, setAccess] = useState<number | undefined>(1);
  const [cycleAccessChecked, setCycleAccessChecked] = useState<{
    public: boolean;
    private: boolean;
    secret: boolean;
  }>({
    private: false,
    public: false,
    secret: false,
  });
  const queryClient = useQueryClient()

  useEffect(() => {
    if (cycle) {
      const pc = cycle.access === 1;
      const pr = cycle.access === 2;
      const secret = cycle.access === 3;
      setCycleAccessChecked(() => ({ public: pc, private: pr, secret }));
    }
  }, [cycle]);

  useEffect(() => {
    setTags(cycle.tags!);
    const fn = async () => {
      const r = await i18nConfig.loadLocaleFrom(locale, 'countries');
      setNamespace(r);
    };
    fn();
    if (cycle.topics) items.push(...cycle.topics.split(','));
  }, []);

  const {
    mutate: execEditCycle,
    data: editedCycleData,
    error: editCycleReqError,
    isLoading: isEditCycleReqLoading,
    isError: isEditCycleReqError,
    isSuccess: isEditCycleReqSuccess,
  } = useMutation(async (payload: EditCycleClientPayload) => {
    const res = await fetch(`/api/cycle/${router.query.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },{
    onMutate(vars){
      const ck = ['CYCLE',`${router.query.id}`];
      queryClient.cancelQueries(ck)
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
      queryClient.invalidateQueries(['CYCLE',`${router.query.id}`])
    }
  });

  const { t } = useTranslation('createCycleForm');

  /* const handleAddWorkClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setWorkSearchHighlightedOption(null);
    setAddWorkModalOpened(true);
    // @ts-expect-error
    setTimeout(() => typeaheadRef.current?.focus());
  };
 */
  /* const handleAddComplementaryContentClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setComplementaryMaterialFile(null);
    setComplementaryMaterialFileOversizeError(false);
    setAddComplementaryMaterialModalOpened(true);
  };
 */
  /* const handleAddWorkModalClose = () => {
    setAddWorkModalOpened(false);
  };
 */
  /*    const handleAddComplementaryMaterialModalClose = () => {
    setAddComplementaryMaterialModalOpened(false);
  };
 */
  /*  const handleComplementaryMaterialFileInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { files } = ev.currentTarget;
    const file = files != null ? (files[0] != null ? files[0] : null) : null;

    setComplementaryMaterialFileOversizeError(false);

    if (file == null) {
      setComplementaryMaterialFile(null);
      return;
    }

    if (file.size > COMPLEMENTARY_MATERIAL_MAX_SINGLE_FILE_SIZE) {
      setComplementaryMaterialFileOversizeError(true);
    }

    setComplementaryMaterialFile(file);
  };
 */
  /* const handleAddComplementaryMaterialFormSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (complementaryMaterialFileOversizeError) {
      return;
    }

    const form = ev.currentTarget;
    const title = form.complementaryMaterialTitle.value;
    const author = form.complementaryMaterialAuthor.value;
    const publicationDate = form.complementaryMaterialPublicationDate.value;
    const link = form.complementaryMaterialLink.value.length ? form.complementaryMaterialLink.value : null;

    setComplementaryMaterials([
      ...complementaryMaterials,
      { title, author, publicationDate, link, file: complementaryMaterialFile },
    ]);
    setAddComplementaryMaterialModalOpened(false);
  };
  */
  /* const handleRemoveComplementaryMaterial = (cm: ComplementaryMaterial) => {
    setComplementaryMaterials(complementaryMaterials.filter((m) => m !== cm));
  };

  const handleSearchWork = async (query: string) => {
    setIsWorkSearchLoading(true);

    const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
    const response = await fetch(`/api/search/works?q=${query}&include=${includeQP}`);
    const items: WorkWithImages[] = await response.json();

    setWorkSearchResults(items);
    setIsWorkSearchLoading(false);
  };
  */
  /* const handleSearchWorkHighlightChange = ({
    activeIndex,
    results,
  }: {
    activeIndex: number;
    results: WorkWithImages[];
  }) => {
    if (activeIndex !== -1) {
      // wait for component rendering with setTimeout(fn, undefinded)
      setTimeout(() => setWorkSearchHighlightedOption(results[activeIndex]));
    }
  };
 */
  /* const handleSearchWorkSelect = (selected: WorkWithImages[]): void => {
    if (selected[0] != null) {
      setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
      setAddWorkModalOpened(false);
    }
  };
  */
  /* const handleWorkSearchAppend = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (workSearchHighlightedOption != null) {
      setSelectedWorksForCycle([...selectedWorksForCycle, workSearchHighlightedOption]);
      setAddWorkModalOpened(false);
    }
  };
  */
  /* const handleRemoveSelectedPost = (boxId: number) => {
    setSelectedWorksForCycle(
      selectedWorksForCycle.filter((post, idx) => {
        return idx !== boxId;
      }),
    );
  };
  */
  const handlerCycleAccessCheckedChange = (val: string) => {
    setCycleAccessChecked(() => ({
      private: false,
      public: false,
      secret: false,
    }));
    setAccess(() => {
      return { public: 1, private: 2, secret: 3 }[`${val}`];
    });
    setCycleAccessChecked((res) => ({ ...res, [`${val}`]: true }));
  };

  const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    // setSelectedWorksForCycle([]);
    // setCycleCoverImageFile(null);

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

    // if (!selectedWorksForCycle.length || !cycleCoverImageFile) {
    //   return;
    // }

    const form = ev.currentTarget;
    const payload: EditCycleClientPayload = {
      id: cycle.id,
      // includedWorksIds: selectedWorksForCycle.map((work) => work.id),
      // coverImage: cycleCoverImageFile,
      access: access || 1,
      title: form.cycleTitle.value,
      languages: form.languages.value,
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
      router.push(`/cycle/${router.query.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditCycleReqError, isEditCycleReqSuccess, editedCycleData]);

  // const handlerchange = (ev: ChangeEvent<HTMLInputElement>) => {
  //   if (cycle && ev.currentTarget.id in cycle) {
  //     const c: CycleMosaicItem = cycle;
  //     c[ev.currentTarget.id] = ev.currentTarget.value;
  //   }
  // };

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

  return (
    <>
      {cycle && (
        <Form onSubmit={handleSubmit} ref={formRef} className={className}>
          <h4 className="mt-2 mb-4">{t('Edit Cycle')}</h4>

          <Row className="mb-5">
            {/* <Col md={{ span: 8 }}>
              <Row className="mb-4">
                <Col>
                  <button
                    className={classNames(styles.outlinedBlock, styles.addWorkButton)}
                    type="button"
                    onClick={handleAddWorkClick}
                  >
                    <h4>*{t('addWrkBtnTitle')}</h4>
                    <p>{t('addWrkBtnSubtitle')}</p>
                  </button>
                </Col>
              </Row>
              <Row className="mb-4">
                {chosenWorksBoxes.map((boxId) => (
                  <Col key={boxId}>
                    <div className={classNames(styles.outlinedBlock, styles.chosenWorksBox)}>
                      {selectedWorksForCycle[boxId] && (
                        <>
                          <LocalImageComponent
                            filePath={selectedWorksForCycle[boxId].localImages[0].storedFile}
                            alt={selectedWorksForCycle[boxId].title}
                          />
                          <button
                            onClick={() => handleRemoveSelectedPost(boxId)}
                            type="button"
                            className={styles.chosenWorksBoxRemove}
                          >
                            <BiTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
              <Row>
                <Col>
                  <ImageFileSelect
                    acceptedFileTypes="image/*"
                    file={cycleCoverImageFile}
                    setFile={setCycleCoverImageFile}
                    required
                  >
                    {(imagePreview) => (
                      <div className={classNames(styles.outlinedBlock)}>
                        {imagePreview == null ? (
                          <div className={styles.cycleCoverPrompt}>
                            <h4>*{t('addCoverBtnTitle')}</h4>
                            <p>{t('addCoverTipLeadLine')}:</p>
                            <ul>
                              <li>{t('addCoverTipLine1')}</li>
                              <li>{t('addCoverTipLine2')}</li>
                              <li>{t('addCoverTipLine3')}</li>
                            </ul>
                          </div>
                        ) : (
                          <div
                            className={styles.cycleCoverPreview}
                            style={{ backgroundImage: `url('${imagePreview}')` }}
                          />
                        )}
                      </div>
                    )}
                  </ImageFileSelect>
                </Col>
                <Col>
                  <button
                    className={classNames(styles.outlinedBlock, styles.complementaryContentPrompt)}
                    type="button"
                    disabled={complementaryMaterials.length >= 3}
                    onClick={handleAddComplementaryContentClick}
                  >
                    <h4>{t('addComplementaryContentTitle')}</h4>
                    {complementaryMaterials.length ? (
                      <ul className={styles.complementaryMaterials}>
                        {complementaryMaterials.map((cm) => (
                          <li key={`${cm.author}-${cm.title}-${cm.publicationDate}`}>
                            {cm.author} · {cm.title} ({dayjs(cm.publicationDate).format(DATE_FORMAT_SHORT_MONTH_YEAR)})
                            <span
                              className={styles.removeComplementaryMaterial}
                              role="button"
                              tabIndex={0}
                              onKeyDown={() => handleRemoveComplementaryMaterial(cm)}
                              onClick={(ev) => {
                                ev.stopPropagation();
                                handleRemoveComplementaryMaterial(cm);
                              }}
                            >
                              &times;
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{t('addComplementaryContentDescription')}:</p>
                    )}
                  </button>
                </Col>
              </Row>
            </Col>
             */}
            <Col /* md={{ span: 12 }} */>
              <FormGroup controlId="cycleTitle">
                <FormLabel>*{t('newCycleTitleLabel')}</FormLabel>
                <FormControl type="text" maxLength={80} required defaultValue={cycle.title} />
              </FormGroup>
              <FormGroup controlId="languages">
                <FormLabel>*{t('newCycleLanguageLabel')}</FormLabel>
                <LanguageSelect defaultValue={cycle.languages} />
              </FormGroup>
              <FormGroup controlId="topics">
                <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel>
                <TagsInputTypeAhead
                  data={topics}
                  items={items}
                  setItems={setItems}
                  labelKey={(res) => t(`topics:${res.code}`)}
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
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                    ],
                    relative_urls: false,
                    forced_root_block : "p,a",
                    toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link  | help',
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
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                // disabled={!selectedWorksForCycle.length || !cycleCoverImageFile}
                variant="primary"
                type="submit"
                className="float-right ps-5 pe-4"
              >
                <>
                  {t('Edit Cycle')}
                  {isEditCycleReqLoading ? (
                    <Spinner animation="grow" variant="info" className={styles.loadIndicator} />
                  ) : (
                    <span className={styles.loadIndicator} />
                  )}
                  {isEditCycleReqError && editCycleReqError}
                </>
              </Button>
              <Button
                variant="outline-secondary"
                type="button"
                onClick={handleFormClear}
                className="float-right me-4 px-3"
              >
                {t('resetBtnLabel')}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
      {/* <Modal show={addWorkModalOpened} onHide={handleAddWorkModalClose} animation={false}>
        <ModalHeader closeButton>
          <ModalTitle>{t('addWrkPopupTitle')}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Row className="mb-5">
            <Col sm={{ span: 7 }}>
              <FormGroup controlId="cycle">
                <FormLabel>{t('addWrkTypeaheadLabel')}:</FormLabel>

                
                <style jsx global>{`
                  .rbt-menu {
                    background-color: #d0f7ed;
                    min-width: 468px;
                  }
                `}</style>
                <AsyncTypeahead
                  id="create-cycle--search-work"
                  // Bypass client-side filtering. Results are already filtered by the search endpoint
                  filterBy={() => true}
                  inputProps={{ required: true }}
                  placeholder={t('addWrkTypeaheadPlaceholder')}
                  ref={typeaheadRef}
                  isLoading={isWorkSearchLoading}
                  labelKey={(res) => `${res.title}`}
                  minLength={2}
                  onSearch={handleSearchWork}
                  options={workSearchResults}
                  onChange={handleSearchWorkSelect}
                  renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                >
                  {handleSearchWorkHighlightChange}
                </AsyncTypeahead>
              </FormGroup>
            </Col>
            <Col sm={{ span: 5 }}>
              <Button
                onClick={handleWorkSearchAppend}
                variant="primary"
                block
                type="button"
                className={styles.addWorkModalButton}
              >
                {t('addWrkAddBtnLabel')}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal
        show={addComplementaryMaterialModalOpened}
        onHide={handleAddComplementaryMaterialModalClose}
        animation={false}
        size="lg"
      >
        <ModalHeader closeButton>
          <ModalTitle>{t('addComplementaryMaterialPopupTitle')}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddComplementaryMaterialFormSubmit}>
            <Row>
              <FormGroup as={Col} controlId="complementaryMaterialTitle">
                <FormLabel>*{t('complementaryMaterialTitleFieldLabel')}</FormLabel>
                <FormControl type="text" required />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup as={Col} controlId="complementaryMaterialAuthor">
                <FormLabel>*{t('complementaryMaterialAuthorFieldLabel')}</FormLabel>
                <FormControl type="text" required />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup as={Col} controlId="complementaryMaterialPublicationDate">
                <FormLabel>*{t('complementaryMaterialPublicationDateFieldLabel')}</FormLabel>
                <FormControl type="month" required />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup as={Col} controlId="complementaryMaterialLink">
                <FormLabel>
                  {complementaryMaterialFile == null && '*'}
                  {t('complementaryMaterialLinkFieldLabel')}
                </FormLabel>
                <FormControl type="text" placeholder="https://..." required={complementaryMaterialFile == null} />
              </FormGroup>
              <Col sm={{ span: 1 }}>
                <p className={styles.complementaryMaterialAlternativeText}>
                  <Trans i18nKey="createCycleForm:complementaryMaterialAlternativeText" components={[<br key="1" />]} />
                </p>
              </Col>
              <FormGroup as={Col} controlId="complementaryMaterialFile">
                <FormLabel>{t('complementaryMaterialFileFieldLabel')}</FormLabel>
                <FormFile
                  custom
                  onChange={handleComplementaryMaterialFileInputChange}
                  label={
                    complementaryMaterialFile != null ? (
                      <>
                        <small>[{Math.round((complementaryMaterialFile.size / 1024 / 1024) * 10) / 10}MB]</small>{' '}
                        {complementaryMaterialFile.name}
                      </>
                    ) : (
                      ''
                    )
                  }
                  isInvalid={complementaryMaterialFileOversizeError}
                  feedback={t('complementaryMaterialFileOversizeError')}
                />
              </FormGroup>
            </Row>
            <Row>
              <Col className="d-flex flex-row-reverse">
                <Button type="submit">{t('complementaryMaterialSubmitBtnLabel')}</Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal> */}
    </>
  );
};

export default EditCycleForm;
