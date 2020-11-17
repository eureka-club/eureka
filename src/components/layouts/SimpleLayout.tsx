import { useAtom } from 'jotai';
import { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

import Navbar from '../Navbar';
import CreatePostForm from '../forms/CreatePostForm';
import withTitle from '../../HOCs/withTitle';
import navbarAtom from '../../atoms/navbar';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const SimpleLayout: FunctionComponent<Props> = ({ children }) => {
  const [navbarState, setNavbarState] = useAtom(navbarAtom);

  const handleCreatePostModalClose = () => {
    setNavbarState({ ...navbarState, ...{ createPostModalOpened: false } });
  };

  return (
    <>
      <Container>
        <Navbar />
      </Container>

      <Container className="mt-5">{children}</Container>

      <Modal animation={false} size="lg" show={navbarState.createPostModalOpened} onHide={handleCreatePostModalClose}>
        <CreatePostForm />
      </Modal>
    </>
  );
};

export default withTitle(SimpleLayout);
