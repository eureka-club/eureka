import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

import withTitle from '../../HOCs/withTitle';
import styles from './DetailLayout.module.css';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const DetailLayout: FunctionComponent<Props> = ({ children }) => (
  <>
    <Container className={classNames(styles.xxlContainer, 'mt-3', 'mb-2')}>
      <Row>
        <Col>
          <Link href="/">
            <a>
              <BiArrowBack className={styles.returnLink} />
            </a>
          </Link>
        </Col>
      </Row>
    </Container>
    <Container>{children}</Container>
  </>
);

export default withTitle(DetailLayout);
