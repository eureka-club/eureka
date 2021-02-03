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
import LocalImageComponent from '../LocalImage';
import WorkSummary from '../work/WorkSummary';
import styles from './CreateCycleForm.module.css';

interface Props {
  className?: string;
}

interface ExistingPostPayload {
  postId: string;
}

interface NewPostPayload {
  image: File;
  workLink?: string;
  workTitle: string;
  workAuthor: string;
  hashtags: string;
  language: string;
  workType: string;
  description?: string;
  isPublic: string;
}

interface NewCyclePayload {
  cycleTitle: string;
  cycleLanguage: string;
  cycleHashtags: string;
  cycleDescription?: string;
  cycleStartDate: string;
  cycleEndDate: string;
  isCyclePublic: boolean;
}

type WorkSearchResult = (Work & { localImages: LocalImage[] })[];

const createCycleApiHandler = async (payload: NewCyclePayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value != null) {
      if (Array.isArray(value)) {
        value.forEach((valueEntry: NewPostPayload | ExistingPostPayload) => {
          Object.entries(valueEntry).forEach(([subKey, subValue]) => {
            if (subValue != null) {
              formData.append(subKey, subValue);
            }
          });
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  const res = await fetch('/api/cycle', {
    method: 'POST',
    body: formData,
  });

  return res.json();
};

const CreateCycleForm: FunctionComponent<Props> = ({ className }) => {
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const [addWorkModalOpened, setAddWorkModalOpened] = useState(false);
  const [postSearchLoading, setWorkSearchLoading] = useState(false);
  const [workSearchOptions, setWorkSearchResult] = useState<WorkSearchResult>([]);
  const [selectedWorksForCycle, setSelectedWorksForCycle] = useState<WorkSearchResult>([]);

  const router = useRouter();
  const [
    execCreateNewCycle,
    {
      data: createCycleReqResponse,
      error: createCycleReqError,
      isError: isCreateCycleReqError,
      isLoading: isCreateCycleReqLoading,
      isSuccess: isCreateCycleReqSuccess,
    },
  ] = useMutation(createCycleApiHandler);

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

    if (formRef.current == null) {
      return;
    }

    const form = formRef.current;

    form.cycleTitle.value = '';
    form.cycleLanguage.value = '';
    form.cycleHashtags.value = '';
    form.cycleStartDate.value = '';
    form.cycleEndDate.value = '';
    form.cycleDescription.value = '';
    setSelectedWorksForCycle([]);
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!selectedWorksForCycle.length) {
      return;
    }

    const form = ev.currentTarget;
    const payload: NewCyclePayload = {
      cycleTitle: form.cycleTitle.value,
      cycleLanguage: form.cycleLanguage.value,
      cycleHashtags: form.cycleHashtags.value,
      cycleStartDate: form.cycleStartDate.value,
      cycleEndDate: form.cycleEndDate.value,
      cycleDescription: form.cycleDescription.value.length ? form.cycleDescription.value : null,
      isCyclePublic: form.isCyclePublic.checked,
    };

    await execCreateNewCycle(payload);
  };

  const chosenWorksBoxes = [0, 1, 2, 3, 4];

  useEffect(() => {
    if (router != null && isCreateCycleReqSuccess && typeof createCycleReqResponse?.newCycleUuid === 'string') {
      (async () => {
        await router.push(`/cycle/${createCycleReqResponse.newCycleUuid}`);
      })();
    }
  }, [router, isCreateCycleReqSuccess, createCycleReqResponse]);

  return (
    <>
      <Form onSubmit={handleSubmit} ref={formRef} className={className}>
        <h4 className="mt-2 mb-4">Create a Cycle</h4>

        <Row className="mb-5">
          <Col md={{ span: 8 }}>
            <button type="button" onClick={handleAddWorkBegin} className={styles.addWorkButton}>
              <h4>*Add work to a cycle</h4>
              <p>Search for work in our library</p>
            </button>

            <div className={classNames(styles.chosenWorks, 'd-flex')}>
              {chosenWorksBoxes.map((boxId) => (
                <div key={boxId} className={styles.chosenWorksBox}>
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
              ))}
            </div>
          </Col>
          <Col md={{ span: 4 }}>
            <FormGroup controlId="cycleTitle">
              <FormLabel>*Title of your cycle (80 characters max)</FormLabel>
              <FormControl type="text" maxLength={80} required />
            </FormGroup>
            <FormGroup controlId="cycleLanguage">
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
            <FormGroup controlId="cycleHashtags">
              <FormLabel>Main topics of the cycle</FormLabel>
              <FormControl type="text" disabled />
            </FormGroup>
            <FormGroup controlId="cycleStartDate">
              <FormLabel>*Start date of the cycle</FormLabel>
              <FormControl type="date" required defaultValue={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="cycleEndDate">
              <FormLabel>*End date of the cycle</FormLabel>
              <FormControl type="date" required min={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="cycleDescription">
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
            <FormCheck type="checkbox" defaultChecked inline id="isCyclePublic" label="This cycle is public" />
          </Col>
          <Col>
            <Button
              disabled={!selectedWorksForCycle.length}
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
        <pre>{JSON.stringify(selectedWorksForCycle, null, 2)}</pre>
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
