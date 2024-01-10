import { GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import { useState /* , useEffect, ReactElement, Children */ } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import { RiAlertLine } from 'react-icons/ri';
import { CgArrowLongRight } from 'react-icons/cg';
import Link from 'next/link'

// import Masonry from 'react-masonry-css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import styles from './manifest.module.css';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';

interface Props{
  session:Session
}
const ManifestPage: NextPage<Props> = ({session}) => {
  const { t } = useTranslation('manifest');

  const [show, setShow] = useState<Record<string, boolean>>({});

  const toggleBox = (rowNr: number, boxNr: number) => {
    const key = `${rowNr}!|!${boxNr}`;
    if (key in show) {
      setShow((s) => ({ ...s, [`${key}`]: !s[`${key}`] }));
    } else setShow((s) => ({ ...s, [`${key}`]: true }));
  };

  const isVisible = (rowNr: number, boxNr: number) => {
    const key = `${rowNr}!|!${boxNr}`;
    return show[key];
  };

  return (<>
   <Head>
        <meta name="title" content={t('meta:manifestTitle')}></meta>
        <meta name="description" content={t('meta:manifestDescription')}></meta>
    </Head>    
    <SimpleLayout title={t('browserTitleWelcome')}>
      <Container>
        <section className="mb-5">
          <Row>
            <Col xs={12} md={4} className="pe-0 me-0 d-flex flex-column">
              <h1 className="text-primary" style={{ fontSize: '2.5em' }}>
                {t('manifestLbl')} <br />
                Eureka <BsCircleFill style={{ fontSize: '.2em' }} />{' '}
              </h1>
              <h2 style={{fontSize:'1rem'}}><em className="d-block text-gray">{t('eurekaPrinciple')}</em></h2>
            </Col>
            <Col xs={12} md={8} className="ms-0 border-start border-info border-2">
              <p>
                <span className="text-secondary fw-bold">{t('welcomeEureka')}</span> {t('manifestDesc')}
              </p>
            </Col>
          </Row>
        </section>
        {/* <Masonry
          breakpointCols={{
            default: 3,
            1199: 3,
            768: 2,
            576: 1,
          }}
          className="d-flex mt-5"
        > */}
        <Row>
          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(1, 1) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
                onClick={() => toggleBox(1, 1)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow1Box1}`} />
                <h2 className="h3 text-start">{t('manifestRow1Box1Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(1, 1) && (
              <aside
                className="cursor-pointer bg-very-light-secondary text-darkgray"
                onClick={() => toggleBox(1, 1)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow1Box1Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow1Box1Desc')}</p>
              </aside>
            )}
          </Col>

          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(1, 2) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
                onClick={() => toggleBox(1, 2)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow1Box2}`} />
                <h2 className="h3 text-start">{t('manifestRow1Box2Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(1, 2) && (
              <aside
                className="cursor-pointer bg-very-light-yellow text-darkgray"
                onClick={() => toggleBox(1, 2)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow1Box2Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow1Box2Desc')}</p>
              </aside>
            )}
          </Col>

          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(1, 3) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
                onClick={() => toggleBox(1, 3)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow1Box3}`} />
                <h2 className="h3 text-start">{t('manifestRow1Box3Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(1, 3) && (
              <aside
                className="cursor-pointer bg-very-light-secondary text-darkgray"
                onClick={() => toggleBox(1, 3)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow1Box3Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow1Box3Desc')}</p>
              </aside>
            )}
          </Col>
        </Row>
        {/* row 2     */}
        <Row>
          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(2, 1) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
                onClick={() => toggleBox(2, 1)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow2Box1}`} />
                <h2 className="h3 text-start">{t('manifestRow2Box1Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(2, 1) && (
              <aside
                className="cursor-pointer bg-very-light-yellow text-darkgray"
                onClick={() => toggleBox(2, 1)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow2Box1Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow2Box1Desc')}</p>
              </aside>
            )}
          </Col>

          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(2, 2) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
                onClick={() => toggleBox(2, 2)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow2Box2}`} />
                <h2 className="h3 text-start">{t('manifestRow2Box2Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(2, 2) && (
              <aside
                className="cursor-pointer bg-very-light-secondary text-darkgray"
                onClick={() => toggleBox(2, 2)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow2Box2Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow2Box2Desc')}</p>
              </aside>
            )}
          </Col>

          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(2, 3) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
                onClick={() => toggleBox(2, 3)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow2Box3}`} />
                <h2 className="h3 text-start">{t('manifestRow2Box3Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(2, 3) && (
              <aside
                className="cursor-pointer bg-very-light-yellow text-darkgray"
                onClick={() => toggleBox(2, 3)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow2Box3Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow2Box3Desc')}</p>
              </aside>
            )}
          </Col>
        </Row>
        {/* row 3     */}
        <Row>
          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(3, 1) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
                onClick={() => toggleBox(3, 1)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow3Box1}`} />
                <h2 className="h3 text-start">{t('manifestRow3Box1Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(3, 1) && (
              <aside
                className="cursor-pointer bg-very-light-secondary text-darkgray"
                onClick={() => toggleBox(3, 1)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow3Box1Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow3Box1Desc')}</p>
              </aside>
            )}
          </Col>

          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(3, 2) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
                onClick={() => toggleBox(3, 2)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow3Box2}`} />
                <h2 className="h3 text-start">{t('manifestRow3Box2Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(3, 2) && (
              <aside
                className="cursor-pointer bg-very-light-yellow text-darkgray"
                onClick={() => toggleBox(3, 2)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow3Box2Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow3Box2Desc')}</p>
              </aside>
            )}
          </Col>

          <Col xs={12} md={6} lg={4} className=" p-3 ms-0">
            {!isVisible(3, 3) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
                onClick={() => toggleBox(3, 3)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow3Box3}`} />
                <h2 className="h3 text-start">{t('manifestRow3Box3Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(3, 3) && (
              <aside
                className="cursor-pointer bg-very-light-secondary text-darkgray"
                onClick={() => toggleBox(3, 3)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow3Box3Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow3Box3Desc')}</p>
              </aside>
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} className=" p-3 ms-0">
            {!isVisible(4, 1) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
                onClick={() => toggleBox(4, 1)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow4Box1}`} />
                <h2 className="h3 text-start">{t('manifestRow4Box1Title')}</h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(4, 1) && (
              <aside
                className="cursor-pointer bg-very-light-secondary text-darkgray"
                onClick={() => toggleBox(4, 1)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow4Box1Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow4Box1Desc')}</p>
                <ul>
                  <li className="fs-6">{t('manifestRow4Box1Desc1')}</li>
                  <li className="fs-6">{t('manifestRow4Box1Desc2')}</li>
                  <li className="fs-6">{t('manifestRow4Box1Desc3')}</li>
                  <li className="fs-6">{t('manifestRow4Box1Desc4')}</li>
                  <li className="fs-6">{t('manifestRow4Box1Desc5')}</li>
                </ul>
              </aside>
            )}
          </Col>

          <Col xs={12} md={6} className=" p-3 ms-0">
            {!isVisible(4, 2) && (
              <section
                style={{ height: '250px' }}
                className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
                onClick={() => toggleBox(4, 2)}
                role="presentation"
              >
                <aside className={`${styles.box} ${styles.bgRow4Box2}`} />
                <h2 className="h3 text-start">
                  {t('manifestRow4Box2Title')} 
                </h2>
                <h5 className="cursor-pointer fs-6">
                  {t('learnMore')} <CgArrowLongRight />
                </h5>
              </section>
            )}

            {isVisible(4, 2) && (
              <aside
                className="cursor-pointer bg-very-light-yellow text-darkgray"
                onClick={() => toggleBox(4, 2)}
                role="presentation"
              >
                <h2 className="fs-6 fw-bolder text-secondary p-2">{t('manifestRow4Box2Title')}</h2>
                <p className="p-2 m-0 text-wrap text-start fs-6">{t('manifestRow4Box2Desc')}</p>
              </aside>
            )}
          </Col>
        </Row>
        {/* </Masonry> */}

        <br />
        <hr />
        <br />

        <section className="mb-5">
          <Row>
            <Col xs={12} md={4} className="pe-2 me-0 d-flex align-items-center justify-content-center">
              <RiAlertLine
                className="text-yellow"
                style={{ opacity: '.7', fontSize: '15em', margin: '-.3em -.5em 0 -.3em' }}
              />
              <h2 className="h1 fw-bolder text-secondary mb-5 me-4" style={{ zIndex: 9999 }}>
                {t('enforcement')}
              </h2>
            </Col>
            <Col xs={12} md={8} className="ms-0 border-start border-info border-2">
              <h2 className="h6 fw-bolder">{t('enforcementHeadLbl')}</h2>
              <ol>
                <li>{t('manifestEnforcement1')}</li>
                <li>{t('manifestEnforcement2')}</li>
                <li>{t('manifestEnforcement3')}</li>
                <li>{t('manifestEnforcement4')}</li>
                <li>{t('manifestEnforcement5')}</li>
                <li>{t('manifestEnforcement6')}</li>
                <li>{t('manifestEnforcement7')}</li>
              </ol>
              <p>
                {t('enforcementFooterLbl')}
                <a href="mailto:hola@eureka.club">hola@eureka.club</a>
              </p>
            </Col>
          </Row>
        </section>
       <section className="mb-5">
         <Row>
        <span>{t('AgreeText')}
          <Link legacyBehavior  href="/policy" passHref>
              <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t('policyText')}</span>
           </Link>
        </span>
        </Row>
       </section> 
      </Container>
    </SimpleLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
  
};

export default ManifestPage;
