import { useAtom } from 'jotai';
import { FunctionComponent } from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

import Navbar from '../Navbar';
import CreatePostForm from '../forms/CreatePostForm';
import homepageAtom from '../../atoms/homepage';
import withTitle from '../../HOCs/withTitle';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const SimpleLayout: FunctionComponent<Props> = ({ children }) => {
  const [homepageState, setHomepageState] = useAtom(homepageAtom);

  const handleCreatePostModalClose = () => {
    setHomepageState({ ...homepageState, ...{ createPostModalOpened: false } });
  };

  return (
    <>
      <Container>
        <Navbar />
      </Container>

      <Container className="mt-5">{children}</Container>

      <Modal animation={false} size="lg" show={homepageState.createPostModalOpened} onHide={handleCreatePostModalClose}>
        <CreatePostForm />
      </Modal>
    </>
  );
};

export default withTitle(SimpleLayout);
