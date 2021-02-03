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

import { DATE_FORMAT_DISPLAY, DATE_FORMAT_PROPS } from '../../constants';
import LocalImageComponent from '../LocalImage';
import WorkSummary from '../work/WorkSummary';
import { WorkDetail } from '../../types';
import styles from './CreateCycleForm.module.css';
import { CreatorDbObject } from '../../models/User';

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
  cycleContent: [NewPostPayload] | ExistingPostPayload[];
}

interface PostSearchOptions {
  workTitle: string;
  workAuthor: string;
  workType: string;
  postId: string;
  postLanguage: string;
  postContent: string;
  postCreatedAt: string;
  postCreator: string;
  localImagePath: string;
}

type WorkSearchResult = (Work & { localImages: LocalImage[] })[];

interface Props {
  className?: string;
}

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
  const [workSearchSelection, setWorkSearchSelection] = useState<WorkSearchResult>();
  const [selectedPostsForCycle, setSelectedPostsForCycle] = useState<WorkSearchResult>([]);

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
    setWorkSearchSelection(undefined);
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
      setWorkSearchSelection(selected[0]);
    } else {
      setWorkSearchSelection(undefined);
    }
  };

  const handleAddWork = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (workSearchSelection != null) {
      setSelectedPostsForCycle([...selectedPostsForCycle, workSearchSelection]);
      setAddWorkModalOpened(false);
    }
  };

  const handleRemoveSelectedPost = (boxId: number) => {
    setSelectedPostsForCycle(
      selectedPostsForCycle.filter((post, idx) => {
        return idx !== boxId;
      }),
    );
  };

  const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

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

    if (!selectedPostsForCycle.length) {
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
      cycleContent: selectedPostsForCycle.map((post) => ({ postId: post.postId })),
    };

    await execCreateNewCycle(payload);
  };

  const chosenPostsBoxes = [0, 1, 2, 3, 4];

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

            <div className={classNames(styles.chosenPosts, 'd-flex')}>
              {chosenPostsBoxes.map((boxId) => (
                <div key={boxId} className={styles.chosenPostsBox}>
                  {selectedPostsForCycle[boxId] && (
                    <>
                      <LocalImageComponent
                        filePath={selectedPostsForCycle[boxId].localImagePath}
                        alt={selectedPostsForCycle[boxId].workTitle}
                      />
                      <button
                        onClick={() => handleRemoveSelectedPost(boxId)}
                        type="button"
                        className={styles.chosenPostsBoxRemove}
                      >
                        <BiTrash />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            <FormCheck type="checkbox" defaultChecked inline id="isCyclePublic" label="Public?" />
          </Col>
          <Col md={{ span: 4 }}>
            <FormGroup controlId="cycleTitle">
              <FormLabel>Title of the Cycle</FormLabel>
              <FormControl type="text" required />
            </FormGroup>
            <FormGroup controlId="cycleLanguage">
              <FormLabel>Main language of the cycle</FormLabel>
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
              <FormControl type="text" required />
            </FormGroup>
            <FormGroup controlId="cycleStartDate">
              <FormLabel>Start date of the cycle</FormLabel>
              <FormControl type="date" required defaultValue={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="cycleEndDate">
              <FormLabel>End date of the cycle</FormLabel>
              <FormControl type="date" required min={dayjs(new Date()).format(DATE_FORMAT_PROPS)} />
            </FormGroup>
            <FormGroup controlId="cycleDescription">
              <FormLabel>Explain in a few words what cycle is about</FormLabel>
              <FormControl as="textarea" rows={5} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant="primary" type="submit" className="float-right pl-5 pr-4">
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
            <Col sm={{ span: 7 }}>
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
                  placeholder="Search for existing work..."
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
            <Col sm={{ span: 5 }}>
              <Button
                onClick={handleAddWork}
                variant="primary"
                block
                type="button"
                className={styles.addWorkModalButton}
              >
                Add work to cycle
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              {workSearchSelection && (
                <div className={styles.workSearchTypeaheadItem}>
                  <LocalImageComponent
                    filePath={workSearchSelection.localImagePath}
                    alt={workSearchSelection.workTitle}
                  />
                  <div>
                    <h4>
                      {workSearchSelection.workTitle} <small>by</small> {workSearchSelection.workAuthor}{' '}
                      <small>({workSearchSelection.workType})</small>
                    </h4>
                    <hr />
                    <p>
                      Post by <strong>{workSearchSelection.postCreator}</strong> at{' '}
                      {dayjs(workSearchSelection.postCreatedAt).format(DATE_FORMAT_DISPLAY)}{' '}
                      <small>({workSearchSelection.postLanguage})</small>
                    </p>
                    <article>{workSearchSelection.postContent}</article>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateCycleForm;
