import { FunctionComponent } from 'react';
import { Container } from 'react-bootstrap';

import withTitle from '../../HOCs/withTitle';
import styles from './DetailLayout.module.css';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const DetailLayout: FunctionComponent<Props> = ({ children }) => (
  <>
    <Container className={styles.content}>{children}</Container>
  </>
);

export default withTitle(DetailLayout);
