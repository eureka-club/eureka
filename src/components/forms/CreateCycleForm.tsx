import classNames from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { ChangeEvent, FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, ButtonGroup, ListGroup, FormFile, Modal, Row, Spinner } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { BiTrash, BiPlus, BiEdit } from 'react-icons/bi';
import { GiCancel } from 'react-icons/gi';

import { Prisma } from '@prisma/client';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { useAtom } from 'jotai';
import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import Skeleton from '../Skeleton';

import globalModals from '../../atoms/globalModals';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { DATE_FORMAT_PROPS, DATE_FORMAT_SHORT_MONTH_YEAR } from '../../constants';
import { ComplementaryMaterial, CreateCycleClientPayload } from '../../types/cycle';
import { WorkMosaicItem } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import styles from './CreateCycleForm.module.css';
import TagsInput from './controls/TagsInput';
import useTopics from '../../useTopics';

interface Props {
  className?: string;
}

const COMPLEMENTARY_MATERIAL_MAX_SINGLE_FILE_SIZE = 1024 * 1024 * 10;

/*
 * This component grown oversize 😔
 * At-least "Complementary content" modal should be separated into own file.
 */
const CreateCycleForm: FunctionComponent<Props> = ({ className }) => {
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModals);

  const [addWorkModalOpened, setAddWorkModalOpened] = useState(false);
  const [isWorkSearchLoading, setIsWorkSearchLoading] = useState(false);
  const [workSearchResults, setWorkSearchResults] = useState<WorkMosaicItem[]>([]);
  const [workSearchHighlightedOption, setWorkSearchHighlightedOption] = useState<WorkMosaicItem | null>(null);
  const [selectedWorksForCycle, setSelectedWorksForCycle] = useState<WorkMosaicItem[]>([]);
  const [enableWorksDisscussionsDates, setEnableWorksDisscussionsDates] = useState<boolean>(true);
  const [selectedWorksForCycleDates, setSelectedWorksForCycleDates] = useState<{
    [key: number]: { startDate?: string; endDate?: string; isInvalidStartDate?: boolean; isInvalidEndDate?: boolean };
  }>({});

  const typeaheadRef = useRef<AsyncTypeahead<WorkMosaicItem>>(null);
  const typeaheadRefOC = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
  const [countryOrigin, setCountryOrigin] = useState<string>();
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);
  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [cycleCoverImageFile, setCycleCoverImageFile] = useState<File | null>(null);

  const [addComplementaryMaterialModalOpened, setAddComplementaryMaterialModalOpened] = useState(false);
  const [complementaryMaterialFile, setComplementaryMaterialFile] = useState<File | null>(null);
  const [complementaryMaterialFileOversizeError, setComplementaryMaterialFileOversizeError] = useState(false);
  const [complementaryMaterials, setComplementaryMaterials] = useState<ComplementaryMaterial[]>([]);
  const [guidelines, setGuidelines] = useState<Prisma.GuidelineCreateWithoutCycleInput[]>([]);
  const [guidelineTitle, setGuidelineTitle] = useState<string>();
  const [guidelineContentText, setGuidelineContentText] = useState<string>();
  const [guidelineEditIdx, setGuidelineEditIdx] = useState<number>();

  const editorRef = useRef<any>(null);

  const [tags, setTags] = useState<string>('');
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

  const { data: topics } = useTopics();

  const {
    mutate: execCreateCycle,
    data: newCycleData,
    error: createCycleReqError,
    isLoading: isCreateCycleReqLoading,
    isError: isCreateCycleReqError,
    isSuccess: isCreateCycleReqSuccess,
  } = useMutation(async (payload: CreateCycleClientPayload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) {
        switch (key) {
          case 'includedWorksIds':
            value.forEach((val: number) => formData.append(key, String(val)));
            break;
          case 'complementaryMaterials':
            value.forEach((cm: ComplementaryMaterial, idx: number) => {
              Object.entries(cm).forEach(([cmFieldName, cmFieldValue]) => {
                if (cmFieldValue != null) {
                  formData.append(`CM${idx}_${cmFieldName}`, cmFieldValue);
                }
              });
            });
            break;
          case 'guidelines':
            formData.append(key, JSON.stringify(value));
            break;
          case 'cycleWorksDates':
            formData.append(
              key,
              JSON.stringify(
                Object.entries<{ [key: string]: { startDate?: string; endDate?: string } }>(value).map((v) => {
                  return { workId: v[0], startDate: v[1].startDate, endDate: v[1].endDate };
                }),
              ),
            );
            break;
          default:
            formData.append(key, value);
            break;
        }
      }
    });
    formData.append('tags', tags);
    const res = await fetch('/api/cycle', {
      method: 'POST',
      body: formData,
    });

    return res.json();
  });

  const router = useRouter();
  const { t } = useTranslation('createCycleForm');

  const handleAddWorkClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setWorkSearchHighlightedOption(null);
    setAddWorkModalOpened(true);
    setTimeout(() => typeaheadRef.current?.focus());
  };

  const handleAddComplementaryContentClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setComplementaryMaterialFile(null);
    setComplementaryMaterialFileOversizeError(false);
    setAddComplementaryMaterialModalOpened(true);
  };

  const handleAddWorkModalClose = () => {
    setAddWorkModalOpened(false);
  };

  const handleAddComplementaryMaterialModalClose = () => {
    setAddComplementaryMaterialModalOpened(false);
  };

  const handleComplementaryMaterialFileInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
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

  const handleAddComplementaryMaterialFormSubmit = (ev: FormEvent<HTMLFormElement>) => {
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

  const handleRemoveComplementaryMaterial = (cm: ComplementaryMaterial) => {
    setComplementaryMaterials(complementaryMaterials.filter((m) => m !== cm));
  };

  const handleSearchWork = async (query: string) => {
    setIsWorkSearchLoading(true);

    const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
    const response = await fetch(`/api/search/works?q=${query}&include=${includeQP}`);
    const itemsSW: WorkMosaicItem[] = await response.json();

    setWorkSearchResults(itemsSW);
    setIsWorkSearchLoading(false);
  };

  const handleSearchWorkHighlightChange = ({
    activeIndex,
    results,
  }: {
    activeIndex: number;
    results: WorkMosaicItem[];
  }) => {
    if (activeIndex !== -1) {
      // wait for component rendering with setTimeout(fn, undefinded)
      setTimeout(() => setWorkSearchHighlightedOption(results[activeIndex]));
    }
  };

  const handleSearchWorkSelect = (selected: WorkMosaicItem[]): void => {
    if (selected[0] != null) {
      setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
      // setSelectedWorksForCycleDates((res) => ({
      //   ...res,
      //   [`${selected[0].id}`]: {
      //     startDate: undefined,
      //     endDate: undefined,
      //   },
      // }));
      setAddWorkModalOpened(false);
    }
  };

  const handleWorkSearchAppend = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (workSearchHighlightedOption != null) {
      setSelectedWorksForCycle([...selectedWorksForCycle, workSearchHighlightedOption]);
      setAddWorkModalOpened(false);
    }
  };

  const handleRemoveSelectedPost = (boxId: number) => {
    setSelectedWorksForCycle(
      selectedWorksForCycle.filter((post, idx) => {
        return idx !== boxId;
      }),
    );
  };

  const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setSelectedWorksForCycle([]);
    setCycleCoverImageFile(null);
    editorRef.current.setContent('');
    if (formRef.current != null) {
      const form = formRef.current;

      form.cycleTitle.value = '';
      form.languages.value = '';
      form.topics.value = '';
      form.startDate.value = '';
      form.endDate.value = '';
      form.description.value = '';
    }
  };

  const validateWorkDates = (workId: number, startDate?: string, endDate?: string) => {
    const showToast = {
      type: 'warning',
      title: t('invalidInput'),
      message: t('cycleStartAndEndRequired'),
      show: true,
    };

    const setIsInvalidField = (fieldName: string) => {
      const obj = { ...selectedWorksForCycleDates[workId], isInvalidStartDate: false, isInvalidEndDate: false };
      if (fieldName === 'isInvalidStartDate') obj.isInvalidStartDate = true;
      else obj.isInvalidEndDate = true;

      setSelectedWorksForCycleDates((res) => ({
        ...res,
        [`${workId}`]: obj,
      }));
    };

    const form = formRef.current;
    if (form) {
      if (!form.startDate.value) {
        setGlobalModalsState({
          ...globalModalsState,
          showToast,
        });
        return false;
      }
      if (!form.endDate.value) {
        setGlobalModalsState({
          ...globalModalsState,
          showToast,
        });
        return false;
      }

      const cycleStartDate = dayjs(form.startDate.value);
      const cycleEndDate = dayjs(form.endDate.value);

      if (startDate) {
        if (cycleStartDate.isAfter(dayjs(startDate))) {
          showToast.message = t('Date Range Error');
          setGlobalModalsState({
            ...globalModalsState,
            showToast,
          });
          setIsInvalidField('isInvalidStartDate');
          return false;
        }
        if (cycleEndDate.isBefore(dayjs(startDate))) {
          showToast.message = t('Date Range Error');
          setGlobalModalsState({
            ...globalModalsState,
            showToast,
          });
          return false;
        }
      }
      if (endDate) {
        if (cycleStartDate.isAfter(dayjs(endDate))) {
          showToast.message = t('Date Range Error');
          setGlobalModalsState({
            ...globalModalsState,
            showToast,
          });
          setIsInvalidField('isInvalidEndDate');
          return false;
        }
        if (cycleEndDate.isBefore(dayjs(endDate))) {
          showToast.message = t('Date Range Error');
          setGlobalModalsState({
            ...globalModalsState,
            showToast,
          });
          setIsInvalidField('isInvalidEndDate');
          return false;
        }
      }
    }
    return true;
  };

  // const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const worksDisscussionsDates = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!selectedWorksForCycle.length || !cycleCoverImageFile) {
      return;
    }

    const form = ev.currentTarget;
    const payload: CreateCycleClientPayload = {
      includedWorksIds: selectedWorksForCycle.map((work) => work.id),
      coverImage: cycleCoverImageFile,
      title: form.cycleTitle.value,
      languages: form.languages.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      countryOfOrigin: countryOrigin,
      contentText: editorRef.current.getContent(), // ;form.description.value,
      complementaryMaterials,
      guidelines,
      topics: items.join(','),
      access: access || 1,
      cycleWorksDates: selectedWorksForCycleDates,
    };

    let hasInvalidDates = false;
    Object.keys(selectedWorksForCycleDates).forEach((key: string) => {
      const workId = parseInt(key, 10);
      const i: { startDate?: string; endDate?: string } = selectedWorksForCycleDates[workId];
      if (!validateWorkDates(workId, i.startDate, i.endDate)) {
        hasInvalidDates = true;
        worksDisscussionsDates.current!.scrollIntoView();
      }
    });
    if (hasInvalidDates) return;

    await execCreateCycle(payload);
  };

  const chosenWorksBoxes = [0, 1, 2, 3, 4];

  useEffect(() => {
    if (isCreateCycleReqSuccess && newCycleData != null) {
      router.push(`/cycle/${newCycleData.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateCycleReqSuccess, newCycleData]);

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

  const cancelEditGuideline = () => {
    setGuidelineTitle('');
    setGuidelineContentText('');
    setGuidelineEditIdx(undefined);
  };

  const addGuideline = () => {
    if (guidelineTitle && guidelineContentText) {
      const gl = {
        title: guidelineTitle,
        contentText: guidelineContentText,
      };
      if (guidelineEditIdx === undefined) setGuidelines((res) => [...res, gl]);
      else guidelines.splice(guidelineEditIdx, 1, gl);

      setGuidelineTitle('');
      setGuidelineContentText('');
      setGuidelineEditIdx(undefined);
    }
  };

  const editGuidelineHandler = (idx: number) => {
    setGuidelineTitle(() => guidelines[idx].title);
    setGuidelineContentText(() => guidelines[idx].contentText!);
    setGuidelineEditIdx(idx);
  };

  // const editGuideline = () => {
  //   debugger;
  //   if (guidelineEditIdx !== undefined) {
  //     // const gl = [...guidelines];
  //     // gl[guidelineEditIdx] =
  //     setGuidelineTitle(() => guidelines[guidelineEditIdx].title);
  //     setGuidelineContentText(() => guidelines[guidelineEditIdx].contentText!);

  //     guidelines.splice(guidelineEditIdx, 1, {
  //       title: guidelineTitle,
  //       contentText: guidelineContentText,
  //     });
  //     setGuidelines(() => guidelines);
  //     setGuidelineTitle('');
  //     setGuidelineContentText('');
  //     setGuidelineEditIdx(undefined);
  //   }
  // };

  const removeGuideline = (idx: number) => {
    const res = [...guidelines];
    res.splice(idx, 1);
    setGuidelines(() => res);
  };

  const handlerSelectedWorksForCycleStartDate = (e: ChangeEvent<HTMLInputElement>, workId: number) => {
    setSelectedWorksForCycleDates((res) => {
      const o = { ...res[workId], startDate: e.target.value };
      res[workId] = o;
      return res;
    });
  };

  const handlerSelectedWorksForCycleEndDate = (e: ChangeEvent<HTMLInputElement>, workId: number) => {
    setSelectedWorksForCycleDates((res) => {
      const o = { ...res[workId], endDate: e.target.value };
      res[workId] = o;
      return res;
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit} ref={formRef} className={className}>
        <h4 className="mt-2 mb-4">{t('createCycle')}</h4>

        <Row className="mb-5">
          <Col md={{ span: 8 }}>
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
            {/* <Row> */}
            <Form.Check
              checked={enableWorksDisscussionsDates}
              name="terms"
              label={t('addDatesForWork')}
              onChange={(e) => {
                setEnableWorksDisscussionsDates(e.currentTarget.checked);
              }}
              feedbackTooltip
            />

            {/* </Row> */}
            <Row className="mb-4">
              {chosenWorksBoxes.map((boxId) => (
                <Col md={3} key={boxId}>
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
                  {enableWorksDisscussionsDates && selectedWorksForCycle[boxId] && (
                    <div className={styles.worksDisscussionsDates} ref={worksDisscussionsDates}>
                      <Form.Group className="" controlId={`work${boxId}StartDate`}>
                        <Form.Label>{`${t('Start date of work')}`}</Form.Label>
                        <Form.Control
                          type="date"
                          isInvalid={
                            selectedWorksForCycleDates[selectedWorksForCycle[boxId].id]
                              ? selectedWorksForCycleDates[selectedWorksForCycle[boxId].id].isInvalidStartDate
                              : false
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handlerSelectedWorksForCycleStartDate(e, selectedWorksForCycle[boxId].id)
                          }
                        />
                      </Form.Group>
                      <Form.Group className="" controlId={`work${boxId}EndDate`}>
                        <Form.Label>{t('End date of work')}</Form.Label>
                        <Form.Control
                          type="date"
                          isInvalid={
                            selectedWorksForCycleDates[selectedWorksForCycle[boxId].id]
                              ? selectedWorksForCycleDates[selectedWorksForCycle[boxId].id].isInvalidEndDate
                              : false
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handlerSelectedWorksForCycleEndDate(e, selectedWorksForCycle[boxId].id)
                          }
                        />
                      </Form.Group>
                    </div>
                  )}
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
          <Col md={{ span: 4 }}>
            <Form.Group controlId="cycleTitle">
              <Form.Label>*{t('newCycleTitleLabel')}</Form.Label>
              <Form.Control type="text" maxLength={80} required />
            </Form.Group>
            <Form.Group controlId="topics">
              <Form.Label>{t('newCycleMainTopicsLabel')}</Form.Label>
              <TagsInputTypeAhead
                data={topics}
                items={items}
                setItems={setItems}
                labelKey={(res) => t(`topics:${res.code}`)}
                max={3}
              />
            </Form.Group>
            <Form.Group controlId="topics">
              <TagsInput tags={tags} setTags={setTags} label={t('newCycleTopicsLabel')} max={2} />
            </Form.Group>
            <Form.Group controlId="startDate">
              <Form.Label>*{t('newCycleStartDateLabel')}</Form.Label>
              <Form.Control type="date" required defaultValue={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>*{t('newCycleEndDateLabel')}</Form.Label>
              <Form.Control type="date" required min={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('countryFieldLabel')}</Form.Label>
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
                // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
              />
            </Form.Group>
            <Form.Group controlId="languages">
              <Form.Label>*{t('newCycleLanguageLabel')}</Form.Label>
              <LanguageSelect />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {/* <Form.Group controlId="description">
              <Form.Label>*{t('newCyclePitchLabel')}</Form.Label>
              <Form.Control as="textarea" rows={5} required />
            </Form.Group> */}
            <Form.Group controlId="description">
              <Form.Label>*{t('newCyclePitchLabel')}</Form.Label>
              <EditorCmp
                onInit={(_: any, editor) => {
                  editorRef.current = editor;
                }}
                // initialValue={newEureka.contentText}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  relative_urls: false,
                  toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link  | help',
                  // toolbar:
                  //   'undo redo | formatselect | ' +
                  //   'bold italic backcolor | alignleft aligncenter ' +
                  //   'alignright alignjustify | bullist numlist outdent indent | ' +
                  //   'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
            </Form.Group>
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
              <small className="ml-3 text-muted">{t('cycleAccesPublicInfo')}.</small>
              <Form.Check
                label={t('Private')}
                type="radio"
                onChange={() => handlerCycleAccessCheckedChange('private')}
                checked={cycleAccessChecked.private}
              />
              <small className="ml-3 text-muted">{t('cycleAccesPrivateInfo')}.</small>
              <Form.Check
                label={t('Secret')}
                type="radio"
                onChange={() => handlerCycleAccessCheckedChange('secret')}
                checked={cycleAccessChecked.secret}
              />
              <small className="ml-3 text-muted">{t('cycleAccesSecretInfo')}.</small>
            </Form.Group>
          </Col>
        </Row>
        <Row className={`mb-3 ${styles.guidelinesContainer}`}>
          <Col md={6} xs={12}>
            <h5>{t('Cycle guidelines')}</h5>
            <p className={`py-1 ${styles.cycleGuidelineInfo}`}>
              We consider that rules should be contextual. Thematic cycles are diverse: in terms of topic, context and
              community. To ensure that rules are relevant and culturally sensitive, each cycle has the ability to
              define its own guidelines, including what it means by ‘safe space’ and what classifies as harmful content.
              Of course, these must be generally aligned with our Manifesto.
            </p>
            <p className={`py-1 ${styles.cycleGuidelineInfo}`}>Please write below the guidelines for this cycle.</p>
            <Form.Group>
              <Form.Label>{t('Title')}</Form.Label>
              <Form.Control type="text" value={guidelineTitle} onChange={(e) => setGuidelineTitle(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t('Description')}</Form.Label>
              <Form.Control
                as="textarea"
                value={guidelineContentText}
                onChange={(e) => setGuidelineContentText(e.target.value)}
                rows={3}
              />
            </Form.Group>
            <ButtonGroup size="sm">
              <Button size="sm" onClick={addGuideline}>
                {guidelineEditIdx !== undefined ? <BiEdit /> : <BiPlus />}
              </Button>
              {guidelineEditIdx !== undefined && (
                <Button variant="secondary" size="sm" onClick={cancelEditGuideline}>
                  <GiCancel />
                </Button>
              )}
            </ButtonGroup>
          </Col>
          <Col md={6} xs={12} className="d-flex align-items-center">
            {(guidelines.length && (
              <ListGroup variant="flush">
                {guidelines.map((g, idx) => (
                  <ListGroup.Item key={`${g.title}${idx + 1}`}>
                    <h5>{g.title} </h5>
                    <p>{g.contentText}</p>
                    <ButtonGroup size="sm">
                      <Button variant="primary" onClick={() => editGuidelineHandler(idx)}>
                        <BiEdit />
                      </Button>
                      <Button size="sm" variant="warning" onClick={() => removeGuideline(idx)}>
                        <BiTrash />
                      </Button>
                    </ButtonGroup>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )) || <Skeleton type="list" lines={5} className="pt-3" />}
          </Col>
        </Row>
        <Row>
          <Col>
            {/* <FormCheck type="checkbox" defaultChecked inline id="isPublic" label={t('isPublicLabel')} /> */}
          </Col>
          <Col>
            <Button
              disabled={!selectedWorksForCycle.length || !cycleCoverImageFile}
              variant="primary"
              type="submit"
              className="float-right pl-5 pr-4"
            >
              {t('submitBtnLabel')}
              {isCreateCycleReqLoading ? (
                <Spinner animation="grow" variant="info" className={styles.loadIndicator} />
              ) : (
                <span className={styles.loadIndicator} />
              )}
              {isCreateCycleReqError && createCycleReqError}
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={handleFormClear}
              className="float-right mr-4 px-3"
            >
              {t('resetBtnLabel')}
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal show={addWorkModalOpened} onHide={handleAddWorkModalClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{t('addWrkPopupTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-5">
            <Col sm={{ span: 7 }}>
              <Form.Group controlId="cycle">
                <Form.Label>{t('addWrkTypeaheadLabel')}:</Form.Label>

                {/* language=CSS */}
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
              </Form.Group>
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
        </Modal.Body>
      </Modal>

      <Modal
        show={addComplementaryMaterialModalOpened}
        onHide={handleAddComplementaryMaterialModalClose}
        animation={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('addComplementaryMaterialPopupTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddComplementaryMaterialFormSubmit}>
            <Row>
              <Form.Group as={Col} controlId="complementaryMaterialTitle">
                <Form.Label>*{t('complementaryMaterialTitleFieldLabel')}</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="complementaryMaterialAuthor">
                <Form.Label>*{t('complementaryMaterialAuthorFieldLabel')}</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="complementaryMaterialPublicationDate">
                <Form.Label>*{t('complementaryMaterialPublicationDateFieldLabel')}</Form.Label>
                <Form.Control type="month" required />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="complementaryMaterialLink">
                <Form.Label>
                  {complementaryMaterialFile == null && '*'}
                  {t('complementaryMaterialLinkFieldLabel')}
                </Form.Label>
                <Form.Control type="text" placeholder="https://..." required={complementaryMaterialFile == null} />
              </Form.Group>
              <Col sm={{ span: 1 }}>
                <p className={styles.complementaryMaterialAlternativeText}>
                  <Trans i18nKey="createCycleForm:complementaryMaterialAlternativeText" components={[<br key="1" />]} />
                </p>
              </Col>
              <Form.Group as={Col} controlId="complementaryMaterialFile">
                <Form.Label>{t('complementaryMaterialFileFieldLabel')}</Form.Label>
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
              </Form.Group>
            </Row>

            <Row>
              <Col className="d-flex flex-row-reverse">
                <Button type="submit">{t('complementaryMaterialSubmitBtnLabel')}</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateCycleForm;
