import { useRouter } from 'next/navigation';
import { FunctionComponent, MouseEvent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

import withTitle from '../../HOCs/withTitle';
import styles from './PopupLayout.module.css';

type Props = {
  children: string | JSX.Element | JSX.Element[];
  title?: string;
};

const DetailLayout: FunctionComponent<Props> = ({ children }) => {
  const router = useRouter();

  const handleBackButtonClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    router.back();
  };

  return (
    <>
      <Container className={styles.navigationContainer}>
        <Row>
          <Col>
            <button className={styles.returnLink} onClick={handleBackButtonClick} type="button">
              <BiArrowBack />
            </button>
          </Col>
        </Row>
      </Container>
      <Container>{children}</Container>
    </>
  );
};

export default withTitle(DetailLayout);
