import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { FunctionComponent, MouseEvent, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/client';
import withTitle from '../../HOCs/withTitle';
import styles from './Header.module.css';
import { Session } from '../../types';
import globalModalsAtom from '../../atoms/globalModals';

type Props = {
  // children: string | JSX.Element | JSX.Element[];
  title?: string;
  show?: boolean;
};

const Header: FunctionComponent<Props> = ({ show: s = false }) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState<boolean>(s);
  const [session, isLoadingSession] = useSession() as [Session | null | undefined, boolean];
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

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
          <Container className={`${styles.grid}`}>
            <Row className="text-white mb-5">
              <Col xs={12} md={4} className="d-flex flex-column">
                <h1 className="h1 ml-auto">Eureka.</h1>
                <em className="fs-6 ml-auto">Shape your mind, shape the world</em>
              </Col>
              <Col xs={12} md={8} className="text-left">
                <p className="pl-4 border-left border-white">{t('eurekaReasonLabel')}</p>
              </Col>
            </Row>

            <Row className="d-flex justify-content-center" style={{ marginBottom: '-5em' }}>
              <Col
                xs={12}
                md={3}
                className="p-3 text-white rounded d-flex flex-column align-items-center ml-0 bg-secondary"
              >
                <aside className={`${styles.bgHeaderLeft}`} />
                <p className="p-0 m-0">
                  ¿Hace cuánto sientes que pierdes el tiempo en redes sociales? En Eureka, dedica tu tiempo de pantalla
                  para senti-pensar, sobre temas y contenidos con significado.
                </p>
              </Col>
              <Col
                xs={12}
                md={3}
                className="p-3 text-white rounded d-flex flex-column align-items-center ml-5 bg-secondary"
              >
                <aside className={`${styles.bgHeaderCenter}`} />
                <p className="p-0 m-0">
                  Únete a un ciclo: recorridos de conocimiento para que personas interesadas y expertas, puedan
                  profundizar en cualquier tipo de tema.
                </p>
              </Col>
              <Col
                xs={12}
                md={3}
                className="p-3 text-white rounded d-flex flex-column align-items-center ml-5 bg-secondary"
              >
                <aside className={`${styles.bgHeaderRight}`} />
                <p className="p-0 m-0">
                  Crea y comparte momentos Eureka: revelaciones individuales que transforman el colectivo.
                </p>
              </Col>
            </Row>
          </Container>
        )}
      </section>
      {show && (
        <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
          {!isLoadingSession && !session && (
            <Button onClick={openSignInModal} className="button" variant="primary">
              {t('headerSessionBtnLabel')}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default withTitle(Header);
