import { FormEvent, FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

const CreatePostForm: FunctionComponent = () => {
  const handleCreatePostSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const form = ev.currentTarget;
    const payload = {
      image: form.image.value,
      cycle: form.cycle.value,
      workTitle: form.workTitle.value,
      workAuthor: form.workAuthor.value,
      hashtags: form.hashtags.value,
      language: form.language.value,
      workType: form.workType.value,
      description: form.description.value,
    };
  };

  return (
    <Form onSubmit={handleCreatePostSubmit}>
      <Modal.Body>
        <Container>
          <h4 className="mt-2 mb-4">Create Post</h4>
          <Row>
            <FormGroup controlId="image" as={Col}>
              <FormLabel>start by adding an image</FormLabel>
              <FormControl type="text" />
            </FormGroup>
            <FormGroup controlId="cycle" as={Col}>
              <FormLabel>Add post to a cycle</FormLabel>
              <FormControl type="text" placeholder="search for cycles" disabled />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup controlId="workTitle" as={Col}>
              <FormLabel>Title of the work (*)</FormLabel>
              <FormControl type="text" />
            </FormGroup>
            <FormGroup controlId="workAuthor" as={Col}>
              <FormLabel>Author of the work</FormLabel>
              <FormControl type="text" />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup controlId="hashtags" as={Col}>
              <FormLabel>Main topics of this work (5 max) (*)</FormLabel>
              <FormControl type="text" />
            </FormGroup>
            <Col md={{ span: 3 }}>
              <FormGroup controlId="language">
                <FormLabel>Language of the post</FormLabel>
                <FormControl type="text" as="select">
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
                <FormControl as="select">
                  <option value="book">Book</option>
                  <option value="digital art">Digital art</option>
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
          <Button variant="primary" type="submit" className="px-5 float-right">
            Create post
          </Button>
        </Container>
      </Modal.Footer>
    </Form>
  );
};

export default CreatePostForm;
