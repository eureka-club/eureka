import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, useEffect, useState, FunctionComponent } from 'react';
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
import { useMutation, useQueryClient } from 'react-query';
import TagsInput from './controls/TagsInput';
import { EditWorkClientPayload, WorkDetail } from '../../types/work';
// import ImageFileSelect from './controls/ImageFileSelect';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreateWorkForm.module.css';

dayjs.extend(utc);
const EditWorkForm: FunctionComponent = () => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [publicationYearLabel, setPublicationYearLabel] = useState('Publication year');
  // const [coverFile, setCoverFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation('createWorkForm');
  const router = useRouter();
  const [tags, setTags] = useState<string>('');
  const [work, setWork] = useState<WorkDetail | null>(null);

  useEffect(() => {
    const fetchWork = async () => {
      const res: Response = await fetch(`/api/work/${router.query.id}`);
      const { status, work: w = null } = await res.json();
      if (status === 'OK') {
        setWork(w);
        setTags(() => {
          const ts = w.tags;
          return ts;
        });
      }
    };
    fetchWork();
  }, [router.query.id]);

  const { mutate: execEditWork, error: editWorkError, isError, isLoading, isSuccess } = useMutation(
    async (payload: EditWorkClientPayload) => {
      const res = await fetch(`/api/work/${router.query.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
  );

  const handleWorkTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    switch (ev.currentTarget.value) {
      case 'movie':
      case 'documentary':
        setPublicationYearLabel(t('releaseYearFieldLabel'));
        break;

      default:
        setPublicationYearLabel(t('publicationYearFieldLabel'));
    }
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // if (coverFile == null) {
    //   return;
    // }

    const form = ev.currentTarget;
    const payload: EditWorkClientPayload = {
      id: router.query.id as string,
      type: form.type.value,
      title: form.workTitle.value,
      author: form.author.value,
      authorGender: form.authorGender.value.length ? form.authorGender.value : null,
      authorRace: form.authorRace.value.length ? form.authorRace.value : null,
      // cover: coverFile,
      contentText: form.description.value.length ? form.description.value : null,
      link: form.link.value.length ? form.link.value : null,
      countryOfOrigin: form.countryOfOrigin.value.length ? form.countryOfOrigin.value : null,
      publicationYear: form.publicationYear.value.length ? form.publicationYear.value : null,
      length: form.workLength.value.length ? form.workLength.value : null,
      tags,
    };

    await execEditWork(payload);
  };

  const handlerchange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (work && ev.currentTarget.id in work) {
      let w: WorkDetail & { [key: string]: any } = work;
      w = work;
      w[ev.currentTarget.id] = ev.currentTarget.value;
      setWork(w);
    }
  };

  useEffect(() => {
    if (isSuccess === true) {
      setGlobalModalsState({ ...globalModalsState, ...{ editWorkModalOpened: false } });
      queryClient.invalidateQueries('works.mosaic');
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  return (
    work && (
      <Form onSubmit={handleSubmit}>
        <ModalHeader closeButton>
          <Container>
            <ModalTitle>{t('titleEdit')}</ModalTitle>
          </Container>
        </ModalHeader>

        <ModalBody>
          <Container>
            <Row>
              <Col>
                <FormGroup controlId="type">
                  <FormLabel>*{t('typeFieldLabel')}</FormLabel>
                  <FormControl as="select" required onChange={handleWorkTypeChange} defaultValue={work.type}>
                    <option value="">{t('typeFieldPlaceholder')}</option>
                    <option value="book">{t('typeBook')}</option>
                    <option value="documentary">{t('typeDocumentary')}</option>
                    <option value="movie">{t('typeMovie')}</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="link">
                  <FormLabel>{t('linkFieldLabel')}</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="http://"
                    defaultValue={work.link?.toString()}
                    onChange={handlerchange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup controlId="workTitle">
                  <FormLabel>*{t('titleFieldLabel')}</FormLabel>
                  <FormControl type="text" required defaultValue={work.title} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="author">
                  <FormLabel>*{t('authorFieldLabel')}</FormLabel>
                  <FormControl type="text" required defaultValue={work.author} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <TagsInput tags={tags} setTags={setTags} label={t('topicsFieldLabel')} />
              </Col>
              {/* <Col>
                <ImageFileSelect acceptedFileTypes="image/*" file={coverFile} setFile={setCoverFile} required>
                  {(imagePreview) => (
                    <FormGroup>
                      <FormLabel>*{t('imageCoverFieldLabel')}</FormLabel>
                      <div className={styles.imageControl}>
                        {coverFile != null && imagePreview != null ? (
                          <>
                            <span className={styles.imageName}>{coverFile?.name}</span>
                            <img src={imagePreview} className="float-right" alt="Work cover" />
                          </>
                        ) : (
                          t('imageCoverFieldPlaceholder')
                        )}
                      </div>
                    </FormGroup>
                  )}
                </ImageFileSelect>
              </Col> */}
            </Row>
            <Row>
              <Col>
                <FormGroup controlId="publicationYear">
                  <FormLabel>{publicationYearLabel}</FormLabel>
                  <FormControl
                    defaultValue={dayjs(work.publicationYear?.toString()).utc().year()}
                    type="number"
                    min="-5000"
                    max="2200"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="countryOfOrigin">
                  <FormLabel>{t('countryFieldLabel')}</FormLabel>
                  <FormControl defaultValue={work.countryOfOrigin?.toString()} type="text" />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="workLength">
                  <FormLabel>{t('workLengthFieldLabel')}</FormLabel>
                  <FormControl defaultValue={work.length?.toString()} type="text" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup controlId="authorGender">
                  <FormLabel>{t('authorGenderFieldLabel')}</FormLabel>
                  <FormControl as="select" defaultValue={work.authorGender?.toString()}>
                    <option value="">{t('authorGenderFieldPlaceholder')}</option>
                    <option value="female">{t('authorGenderFemale')}</option>
                    <option value="male">{t('authorGenderMale')}</option>
                    <option value="non-binary">{t('authorGenderNonbinary')}</option>
                    <option value="trans">{t('authorGenderTrans')}</option>
                    <option value="other">{t('authorGenderOther')}</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup controlId="authorRace">
                  <FormLabel>{t('authorEthnicityFieldLabel')}</FormLabel>
                  <FormControl as="select" defaultValue={work.authorRace?.toString()}>
                    <option value="">{t('authorEthnicityFieldPlaceholder')}</option>
                    <option value="white">{t('authorEthnicityIsWhite')}</option>
                    <option value="non-white">{t('authorEthnicityIsNotWhite')}</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <FormGroup controlId="description" as={Col}>
                <FormLabel>{t('workSummaryFieldLabel')}</FormLabel>
                <FormControl as="textarea" rows={6} maxLength={4000} defaultValue={work.contentText?.toString()} />
              </FormGroup>
            </Row>
          </Container>
        </ModalBody>

        <ModalFooter>
          <Container className="py-3">
            <Button variant="primary" type="submit" className="pl-5 pr-4 float-right">
              {t('titleEdit')}
              {isLoading ? (
                <Spinner animation="grow" variant="secondary" className={styles.loadIndicator} />
              ) : (
                <span className={styles.placeholder} />
              )}
              {isError && editWorkError}
            </Button>
          </Container>
        </ModalFooter>
      </Form>
    )
  );
};

export default EditWorkForm;
