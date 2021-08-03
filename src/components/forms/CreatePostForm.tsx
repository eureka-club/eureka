import { Post } from '@prisma/client';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
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
import { useMutation, useQueryClient } from 'react-query';

import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../../types';
import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload } from '../../types/post';
import { CycleWithImages } from '../../types/cycle';
import { WorkWithImages } from '../../types/work';
import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import CycleTypeaheadSearchItem from '../cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreatePostForm.module.css';
import useTopics from '../../useTopics';
import useWorks from '../../useWorks';

const CreatePostForm: FunctionComponent = () => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [searchCycleResults, setSearchCycleResults] = useState<CycleWithImages[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<CycleWithImages | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkWithImages | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const queryClient = useQueryClient();
  const router = useRouter();

  // const [workId, setWorkId] = useState<string | undefined>();
  const { data: work } = useWorks(router.query.id as string);

  // useEffect(() => {
  //   if (router) {
  //     const routeValues = router.route.split('/').filter((i) => i);
  //     if (routeValues.length) {
  //       if (routeValues[0] === 'work') {
  //         setWorkId(router.query.id as string);
  //       }
  //     }
  //   }
  // }, [router, router.query.id]);

  useEffect(() => {
    if (work) setSelectedWork(work);
  }, [work]);

  const { t } = useTranslation('createPostForm');

  const { data: topics } = useTopics();
  const [postId, setPostId] = useState<number | undefined>();
  const {
    mutate: execCreatePost,
    data: createdPost,
    error: createPostError,
    isError: isCreatePostError,
    isLoading: isCreatePostLoading,
    isSuccess: isCreatePostSuccess,
    status,
  } = useMutation(
    async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload): Promise<Post | null> => {
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

      const json = await res.json();
      if (json.ok) {
        setPostId(json.id);
        return json.post;
      }
      return null;
    },
  );

  const handleSearchWorkOrCycle = async (query: string) => {
    setIsSearchWorkOrCycleLoading(true);

    const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
    const response = await fetch(`/api/search/works-or-cycles?q=${query}&include=${includeQP}`);
    const itemsSWC: SearchResult[] = await response.json();

    setSearchWorkOrCycleResults(itemsSWC);
    setIsSearchWorkOrCycleLoading(false);
  };

  const handleSearchCycle = async (query: string) => {
    let criteria = `q=${query}`;
    if (selectedWork != null) {
      criteria = `where=${JSON.stringify({
        title: { contains: query },
        works: { some: { id: selectedWork.id } },
      })}`;
    }
    const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));

    setIsSearchCycleLoading(true);
    const response = await fetch(`/api/search/cycles?${criteria}&include=${includeQP}`);
    const itemsCL: CycleWithImages[] = await response.json();

    setSearchCycleResults(itemsCL);
    setIsSearchCycleLoading(false);
  };

  const handleSelectWorkOrCycle = (selected: SearchResult[]): void => {
    const searchResult = selected[0];
    if (searchResult != null) {
      if (isCycleMosaicItem(searchResult)) {
        setSelectedCycle(searchResult);
        if (formRef.current) formRef.current.isPublic.checked = searchResult.isPublic;
      }
      if (isWorkMosaicItem(searchResult)) {
        setSelectedWork(searchResult);
      }
    }
  };

  const handleSelectCycle = (selected: CycleWithImages[]): void => {
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
    if (formRef.current) formRef.current.isPublic.checked = true;
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
        topics: items.join(','),
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
        topics: items.join(','),
      };
      await execCreatePost(payload);
    }
  };

  useEffect(() => {
    if (isCreatePostSuccess === true && createdPost != null) {
      setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: false } });
      queryClient.invalidateQueries('posts.mosaic');

      if (selectedWork != null) {
        router.push(`/work/${selectedWork.id}/post/${createdPost.id || postId}`);
        return;
      }
      if (selectedCycle != null) {
        router.push(`/cycle/${selectedCycle.id}/post/${createdPost.id || postId}`);
      }
    } else if (status === 'error') {
      alert('Error creating the post');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdPost, isCreatePostSuccess]);

  const labelKeyFn = (res: SearchResult) => {
    if ('title' in res) return `${res.title}`;
    return `${res.name}`;
  };

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <ModalHeader closeButton>
        <Container>
          <ModalTitle>{t('title')}</ModalTitle>
        </Container>
      </ModalHeader>

      <ModalBody>
        <Container>
          <Row>
            <Col>
              <FormGroup controlId="workOrCycle">
                <FormLabel>*{t('searchCycleOrWorkFieldLabel')}</FormLabel>
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
                      placeholder={t('searchCycleOrWorkFieldPlaceholder')}
                      isLoading={isSearchWorkOrCycleLoading}
                      labelKey={labelKeyFn}
                      minLength={2}
                      onSearch={handleSearchWorkOrCycle}
                      options={searchWorkOrCycleResults}
                      onChange={handleSelectWorkOrCycle}
                      renderMenuItemChildren={(searchResult) => {
                        if (isCycleMosaicItem(searchResult)) {
                          return <CycleTypeaheadSearchItem cycle={searchResult} />;
                        }
                        if (isWorkMosaicItem(searchResult)) {
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
                <FormLabel>*{t('titleFieldLabel')}</FormLabel>
                <FormControl type="text" maxLength={80} required />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <ImageFileSelect acceptedFileTypes="image/*" file={imageFile} setFile={setImageFile} required>
                {(imagePreview) => (
                  <FormGroup>
                    <FormLabel>*{t('imageFieldLabel')}</FormLabel>
                    <div className={styles.imageControl}>
                      {(imageFile != null && imagePreview) != null ? (
                        <span className={styles.imageName}>{imageFile?.name}</span>
                      ) : (
                        t('imageFieldPlaceholder')
                      )}
                      {imagePreview && <img src={imagePreview} className="float-right" alt="Work cover" />}
                    </div>
                  </FormGroup>
                )}
              </ImageFileSelect>
            </Col>
            <Col>
              <FormGroup controlId="language">
                <FormLabel>*{t('languageFieldLabel')}</FormLabel>
                <LanguageSelect />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={{ span: 6 }}>
              <FormGroup controlId="workOrCycle">
                <FormLabel>{t('searchCycleFieldLabel')}</FormLabel>
                {!selectedCycle ? (
                  <>
                    {/* language=CSS */}
                    <style jsx global>{`
                      .rbt-menu {
                        background-color: #d0f7ed;
                        min-width: 468px;
                      }
                    `}</style>
                    <AsyncTypeahead
                      id="create-post--search-cycle"
                      filterBy={() => true}
                      inputProps={{ id: 'create-post--search-cycle' }}
                      placeholder={t('searchCycleFieldPlaceholder')}
                      isLoading={isSearchCycleLoading}
                      labelKey={labelKeyFn}
                      minLength={2}
                      useCache={false}
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
                {t('searchCycleInfotip')}
              </small>
            </Col>
          </Row>
          <Row>
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
          </Row>
          <Row>
            <FormGroup controlId="description" as={Col}>
              <FormLabel>*{t('descriptionFieldLabel')}</FormLabel>
              <FormControl as="textarea" rows={6} maxLength={4000} required />
            </FormGroup>
          </Row>
        </Container>
      </ModalBody>

      <ModalFooter>
        <Container className="py-3">
          <Row>
            <Col>
              <FormCheck type="checkbox" defaultChecked inline id="isPublic" label={t('isPublicFieldLabel')} />
              <small style={{ color: 'lightgrey', display: 'block', margin: '0.25rem 0 0 1.25rem' }}>
                {t('isPublicInfotip')}
              </small>
            </Col>
            <Col style={{ borderLeft: '1px solid lightgrey' }}>
              <Button variant="primary" type="submit" className="pl-5 pr-4 float-right">
                {t('submitButtonLabel')}
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
