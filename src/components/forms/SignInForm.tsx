import { signIn } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';

import styles from './SignInForm.module.css';

const SignInForm: FunctionComponent = () => {
  const handleSignInGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    signIn('google');
  };
  const { t } = useTranslation('signInForm');

  return (
    <>
      <ModalHeader className={styles.modalHeader} closeButton>
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
        </Container>
      </ModalBody>
    </>
  );
};

export default SignInForm;
