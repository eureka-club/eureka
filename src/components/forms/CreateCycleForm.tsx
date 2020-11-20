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
import 'react-bootstrap-typeahead/css/Typeahead.css';

import LocalImage from '../LocalImage';
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
  const [addWorkModalOpened, setAddWorkModalOpened] = useState(true);
  const [postSearchLoading, setPostSearchLoading] = useState(false);
  const [postSearchOptions, setPostSearchOptions] = useState<PostSearchOptions[]>([]);
  const [postSearchSelection, setPostSearchSelection] = useState<PostSearchOptions>();

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

  const handleAddWork = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setAddWorkModalOpened(true);
  };

  const handleAddWorkModalClose = () => {
    setAddWorkModalOpened(false);
  };

  const handlePostSearch = async (query: string) => {
    setPostSearchLoading(true);

    const response = await fetch(`/api/work?q=title%3D${query}&all`);
    const items: (WorkDetail & CreatorDbObject)[] = await response.json();
    const options = items.map((work) => ({
      workTitle: work['work.title'],
      workAuthor: work['work.author'],
      workType: work['work.type'],
      postId: work['post.id'],
      postLanguage: work['post.language'],
      postContent: work['post.content_text'],
      postCreatedAt: work['post.created_at'],
      postCreator: work['creator.user_name'],
      localImagePath: work['local_image.stored_file'],
    }));

    setPostSearchOptions(options);
    setPostSearchLoading(false);
  };

  const handlePostSearchSelect = (selected: Array<PostSearchOptions>): void => {
    if (selected[0] != null) {
      setPostSearchSelection(selected[0]);
    } else {
      setPostSearchSelection(undefined);
    }
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

    const form = ev.currentTarget;
    const payload: NewCyclePayload = {
      cycleTitle: form.cycleTitle.value,
      cycleLanguage: form.cycleLanguage.value,
      cycleHashtags: form.cycleHashtags.value,
      cycleStartDate: form.cycleStartDate.value,
      cycleEndDate: form.cycleEndDate.value,
      cycleDescription: form.cycleDescription.value.length ? form.cycleDescription.value : null,
      isCyclePublic: form.isCyclePublic.checked,
      cycleContent: [
        { postId: '015A2F84-137C-4A6F-89F3-27FA674647FD' },
        { postId: '184AA581-9345-4912-87C2-46870E6A557D' },
      ],
    };

    await execCreateNewCycle(payload);
  };

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
            <button type="button" onClick={handleAddWork} className={styles.addWorkButton}>
              <h4>Add work to a cycle</h4>
              <p>
                Choose an existing post or
                <br />
                create a new post
              </p>
            </button>
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
              <FormControl type="date" required defaultValue={dayjs(new Date()).format('YYYY-MM-DD')} />
            </FormGroup>
            <FormGroup controlId="cycleEndDate">
              <FormLabel>End date of the cycle</FormLabel>
              <FormControl type="date" required min={dayjs(new Date()).format('YYYY-MM-DD')} />
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

      <Modal show={addWorkModalOpened} onHide={handleAddWorkModalClose} animation={false} size="lg">
        <ModalHeader closeButton>
          <ModalTitle>Add Work</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Row className="mb-5">
            <Col>
              <FormGroup controlId="cycle">
                <FormLabel>Choose existing post</FormLabel>

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
                  labelKey={(option) => `${option.workTitle}`}
                  onSearch={handlePostSearch}
                  onChange={handlePostSearchSelect}
                  options={postSearchOptions}
                  placeholder="Search for existing work..."
                  renderMenuItemChildren={(option) => (
                    <div className={styles.postSearchTypeaheadItem}>
                      <LocalImage filePath={option.localImagePath} alt={option.workTitle} />
                      <div>
                        <h4>
                          {option.workTitle} <small>by</small> {option.workAuthor} <small>({option.workType})</small>
                        </h4>
                        <hr />
                        <p>
                          Post by <strong>{option.postCreator}</strong> at{' '}
                          {dayjs(option.postCreatedAt).format('MMM D YYYY')} <small>({option.postLanguage})</small>
                        </p>
                        <article>{option.postContent}</article>
                      </div>
                    </div>
                  )}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              {postSearchSelection && (
                <div className={styles.postSearchTypeaheadItem}>
                  <LocalImage filePath={postSearchSelection.localImagePath} alt={postSearchSelection.workTitle} />
                  <div>
                    <h4>
                      {postSearchSelection.workTitle} <small>by</small> {postSearchSelection.workAuthor}{' '}
                      <small>({postSearchSelection.workType})</small>
                    </h4>
                    <hr />
                    <p>
                      Post by <strong>{postSearchSelection.postCreator}</strong> at{' '}
                      {dayjs(postSearchSelection.postCreatedAt).format('MMM D YYYY')}{' '}
                      <small>({postSearchSelection.postLanguage})</small>
                    </p>
                    <article>{postSearchSelection.postContent}</article>
                  </div>
                </div>
              )}
            </Col>
            <Col md={{ span: 3 }}>
              <Button variant="primary" type="button" className="float-right px-3">
                Add to cycle
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateCycleForm;
