import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation } from 'react-query';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import styles from './CreateCycleForm.module.css';

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
    <Form onSubmit={handleSubmit} ref={formRef} className={className}>
      <h4 className="mt-2 mb-4">Create a Cycle</h4>

      <Row className="mb-5">
        <Col md={{ span: 8 }}>
          <button type="button" className={styles.addWorkButton}>
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
          <Button variant="outline-secondary" type="button" onClick={handleFormClear} className="float-right mr-4 px-3">
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateCycleForm;
