import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { BsFillXCircleFill } from 'react-icons/bs';
import { useMutation } from 'react-query';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { SearchResult, isCycle, isWork } from '../../types';
import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload } from '../../types/post';
import { CycleWithImage } from '../../types/cycle';
import { WorkWithImage } from '../../types/work';
import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import CycleTypeaheadSearchItem from '../cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import homepageAtom from '../../atoms/homepage';
import styles from './CreatePostForm.module.css';

const CreatePostForm: FunctionComponent = () => {
  const [homepageState, setHomepageState] = useAtom(homepageAtom);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [searchCycleResults, setSearchCycleResults] = useState<CycleWithImage[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<CycleWithImage | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkWithImage | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const router = useRouter();

  const {
    mutate: execCreatePost,
    error: createPostError,
    isError: isCreatePostError,
    isLoading: isCreatePostLoading,
    isSuccess: isCreatePostSuccess,
  } = useMutation(async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value);
      }
    });

    const res = await fetch('/api/post', {
      method: 'POST',
      body: formData,
    });

    return res.json();
  });

  const handleSearchWorkOrCycle = async (query: string) => {
    setIsSearchWorkOrCycleLoading(true);

    const response = await fetch(`/api/search/work-or-cycle?q=${query}`);
    const items: SearchResult[] = await response.json();

    setSearchWorkOrCycleResults(items);
    setIsSearchWorkOrCycleLoading(false);
  };

  const handleSearchCycle = async (query: string) => {
    setIsSearchCycleLoading(true);

    const response = await fetch(`/api/search/cycle?q=${query}`);
    const items: CycleWithImage[] = await response.json();

    setSearchCycleResults(items);
    setIsSearchCycleLoading(false);
  };

  const handleSelectWorkOrCycle = (selected: SearchResult[]): void => {
    const searchResult = selected[0];
    if (searchResult != null) {
      if (isCycle(searchResult)) {
        setSelectedCycle(searchResult);
      }
      if (isWork(searchResult)) {
        setSelectedWork(searchResult);
      }
    }
  };

  const handleSelectCycle = (selected: CycleWithImage[]): void => {
    const searchResult = selected[0];
    if (searchResult != null) {
      setSelectedCycle(searchResult);
    }
  };

  const handleClearSelectedWork = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setSelectedWork(null);
  };

  const handleClearSelectedCycle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setSelectedCycle(null);
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (imageFile == null) {
      return;
    }

    const form = ev.currentTarget;
    if (selectedWork != null) {
      const payload: CreatePostAboutWorkClientPayload = {
        selectedCycleId: selectedCycle != null ? selectedCycle.id : null,
        selectedWorkId: selectedWork.id,
        title: form.postTitle.value,
        image: imageFile,
        language: form.language.value,
        contentText: form.description.value.length ? form.description.value : null,
        isPublic: form.isPublic.checked,
      };
      await execCreatePost(payload);
    } else if (selectedCycle != null) {
      const payload: CreatePostAboutCycleClientPayload = {
        selectedCycleId: selectedCycle.id,
        selectedWorkId: null,
        title: form.postTitle.value,
        image: imageFile,
        language: form.language.value,
        contentText: form.description.value.length ? form.description.value : null,
        isPublic: form.isPublic.checked,
      };
      await execCreatePost(payload);
    }
  };

  useEffect(() => {
    if (isCreatePostSuccess === true) {
      setHomepageState({ ...homepageState, ...{ createPostModalOpened: false } });
      router.push('/list/posts');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatePostSuccess]);

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <ModalHeader closeButton>
        <Container>
          <ModalTitle>Create a post</ModalTitle>
        </Container>
      </ModalHeader>

      <ModalBody>
        <Container>
          <Row>
            <Col>
              <FormGroup controlId="workOrCycle">
                <FormLabel>*What work or cycle is this post about?</FormLabel>
                {selectedWork != null ? (
                  <div className={styles.searchResult}>
                    <WorkTypeaheadSearchItem work={selectedWork} />
                    <button onClick={handleClearSelectedWork} type="button" className={styles.discardSearchResult}>
                      <BsFillXCircleFill />
                    </button>
                  </div>
                ) : selectedCycle != null ? (
                  <div className={styles.searchResult}>
                    <CycleTypeaheadSearchItem cycle={selectedCycle} />
                    <button onClick={handleClearSelectedCycle} type="button" className={styles.discardSearchResult}>
                      <BsFillXCircleFill />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* language=CSS */}
                    <style jsx global>{`
                      .rbt-menu {
                        background-color: #d0f7ed;
                        min-width: 468px;
                      }
                    `}</style>
                    <AsyncTypeahead
                      id="create-post--search-work-or-cycle"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      inputProps={{ required: true }}
                      placeholder="Search for Work or Cycle in our library..."
                      isLoading={isSearchWorkOrCycleLoading}
                      labelKey={(res: SearchResult) => `${res.title}`}
                      minLength={2}
                      onSearch={handleSearchWorkOrCycle}
                      options={searchWorkOrCycleResults}
                      onChange={handleSelectWorkOrCycle}
                      renderMenuItemChildren={(searchResult) => {
                        if (isCycle(searchResult)) {
                          return <CycleTypeaheadSearchItem cycle={searchResult} />;
                        }
                        if (isWork(searchResult)) {
                          return <WorkTypeaheadSearchItem work={searchResult} />;
                        }

                        return null;
                      }}
                    />
                  </>
                )}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="postTitle">
                <FormLabel>*Title of your post (80 characters max)</FormLabel>
                <FormControl type="text" maxLength={80} required />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <ImageFileSelect acceptedFileTypes="image/*" file={imageFile} setFile={setImageFile} required>
                {(imagePreview) => (
                  <FormGroup>
                    <FormLabel>*Add image to your post</FormLabel>
                    <div className={styles.imageControl}>
                      {(imageFile != null && imagePreview) != null ? (
                        <span className={styles.imageName}>{imageFile?.name}</span>
                      ) : (
                        'select file...'
                      )}
                      {imagePreview && <img src={imagePreview} className="float-right" alt="Work cover" />}
                    </div>
                  </FormGroup>
                )}
              </ImageFileSelect>
            </Col>
            <Col>
              <FormGroup controlId="language">
                <FormLabel>*Language of the post</FormLabel>
                <LanguageSelect />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={{ span: 6 }}>
              <FormGroup controlId="workOrCycle">
                <FormLabel>Add to cycle:</FormLabel>
                {!selectedCycle ? (
                  <>
                    {/* language=CSS */}
                    <style jsx global>{`
                      .rbt-input#create-post--search-cycle::placeholder {
                        font-size: 0.57rem;
                      }
                      .rbt-menu {
                        background-color: #d0f7ed;
                        min-width: 468px;
                      }
                    `}</style>
                    <AsyncTypeahead
                      id="create-post--search-cycle"
                      filterBy={() => true}
                      inputProps={{ id: 'create-post--search-cycle' }}
                      placeholder="Search Cycle to which post will be added (autoselected if post is about cycle)"
                      isLoading={isSearchCycleLoading}
                      labelKey={(res: SearchResult) => `${res.title}`}
                      minLength={2}
                      onSearch={handleSearchCycle}
                      options={searchCycleResults}
                      onChange={handleSelectCycle}
                      renderMenuItemChildren={(searchResult) => <CycleTypeaheadSearchItem cycle={searchResult} />}
                    />
                  </>
                ) : (
                  <div className={styles.searchResult}>
                    {selectedCycle !== null && <CycleTypeaheadSearchItem cycle={selectedCycle} />}
                    <button onClick={handleClearSelectedCycle} type="button" className={styles.discardSearchResult}>
                      <BsFillXCircleFill />
                    </button>
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <small style={{ color: 'lightgrey', position: 'relative', top: '-0.75rem' }}>
                By adding your post to a cycle, you will automatically become a participant of the cycle (if you
                aren&rsquo;t already).
              </small>
            </Col>
          </Row>
          <Row>
            <FormGroup controlId="description" as={Col}>
              <FormLabel>
                Write what you thought and / or learned from this work or cycle. Why did you find it interesting?
              </FormLabel>
              <FormControl as="textarea" rows={6} maxLength={4000} />
            </FormGroup>
          </Row>
        </Container>
      </ModalBody>

      <ModalFooter>
        <Container className="py-3">
          <Row>
            <Col>
              <FormCheck type="checkbox" defaultChecked inline id="isPublic" label="This post is public" />
            </Col>
            <Col>
              <Button variant="primary" type="submit" className="pl-5 pr-4 float-right">
                Create post
                {isCreatePostLoading ? (
                  <Spinner animation="grow" variant="secondary" className={styles.loadIndicator} />
                ) : (
                  <span className={styles.placeholder} />
                )}
                {isCreatePostError && createPostError}
              </Button>
            </Col>
          </Row>
        </Container>
      </ModalFooter>
    </Form>
  );
};

export default CreatePostForm;
