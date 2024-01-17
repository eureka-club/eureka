// import { useAtom } from 'jotai';
import { FunctionComponent, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';

// import { useSession } from 'next-auth/react';
// import withTitle from '../../HOCs/withTitle';
import { useQueryClient } from '@tanstack/react-query';;
import styles from './Banner.module.css';
import { useDictContext } from '../hooks/useDictContext';

// import { Session } from '../types';
// import globalModalsAtom from '../atoms/globalModals';

type Props = {
  content: string | JSX.Element | JSX.Element[];
  expandBannerLabel?: string | JSX.Element | JSX.Element[];
  show?: boolean;
  className?: string;
  style?: Record<string, string>;
  cacheKey: [string, string];
};

const Banner: FunctionComponent<Props> = ({
  show: s = false,
  content,
  expandBannerLabel,
  className,
  style,
  cacheKey,
}) => {
  const{t,dict}=useDictContext();
  const queryClient = useQueryClient();
  const ss = typeof queryClient.getQueryData(cacheKey) === 'boolean' ? queryClient.getQueryData(cacheKey) : s;
  const [show, setShow] = useState<boolean>(ss as boolean);
  // const [session, isLoadingSession] = useSession() as [Session | null | undefined, boolean];
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  // useEffect(() => {
  //   if (session) setShow(false);
  // }, [session]);

  // const openSignInModal = () => {
  //   setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  // };
  const close = () => {
    setShow(false);
    queryClient.setQueryData(cacheKey, false);
  };
  const open = () => {
    setShow(true);
    queryClient.setQueryData(cacheKey, true);
  };
  return (
    <>
      <section className={`p-3 ${className}`} style={style || {}}>
        <aside className="d-flex justify-content-end">
          {show && (
            <Button
              variant="info"
              onClick={close}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t(dict,'Close')} <AiOutlineClose />
            </Button>
          )}
          {!show && (
            <Button
              variant="info"
              onClick={open}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {expandBannerLabel || t(dict,'Expand')} <AiOutlineDown />
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
