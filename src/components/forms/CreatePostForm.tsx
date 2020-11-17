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

import navbarAtom from '../../atoms/navbar';
import styles from './CreatePostForm.module.css';

type NewPostData = {
  image: File;
  payload: Record<string, string>;
};

const createPostApiHandler = async ({ image, payload }: NewPostData) => {
  const formData = new FormData();

  formData.append('image', image);
  Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

  const res = await fetch('/api/post', {
    method: 'POST',
    body: formData,
  });

  return res.json();
};

const CreatePostForm: FunctionComponent = () => {
  const imageInputRef = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string>();
  const [navbarState, setNavbarState] = useAtom(navbarAtom);
  const [createNewPost, { data, error, isError, isLoading, isSuccess }] = useMutation(createPostApiHandler, {});

  const handleImageControlClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    imageInputRef.current?.click();
  };

  const handleImageInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const fileList = ev.target.files;

    if (fileList != null && fileList[0] != null) {
      const file = fileList[0];

      if (file.type.substr(0, 5) === 'image') {
        setImage(fileList[0]);
      } else {
        alert('You must select image file!'); // eslint-disable-line no-alert
      }
    } else {
      setImage(undefined);
    }
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (image == null) {
      return;
    }

    const form = ev.currentTarget;
    const payload = {
      workLink: form.workLink.value,
      workTitle: form.workTitle.value,
      workAuthor: form.workAuthor.value,
      hashtags: form.hashtags.value,
      language: form.language.value,
      workType: form.workType.value,
      description: form.description.value,
      isPublic: form.isPublic.checked,
    };

    await createNewPost({ image, payload });
  };

  useEffect(() => {
    if (image != null) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(undefined);
    }
  }, [image]);

  useEffect(() => {
    if (router != null && setNavbarState != null && isSuccess && typeof data?.postUuid === 'string') {
      (async () => {
        await setNavbarState({ ...navbarState, ...{ createPostModalOpened: false } });
        await router.push(`/post/${data.postUuid}`);
      })();
    }
  }, [router, navbarState, setNavbarState, isSuccess, data]);

  return (
    <Form onSubmit={handleSubmit}>
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
                {image != null ? <span className={styles.imageName}>{image.name}</span> : 'select file...'}
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
                <FormControl type="text" placeholder="http://" required />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <FormGroup controlId="workTitle" as={Col}>
              <FormLabel>Title of the work (*)</FormLabel>
              <FormControl type="text" required />
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
          <FormCheck type="checkbox" defaultChecked={true} inline id="isPublic" label="Public?" />

          <Button variant="primary" type="submit" className="pl-5 pr-4 float-right">
            Create post
            {isLoading ? (
              <Spinner animation="grow" variant="secondary" className={styles.loadIndicator} />
            ) : (
              <span className={styles.loadIndicator} />
            )}
            {isError && error}
          </Button>
        </Container>
      </Modal.Footer>
    </Form>
  );
};

export default CreatePostForm;
