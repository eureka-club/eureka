import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

import withTitle from '../../HOCs/withTitle';
import styles from './DetailLayout.module.css';

type Props = {
  children: string | JSX.Element | JSX.Element[];
  title?: string;
};

const DetailLayout: FunctionComponent<Props> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Container className={classNames(styles.xxlContainer, 'mt-3', 'mb-2')}>
        <Row>
          <Col>
            <button className={styles.returnLink} onClick={() => router.back()} type="button">
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
