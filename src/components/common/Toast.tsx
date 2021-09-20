import { FunctionComponent, SyntheticEvent } from 'react';
import { Toast as T } from 'react-bootstrap';
import { useAtom } from 'jotai';
import globalModalsAtom from '../../atoms/globalModals';

interface Props {
  type?: 'danger' | 'warning' | 'info' | 'success';
  position?: string;
  show: boolean;
  setShow: (show: boolean) => void;
  className?: string;
  header?: JSX.Element;
  body?: JSX.Element;
  title?: string;
  message?: string;
}

const Toast: FunctionComponent<Props> = ({
  show = false,
  setShow,
  className = '',
  type,
  title,
  message,
  header,
  body,
}) => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  return (
    <>
      {globalModalsState.showToast.show ? (
        <div aria-live="polite" aria-atomic="true" className="sticky-top d-flex justify-content-center">
          <T onClose={() => setShow(false)} delay={3000} autohide className={`${className}`}>
            <T.Header className={`bg-${globalModalsState.showToast.type} text-white`}>
              {globalModalsState.showToast.title && (
                <>
                  <strong className="mr-auto">{globalModalsState.showToast.title}</strong>
                  <small>{new Date().toLocaleString()}</small>
                </>
              )}
            </T.Header>
            <T.Body>{globalModalsState.showToast.message && <>{globalModalsState.showToast.message}</>}</T.Body>
          </T>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Toast;
