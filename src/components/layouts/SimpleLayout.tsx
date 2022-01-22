import { useAtom } from 'jotai';
import { FunctionComponent, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
// import { useRouter } from 'next/router';

import Navbar from '../Navbar';
import NavbarMobile from '../NavbarMobile';
import Header from './Header';
import HeaderMobile from './HeaderMobile';

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


  useEffect(()=>{
    globalThis.addEventListener('notify',(e)=>{
      // e.preventDefault();
      setGlobalModalsState((res)=>({ 
        ...res, 
        showToast: {
          title:"Notification",
          message: (e as CustomEvent).detail, 
          show: true,
        } 
      }));
      console.log('notify from SimpleLayout',e);
    });
  },[]);

  const renderBanner = () => {
    if (banner) return <>{banner}</>;
    return ``;
  };

  return (
    <>
      <section>
        <div className="d-none d-lg-block">
          <Navbar />
        </div>
        <div className="d-lg-none">
          <NavbarMobile />
        </div>

      </section>
      <section className='mainSection'>
        <Toast />
        {/* <Navbar /> */}
        <div className="d-none d-lg-block">{showHeader && <Header show={showHeader} />}</div>
        <div className="d-lg-none">{showHeader && <HeaderMobile show={showHeader} />}</div>

        {renderBanner()}
        {/* <Toast /> */}
        <Container className="">{children}</Container>

      </section>

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
