import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormFile from 'react-bootstrap/FormFile';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import LocalImage from '../LocalImage';
import { WorkDetail } from '../../types';
import navbarAtom from '../../atoms/navbar';
import styles from './CreatePostForm.module.css';

type NewPostPayload = {
  image: File;
  workLink?: string;
  workTitle: string;
  workAuthor: string;
  hashtags: string;
  language: string;
  workType: string;
  description?: string;
  isPublic: string;
};

type WorkTitleSearchOptions = {
  id: string;
  author: string;
  title: string;
  type: string;
  link: string;
  localImagePath: string;
};

const createPostApiHandler = async (payload: NewPostPayload) => {
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
};

const CreatePostForm: FunctionComponent = () => {
  const imageInputRef = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const router = useRouter();
  const [navbarState, setNavbarState] = useAtom(navbarAtom);
  const [imageFile, setImageFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();
  const [isWorkTitleSearchLoading, setIsWorkTitleSearchLoading] = useState(false);
  const [workTitleSearchOptions, setWorkTitleSearchOptions] = useState<WorkTitleSearchOptions[]>([]);
  const [
    execCreateNewPost,
    {
      data: createPostReqResponse,
      error: createPostError,
      isError: isCreatePostError,
      isLoading: isCreatePostLoading,
      isSuccess: isCreatePostSuccess,
    },
  ] = useMutation(createPostApiHandler);

  const handleImageControlClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    imageInputRef.current?.click();
  };

  const handleImageInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const fileList = ev.target.files;

    if (fileList != null && fileList[0] != null) {
      const file = fileList[0];

      if (file.type.substr(0, 5) === 'image') {
        setImageFile(fileList[0]);
      } else {
        alert('You must select image file!'); // eslint-disable-line no-alert
      }
    } else {
      setImageFile(undefined);
    }
  };

  const handleWorkTitleSearch = async (query: string) => {
    setIsWorkTitleSearchLoading(true);

    const response = await fetch(`/api/work?q=title%3D${query}`);
    const items: WorkDetail[] = await response.json();
    const options = items.map((w) => ({
      id: w['work.id'],
      author: w['work.author'],
      title: w['work.title'],
      type: w['work.type'],
      link: w['work.link'],
      localImagePath: w['local_image.stored_file'],
    }));

    setWorkTitleSearchOptions(options);
    setIsWorkTitleSearchLoading(false);
  };

  const handleWorkTitleSearchSelect = (selected: Array<WorkTitleSearchOptions>): void => {
    if (selected[0] != null && formRef.current != null) {
      const form = formRef.current;

      form.workAuthor.value = selected[0].author;
      form.workType.value = selected[0].type;

      if (selected[0].link != null) {
        form.workLink.value = selected[0].link;
      }
    }
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (imageFile == null) {
      return;
    }

    const form = ev.currentTarget;
    const payload: NewPostPayload = {
      image: imageFile,
      workLink: form.workLink.value.lenght ? form.workLink.value : null,
      workTitle: form.workTitle.value,
      workAuthor: form.workAuthor.value,
      hashtags: form.hashtags.value,
      language: form.language.value,
      workType: form.workType.value,
      description: form.description.value.length ? form.description.value : null,
      isPublic: form.isPublic.checked,
    };

    await execCreateNewPost(payload);
  };

  useEffect(() => {
    if (imageFile != null) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(undefined);
    }
  }, [imageFile]);

  useEffect(() => {
    if (
      router != null &&
      setNavbarState != null &&
      isCreatePostSuccess &&
      typeof createPostReqResponse?.postUuid === 'string'
    ) {
      (async () => {
        await setNavbarState({ ...navbarState, ...{ createPostModalOpened: false } });
        await router.push(`/post/${createPostReqResponse.postUuid}`);
      })();
    }
  }, [router, navbarState, setNavbarState, isCreatePostSuccess, createPostReqResponse]);

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <Modal.Body>
        <Container>
          <h4 className="mt-2 mb-4">Create Post</h4>
          <Row>
            <FormGroup controlId="image" as={Col}>
              <FormLabel>start by adding an image</FormLabel>
              <FormFile
                accept="image/*"
                className={styles.imageFormControl}
                onChange={handleImageInputChange}
                ref={imageInputRef}
                required
              />
              <button onClick={handleImageControlClick} className={styles.imageControl} type="button">
                {imageFile != null ? <span className={styles.imageName}>{imageFile.name}</span> : 'select file...'}
                {imagePreview && <img src={imagePreview} className="float-right" alt="Post preview" />}
              </button>
            </FormGroup>
            <Col md={{ span: 3 }}>
              <FormGroup controlId="cycle">
                <FormLabel>Add post to a cycle</FormLabel>
                <FormControl type="text" placeholder="search for cycles" disabled />
              </FormGroup>
            </Col>
            <Col md={{ span: 3 }}>
              <FormGroup controlId="workLink">
                <FormLabel>Add link to work</FormLabel>
                <FormControl type="text" placeholder="http://" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <FormGroup as={Col}>
              <FormLabel>Title of the work (*)</FormLabel>

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
                id="work-title-search-menu"
                inputProps={{ id: 'workTitle', required: true }}
                isLoading={isWorkTitleSearchLoading}
                minLength={2}
                labelKey={(option) => `${option.title}`}
                onSearch={handleWorkTitleSearch}
                onChange={handleWorkTitleSearchSelect}
                options={workTitleSearchOptions}
                placeholder="Search for existing work..."
                renderMenuItemChildren={(option) => (
                  <div className={styles.typeaheadImageItem}>
                    <LocalImage filePath={option.localImagePath} alt={option.title} />
                    <strong>{option.title}</strong> by {option.author} ({option.type})
                  </div>
                )}
              />
            </FormGroup>
            <FormGroup controlId="workAuthor" as={Col}>
              <FormLabel>Author of the work</FormLabel>
              <FormControl type="text" required />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup controlId="hashtags" as={Col}>
              <FormLabel>Main topics of this work (5 max) (*)</FormLabel>
              <FormControl type="text" required />
            </FormGroup>
            <Col md={{ span: 3 }}>
              <FormGroup controlId="language">
                <FormLabel>Language of the post</FormLabel>
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
            </Col>
            <Col md={{ span: 3 }}>
              <FormGroup controlId="workType">
                <FormLabel>Type</FormLabel>
                <FormControl as="select" required>
                  <option value="">select...</option>
                  <option value="book">Book</option>
                  <option value="digital art">Digital art</option>
                  <option value="documentary">Documentary</option>
                  <option value="movie">Movie</option>
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <FormGroup controlId="description" as={Col}>
              <FormLabel>Share your thoughts about this work / the core topics it relates to. Keep it short!</FormLabel>
              <FormControl as="textarea" rows={6} />
            </FormGroup>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Container className="py-3">
          <FormCheck type="checkbox" defaultChecked inline id="isPublic" label="Public?" />

          <Button variant="primary" type="submit" className="pl-5 pr-4 float-right">
            Create post
            {isCreatePostLoading ? (
              <Spinner animation="grow" variant="secondary" className={styles.loadIndicator} />
            ) : (
              <span className={styles.loadIndicator} />
            )}
            {isCreatePostError && createPostError}
          </Button>
        </Container>
      </Modal.Footer>
    </Form>
  );
};

export default CreatePostForm;
