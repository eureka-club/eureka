import { FunctionComponent, SyntheticEvent } from 'react';
import { Toast as T } from 'react-bootstrap';
import { useAtom } from 'jotai';
import globalModalsAtom from '../../atoms/globalModals';

interface Props {
  className?: string;
}

const Toast: FunctionComponent<Props> = ({ className = '' }) => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const setShow = () => {
    setGlobalModalsState((res) => {
      return {
        ...globalModalsState,

        showToast: {
          ...res.showToast,
          show: false,
        },
      };
    });
  };
  return (
    <>
      {globalModalsState.showToast.show ? (
        <div aria-live="polite" aria-atomic="true" className="sticky-top d-flex justify-content-center">
          <T
            delay={5000}
            show={globalModalsState.showToast.show}
            onClose={setShow}
            autohide={globalModalsState.showToast.autohide || true}
            className={`${className}`}
          >
            <T.Header className={`bg-${globalModalsState.showToast.type} text-white`}>
              {globalModalsState.showToast.title && (
                <>
                  <strong className="mr-auto">{globalModalsState.showToast.title}</strong>
                  {/* <small>{new Date().toLocaleString()}</small> */}
                </>
              )}
            </T.Header>
            <T.Body style={{ overflowWrap: 'anywhere' }}>
              {globalModalsState.showToast.message && <>{globalModalsState.showToast.message}</>}
            </T.Body>
          </T>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Toast;
