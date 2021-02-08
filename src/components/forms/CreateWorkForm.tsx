import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, FunctionComponent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation } from 'react-query';

import { CreateWorkClientPayload } from '../../types';
import ImageSelectInput from './ImageSelectInput';
import homepageAtom from '../../atoms/homepage';
import styles from './CreateWorkForm.module.css';

const CreateWorkForm: FunctionComponent = () => {
  const [homepageState, setHomepageState] = useAtom(homepageAtom);
  const [publicatonYearLabel, setPublicationYearLabel] = useState('Publication year');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const router = useRouter();

  const { mutate: execCreateWork, error: createWorkError, isError, isLoading, isSuccess } = useMutation(
    async (payload: CreateWorkClientPayload) => {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });

      const res = await fetch('/api/work', {
        method: 'POST',
        body: formData,
      });

      return res.json();
    },
  );

  const handleWorkTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    switch (ev.currentTarget.value) {
      case 'movie':
      case 'documentary':
        setPublicationYearLabel('Release year');
        break;

      default:
        setPublicationYearLabel('Publication year');
    }
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (coverFile == null) {
      return;
    }

    const form = ev.currentTarget;
    const payload: CreateWorkClientPayload = {
      type: form.type.value,
      title: form.workTitle.value,
      author: form.author.value,
      authorGender: form.authorGender.value.length ? form.authorGender.value : null,
      authorRace: form.authorRace.value.length ? form.authorRace.value : null,
      cover: coverFile,
      contentText: form.description.value.length ? form.description.value : null,
      link: form.link.value.length ? form.link.value : null,
      countryOfOrigin: form.countryOfOrigin.value.length ? form.countryOfOrigin.value : null,
      publicationYear: form.publicationYear.value.length ? form.publicationYear.value : null,
      length: form.workLength.value.length ? form.workLength.value : null,
    };

    await execCreateWork(payload);
  };

  useEffect(() => {
    if (isSuccess === true) {
      (async () => {
        await router.push('/works-library');
        await setHomepageState({ ...homepageState, ...{ createWorkModalOpened: false } });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <ModalHeader closeButton>
        <Container>
          <ModalTitle>Add new Work to the library</ModalTitle>
        </Container>
      </ModalHeader>

      <ModalBody>
        <Container>
          <Row>
            <Col>
              <FormGroup controlId="type">
                <FormLabel>*Type of work</FormLabel>
                <FormControl as="select" required onChange={handleWorkTypeChange}>
                  <option value="">select...</option>
                  <option value="book">Book</option>
                  <option value="documentary">Documentary</option>
                  <option value="movie">Movie</option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="link">
                <FormLabel>Link to work</FormLabel>
                <FormControl type="text" placeholder="http://" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup controlId="workTitle">
                <FormLabel>*Title of work</FormLabel>
                <FormControl type="text" required />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="author">
                <FormLabel>*Author or director of work</FormLabel>
                <FormControl type="text" required />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup controlId="topics">
                <FormLabel>Main topics of this work</FormLabel>
                <FormControl type="text" disabled />
              </FormGroup>
            </Col>
            <Col>
              <ImageSelectInput acceptedFileTypes="image/*" file={coverFile} setFile={setCoverFile} required>
                {(imagePreview) => (
                  <FormGroup>
                    <FormLabel>*Cover of work</FormLabel>
                    <div className={styles.imageControl}>
                      {(coverFile != null && imagePreview) != null ? (
                        <span className={styles.imageName}>{coverFile?.name}</span>
                      ) : (
                        'select file...'
                      )}
                      {imagePreview && <img src={imagePreview} className="float-right" alt="Work cover" />}
                    </div>
                  </FormGroup>
                )}
              </ImageSelectInput>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup controlId="publicationYear">
                <FormLabel>{publicatonYearLabel}</FormLabel>
                <FormControl type="number" min="-5000" max="2200" />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="countryOfOrigin">
                <FormLabel>Country of origin</FormLabel>
                <FormControl type="text" />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="workLength">
                <FormLabel>Length</FormLabel>
                <FormControl type="text" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup controlId="authorGender">
                <FormLabel>Gender of author of director</FormLabel>
                <FormControl as="select">
                  <option value="">select...</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="trans">Trans</option>
                  <option value="other">Other</option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup controlId="authorRace">
                <FormLabel>Is author or director white or non-white</FormLabel>
                <FormControl as="select">
                  <option value="">select...</option>
                  <option value="white">White</option>
                  <option value="non-white">Non-white</option>
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <FormGroup controlId="description" as={Col}>
              <FormLabel>Official summary of work</FormLabel>
              <FormControl as="textarea" rows={6} maxLength={4000} />
            </FormGroup>
          </Row>
        </Container>
      </ModalBody>

      <ModalFooter>
        <Container className="py-3">
          <Button variant="primary" type="submit" className="pl-5 pr-4 float-right">
            Add work to library
            {isLoading ? (
              <Spinner animation="grow" variant="secondary" className={styles.loadIndicator} />
            ) : (
              <span className={styles.placeholder} />
            )}
            {isError && createWorkError}
          </Button>
        </Container>
      </ModalFooter>
    </Form>
  );
};

export default CreateWorkForm;
