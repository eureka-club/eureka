import { FunctionComponent, useState } from 'react';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import { useQueryClient } from '@tanstack/react-query';
import styles from './Banner.module.css';
import { Button, Container } from '@mui/material';

type Props = {
  content: string | JSX.Element | JSX.Element[];
  expandBannerLabel?: string | JSX.Element | JSX.Element[];
  show?: boolean;
  className?: string;
  style?: Record<string, string>;
  cacheKey: [string, string];
  t:Record<string,string>
};

const Banner: FunctionComponent<Props> = ({
  show: s = false,
  content,
  expandBannerLabel,
  className,
  style,
  cacheKey,
  t
}) => {
  // const { t, dict } = useDictContext();

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
              variant="contained"
              color="info"
              onClick={close}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t['Close']} <AiOutlineClose />
            </Button>
          )}
          {!show && (
            <Button
              variant="contained"
              color="info"
              onClick={open}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {expandBannerLabel || t['Expand']} <AiOutlineDown />
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
