import { LocalImage, Work } from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
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

import { DATE_FORMAT_PROPS } from '../../constants';
import { CreateCycleClientPayload } from '../../types';
import LocalImageComponent from '../LocalImage';
import ImageSelectInput from './ImageSelectInput';
import WorkSummary from '../work/WorkSummary';
import styles from './CreateCycleForm.module.css';

type WorkSearchResult = (Work & { localImages: LocalImage[] })[];

interface Props {
  className?: string;
}

const CreateCycleForm: FunctionComponent<Props> = ({ className }) => {
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const [addWorkModalOpened, setAddWorkModalOpened] = useState(false);
  const [postSearchLoading, setWorkSearchLoading] = useState(false);
  const [workSearchOptions, setWorkSearchResult] = useState<WorkSearchResult>([]);
  const [selectedWorksForCycle, setSelectedWorksForCycle] = useState<WorkSearchResult>([]);
  const [cycleCoverImageFile, setCycleCoverImageFile] = useState<File | null>(null);

  const router = useRouter();
  const [
    execCreateCycle,
    {
      error: createCycleReqError,
      isLoading: isCreateCycleReqLoading,
      isError: isCreateCycleReqError,
      isSuccess: isCreateCycleReqSuccess,
    },
  ] = useMutation(async (payload: CreateCycleClientPayload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) {
        switch (key) {
          case 'includedWorksIds':
            value.forEach((val: number) => formData.append(key, String(val)));
            break;
          default:
            formData.append(key, value);
            break;
        }
      }
    });

    const res = await fetch('/api/cycle', {
      method: 'POST',
      body: formData,
    });

    return res.json();
  });

  const handleAddWorkBegin = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setAddWorkModalOpened(true);
  };

  const handleAddWorkModalClose = () => {
    setAddWorkModalOpened(false);
  };

  const handleWorkSearch = async (query: string) => {
    setWorkSearchLoading(true);

    const response = await fetch(`/api/work?q=${query}`);
    const items: (Work & { localImages: LocalImage[] })[] = await response.json();

    setWorkSearchResult(items);
    setWorkSearchLoading(false);
  };

  const handleWorkSearchSelect = (selected: WorkSearchResult): void => {
    if (selected[0] != null) {
      setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
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
      form.cycleLanguage.value = '';
      form.cycleHashtags.value = '';
      form.cycleStartDate.value = '';
      form.cycleEndDate.value = '';
      form.cycleDescription.value = '';
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
    };

    await execCreateCycle(payload);
  };

  const chosenWorksBoxes = [0, 1, 2, 3, 4];

  useEffect(() => {
    if (isCreateCycleReqSuccess) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateCycleReqSuccess]);

  return (
    <>
      <Form onSubmit={handleSubmit} ref={formRef} className={className}>
        <h4 className="mt-2 mb-4">Create a Cycle</h4>

        <Row className="mb-5">
          <Col md={{ span: 8 }}>
            <Row className="mb-4">
              <Col>
                <button
                  className={classNames(styles.outlinedBlock, styles.addWorkButton)}
                  type="button"
                  onClick={handleAddWorkBegin}
                >
                  <h4>*Add work to a cycle</h4>
                  <p>Search for work in our library</p>
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
                <ImageSelectInput
                  acceptedFileTypes="image/*"
                  file={cycleCoverImageFile}
                  setFile={setCycleCoverImageFile}
                  required
                >
                  {(imagePreview) => (
                    <div className={classNames(styles.outlinedBlock)}>
                      {imagePreview == null ? (
                        <div className={styles.cycleCoverPrompt}>
                          <h4>*Add cover image to cycle</h4>
                          <p>Tips on choose a good image:</p>
                          <ul>
                            <li>Look for an image that illustrates the main topic of the cycle</li>
                            <li>
                              Please choose images under Creative Commons licenses. We recommend searching on Unsplash,
                              Flickr, etc.
                            </li>
                            <li>Ideal size: 250 x 250px</li>
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
                </ImageSelectInput>
              </Col>
              <Col />
            </Row>
          </Col>
          <Col md={{ span: 4 }}>
            <FormGroup controlId="cycleTitle">
              <FormLabel>*Title of your cycle (80 characters max)</FormLabel>
              <FormControl type="text" maxLength={80} required />
            </FormGroup>
            <FormGroup controlId="languages">
              <FormLabel>*Main language of the cycle</FormLabel>
              <FormControl type="text" as="select" required>
                <option value="">select...</option>
                <option value="spanish">Spanish</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="portuguese">Portuguese</option>
                <option value="bengali">Bengali</option>
                <option value="russian">Russian</option>
                <option value="japanese">Japanese</option>
                <option value="german">German</option>
                <option value="french">French</option>
              </FormControl>
            </FormGroup>
            <FormGroup controlId="topics">
              <FormLabel>Main topics of the cycle</FormLabel>
              <FormControl type="text" disabled />
            </FormGroup>
            <FormGroup controlId="startDate">
              <FormLabel>*Start date of the cycle</FormLabel>
              <FormControl type="date" required defaultValue={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="endDate">
              <FormLabel>*End date of the cycle</FormLabel>
              <FormControl type="date" required min={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="description">
              <FormLabel>
                *Cycle pitch: what is this cycle about and why is it a relevant topic. Why should people join this
                cycle?
              </FormLabel>
              <FormControl as="textarea" rows={5} required />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormCheck type="checkbox" defaultChecked inline id="isPublic" label="This cycle is public" />
          </Col>
          <Col>
            <Button
              disabled={!selectedWorksForCycle.length || !cycleCoverImageFile}
              variant="primary"
              type="submit"
              className="float-right pl-5 pr-4"
            >
              Create cycle
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
              Clear
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal show={addWorkModalOpened} onHide={handleAddWorkModalClose} animation={false}>
        <ModalHeader closeButton>
          <ModalTitle>Add work to cycle</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Row className="mb-5">
            <Col>
              <FormGroup controlId="cycle">
                <FormLabel>Select work:</FormLabel>

                {/* language=CSS */}
                <style jsx global>{`
                  .rbt-menu {
                    min-width: 550px;
                    background-color: #d0f7ed;
                    left: -1px !important;
                  }
                `}</style>
                <AsyncTypeahead
                  filterBy={
                    () => true /* Bypass client-side filtering. Results are already filtered by the search endpoint */
                  }
                  id="post-search-in-cycle"
                  inputProps={{ id: 'workTitle', required: true }}
                  isLoading={postSearchLoading}
                  minLength={2}
                  labelKey={(option) => `${option.title}`}
                  onSearch={handleWorkSearch}
                  onChange={handleWorkSearchSelect}
                  options={workSearchOptions}
                  placeholder="Search for existing work... (press ENTER to add to cycle)"
                  renderMenuItemChildren={(work) => (
                    <div className={styles.workSearchTypeaheadItem}>
                      <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
                      <div>
                        <h3>
                          {work.title} <small>({work.type})</small>
                        </h3>
                        <h4>{work.author}</h4>
                        <hr />
                        <WorkSummary work={work} />
                      </div>
                    </div>
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateCycleForm;
