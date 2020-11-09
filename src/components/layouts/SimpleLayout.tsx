import { FunctionComponent } from 'react';
import { Container } from 'react-bootstrap';

import Navbar from '../Navbar';
import withTitle from '../../HOCs/withTitle';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const SimpleLayout: FunctionComponent<Props> = ({ children }) => (
  <>
    <Container>
      <Navbar />
    </Container>

    <Container className="mt-5">{children}</Container>
  </>
);

export default withTitle(SimpleLayout);
