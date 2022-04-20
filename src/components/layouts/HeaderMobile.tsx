import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { FunctionComponent, useState, useEffect } from 'react';
import { Button, Col, Container, Row, Carousel } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import withTitle from '../../HOCs/withTitle';
import styles from './Header.module.css';
// import { Session } from '../../types';
//import globalModalsAtom from '../../atoms/globalModals';

type Props = {
  // children: string | JSX.Element | JSX.Element[];
  title?: string;
  show?: boolean;
};

const Header: FunctionComponent<Props> = ({ show: s = false }) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState<boolean>(s);
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"
  const router = useRouter();
  //const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  useEffect(() => {
    if (session) setShow(false);
  }, [session]);


  return (
    <>
      <section className="bg-primary p-3" style={{ backgroundImage: "url('/img/bg-header.svg')" }}>
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
              {t('openHeaderLabel')} <AiOutlineDown />
            </Button>
          )}
        </aside>
        {show && (
          <>
            <Container className={`${styles.grid} text-white text-center`}>
              <h1 className="h1 ms-auto mt-3">{t('underEurekaLabel')}</h1>
              <p className="">
                {t('eurekaReasonLabel')}
                <br />
                {t('eurekaReasonLabel2')}
              </p>
            </Container>
            <Carousel style={{ marginBottom: '-5em' }} nextIcon={<em />} prevIcon={<em />}>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '16rem' }}>
                <aside className="d-block w-100">
                  <div className="d-flex justify-content-center">
                    <aside className={`${styles.bgHeaderLeft}`} />
                  </div>
                  <h2 className="h6 text-center">{t('headerLeftBoxTitle')}</h2>
                  <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerLeftBoxText')}</p>
                </aside>
              </Carousel.Item>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '16rem' }}>
                <aside className="d-block w-100">
                  <div className="d-flex justify-content-center">
                    <aside className={`${styles.bgHeaderCenter}`} />
                  </div>
                  <h2 className="h6 text-center">{t('headerCenterBoxTitle')}</h2>
                  <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerCenterBoxText')}</p>
                </aside>
              </Carousel.Item>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '16rem' }}>
                <aside className="d-block w-100">
                  <div className="d-flex justify-content-center">
                    <aside className={`${styles.bgHeaderRight}`} />
                  </div>
                  <h2 className="h6 text-center">{t('headerRightBoxTitle')}</h2>
                  <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerRightBoxText')}</p>
                </aside>
              </Carousel.Item>
            </Carousel>
          </>
        )}
      </section>
      {show && (
        <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
          {!isLoadingSession && !session && (
            <Button onClick={() => router.push('/login')} className="button text-white rounded-pill" variant="primary">
              {t('headerSessionBtnLabel')}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default withTitle(Header);
