import { useAtom } from 'jotai';
import { FunctionComponent } from 'react';
import { Container, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useRouter } from 'next/router';

import Navbar from '../Navbar';
import NavbarMovile from '../NavbarMovile';
import Header from './Header';

import CreatePostForm from '../forms/CreatePostForm';
import CreateWorkForm from '../forms/CreateWorkForm';
import EditWorkForm from '../forms/EditWorkForm';
import EditPostForm from '../forms/EditPostForm';
import EditUserForm from '../forms/EditUserForm';
import SignInForm from '../forms/SignInForm';
import globalModalsAtom from '../../atoms/globalModals';
import withTitle from '../../HOCs/withTitle';
import Toast from '../common/Toast';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
  showHeader?: boolean;
  banner?: JSX.Element | JSX.Element[];
};

const SimpleLayout: FunctionComponent<Props> = ({ children, showHeader = false, banner }) => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const handleCreatePostModalClose = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: false } });
  };

  const handleCreateWorkModalClose = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: false } });
  };

  const handleEditWorkModalClose = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ editWorkModalOpened: false } });
  };

  const handleEditPostModalClose = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ editPostModalOpened: false } });
  };

  const handleEditUserModalClose = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ editUserModalOpened: false } });
  };

  const handleSignInModalClose = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: false } });
  };

  // const handleToastClose = () => {
  //   setGlobalModalsState({ ...globalModalsState, showToast: { ...globalModalsState.showToast, show: false } });
  // };

  const renderBanner = () => {
    if (banner) return <>{banner}</>;
    return ``;
  };

  return (
    <>
      <div className="d-none d-md-block">
        <Navbar />
      </div>
      <div className="d-sm-block d-md-none">
        <NavbarMovile />
      </div>
      <Toast />
      <Navbar />
      {showHeader && <Header show={showHeader} />}
      {renderBanner()}
      <Toast />
      <Container className="mt-5">{children}</Container>

      <Modal
        animation={false}
        size="lg"
        show={globalModalsState.createPostModalOpened}
        onHide={handleCreatePostModalClose}
      >
        <CreatePostForm />
      </Modal>

      <Modal
        animation={false}
        size="lg"
        show={globalModalsState.createWorkModalOpened}
        onHide={handleCreateWorkModalClose}
      >
        <CreateWorkForm />
      </Modal>

      <Modal animation={false} size="lg" show={globalModalsState.editWorkModalOpened} onHide={handleEditWorkModalClose}>
        <EditWorkForm />
      </Modal>

      <Modal animation={false} size="lg" show={globalModalsState.editPostModalOpened} onHide={handleEditPostModalClose}>
        <EditPostForm />
      </Modal>

      <Modal animation={false} size="lg" show={globalModalsState.editUserModalOpened} onHide={handleEditUserModalClose}>
        <EditUserForm />
      </Modal>

      <Modal size="lg" animation={false} show={globalModalsState.signInModalOpened} onHide={handleSignInModalClose}>
        <SignInForm />
      </Modal>
    </>
  );
};

export default withTitle(SimpleLayout);
