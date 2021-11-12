// import { useAtom } from 'jotai';
import { FunctionComponent, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
// import { useSession } from 'next-auth/client';
// import withTitle from '../../HOCs/withTitle';
import styles from './Banner.module.css';
// import { Session } from '../types';
// import globalModalsAtom from '../atoms/globalModals';

type Props = {
  content: string | JSX.Element | JSX.Element[];
  expandBannerLabel?: string | JSX.Element | JSX.Element[];
  show?: boolean;
  className?: string;
  style?: Record<string, string>;
};

const Banner: FunctionComponent<Props> = ({ show: s = false, content, expandBannerLabel, className, style }) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState<boolean>(s);
  // const [session, isLoadingSession] = useSession() as [Session | null | undefined, boolean];
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  // useEffect(() => {
  //   if (session) setShow(false);
  // }, [session]);

  // const openSignInModal = () => {
  //   setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  // };

  return (
    <>
      <section className={`p-3 ${className}`} style={style || {}}>
        <aside className="d-flex justify-content-end">
          {show && (
            <Button
              variant="info"
              onClick={() => setShow(false)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t('Close')} <AiOutlineClose />
            </Button>
          )}
          {!show && (
            <Button
              variant="info"
              onClick={() => setShow(true)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {expandBannerLabel || t('Expand')} <AiOutlineDown />
            </Button>
          )}
        </aside>
        {show && <Container className={`${styles.grid}`}>{content}</Container>}
      </section>
      {/* {show && (
        <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
          {!isLoadingSession && !session && (
            <Button onClick={openSignInModal} className="button" variant="primary">
              {t('headerSessionBtnLabel')}
            </Button>
          )}
        </div>
      )} */}
    </>
  );
};

export default Banner;
