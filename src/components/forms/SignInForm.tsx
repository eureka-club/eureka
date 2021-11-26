import { signIn } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';

import styles from './SignInForm.module.css';

interface Props {
  noModal?: boolean;
}

const SignInForm: FunctionComponent<Props> = ({ noModal = false }) => {
  const { t } = useTranslation('signInForm');

  const handleSignInGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    signIn('google');
  };

  const handleEmailLoginSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const form = ev.currentTarget;
    const email = form.email.value;

    signIn('email', { email });
  };

  return (
    <>
      <ModalHeader className={styles.modalHeader} closeButton={!noModal}>
        <Container>
          <ModalTitle>{t('login')}</ModalTitle>
          <p>{t('loginGreeting')}</p>
        </Container>
      </ModalHeader>
      <ModalBody className="pt-0 pb-5">
        <Container>
          <Row>
            <Col>
              <button type="button" onClick={handleSignInGoogle} className={styles.buttonGoogle}>
                {t('loginViaGoogle')}
              </button>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className={styles.alternativeLabel}>{t('alternativeText')}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={handleEmailLoginSubmit}>
                <FormGroup controlId="email">
                  <FormLabel>{t('emailFieldLabel')}</FormLabel>
                  <FormControl type="email" required />
                </FormGroup>
                <Button type="submit" variant="primary text-white" className={styles.submitButton}>
                  {t('login')}
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </ModalBody>
    </>
  );
};

export default SignInForm;
