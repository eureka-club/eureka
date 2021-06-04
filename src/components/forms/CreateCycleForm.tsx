import classNames from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { ChangeEvent, FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormFile from 'react-bootstrap/FormFile';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { BiTrash } from 'react-icons/bi';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { DATE_FORMAT_PROPS, DATE_FORMAT_SHORT_MONTH_YEAR } from '../../constants';
import { ComplementaryMaterial, CreateCycleClientPayload } from '../../types/cycle';
import { WorkWithImages } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import styles from './CreateCycleForm.module.css';
import TagsInput from './controls/TagsInput';

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

  const [addWorkModalOpened, setAddWorkModalOpened] = useState(false);
  const [isWorkSearchLoading, setIsWorkSearchLoading] = useState(false);
  const [workSearchResults, setWorkSearchResults] = useState<WorkWithImages[]>([]);
  const [workSearchHighlightedOption, setWorkSearchHighlightedOption] = useState<WorkWithImages | null>(null);
  const [selectedWorksForCycle, setSelectedWorksForCycle] = useState<WorkWithImages[]>([]);
  const typeaheadRef = useRef<AsyncTypeahead<WorkWithImages>>(null);

  const [cycleCoverImageFile, setCycleCoverImageFile] = useState<File | null>(null);

  const [addComplementaryMaterialModalOpened, setAddComplementaryMaterialModalOpened] = useState(false);
  const [complementaryMaterialFile, setComplementaryMaterialFile] = useState<File | null>(null);
  const [complementaryMaterialFileOversizeError, setComplementaryMaterialFileOversizeError] = useState(false);
  const [complementaryMaterials, setComplementaryMaterials] = useState<ComplementaryMaterial[]>([]);
  const [tags, setTags] = useState<string>('');
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
    const items: WorkWithImages[] = await response.json();

    setWorkSearchResults(items);
    setIsWorkSearchLoading(false);
  };

  const handleSearchWorkHighlightChange = ({
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

  const handleSearchWorkSelect = (selected: WorkWithImages[]): void => {
    if (selected[0] != null) {
      setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
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

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!selectedWorksForCycle.length || !cycleCoverImageFile) {
      return;
    }

    const form = ev.currentTarget;
    const payload: CreateCycleClientPayload = {
      includedWorksIds: selectedWorksForCycle.map((work) => work.id),
      coverImage: cycleCoverImageFile,
      isPublic: form.isPublic.checked,
      title: form.cycleTitle.value,
      languages: form.languages.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      contentText: form.description.value,
      complementaryMaterials,
    };

    await execCreateCycle(payload);
  };

  const chosenWorksBoxes = [0, 1, 2, 3, 4];

  useEffect(() => {
    if (isCreateCycleReqSuccess && newCycleData != null) {
      router.push(`/cycle/${newCycleData.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateCycleReqSuccess, newCycleData]);

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
          <Col md={{ span: 4 }}>
            <FormGroup controlId="cycleTitle">
              <FormLabel>*{t('newCycleTitleLabel')}</FormLabel>
              <FormControl type="text" maxLength={80} required />
            </FormGroup>
            <FormGroup controlId="languages">
              <FormLabel>*{t('newCycleLanguageLabel')}</FormLabel>
              <LanguageSelect />
            </FormGroup>
            <FormGroup controlId="topics">
              <TagsInput tags={tags} setTags={setTags} label={t('newCycleTopicsLabel')} />
            </FormGroup>
            <FormGroup controlId="startDate">
              <FormLabel>*{t('newCycleStartDateLabel')}</FormLabel>
              <FormControl type="date" required defaultValue={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="endDate">
              <FormLabel>*{t('newCycleEndDateLabel')}</FormLabel>
              <FormControl type="date" required min={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="description">
              <FormLabel>*{t('newCyclePitchLabel')}</FormLabel>
              <FormControl as="textarea" rows={5} required />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormCheck type="checkbox" defaultChecked inline id="isPublic" label={t('isPublicLabel')} />
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
                <Spinner animation="grow" variant="secondary" className={styles.loadIndicator} />
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
        <ModalHeader closeButton>
          <ModalTitle>{t('addWrkPopupTitle')}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Row className="mb-5">
            <Col sm={{ span: 7 }}>
              <FormGroup controlId="cycle">
                <FormLabel>{t('addWrkTypeaheadLabel')}:</FormLabel>

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
      </Modal>
    </>
  );
};

export default CreateCycleForm;
