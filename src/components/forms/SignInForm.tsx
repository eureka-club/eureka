import { signIn } from 'next-auth/client';
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

  return (
    <>
      <ModalHeader closeButton>
        <Container>
          <ModalTitle>Sign-in</ModalTitle>
        </Container>
      </ModalHeader>
      <ModalBody className="py-5">
        <Container>
          <Row>
            <Col>
              <button type="button" onClick={handleSignInGoogle} className={styles.buttonGoogle}>
                Sign-in with Google
              </button>
            </Col>
          </Row>
        </Container>
      </ModalBody>
    </>
  );
};

export default SignInForm;
