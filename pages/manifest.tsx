import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState /* , useEffect, ReactElement, Children */ } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import { RiAlertLine } from 'react-icons/ri';
import Masonry from 'react-masonry-css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import styles from './manifest.module.css';

const ManifestPage: NextPage = () => {
  const { t } = useTranslation('common');

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

  return (
    <SimpleLayout title={t('browserTitleWelcome')}>
      <Container>
        <section className="mb-5">
          <Row>
            <Col xs={12} md={4} className="pr-0 mr-0 d-flex flex-column">
              <h1 className="h1 text-primary">
                {t('manifestLbl')} <br />
                Eureka <BsCircleFill style={{ fontSize: '.2em' }} />{' '}
              </h1>
              <em className="d-block">{t('eurekaPrinciple')}</em>
            </Col>
            <Col xs={12} md={8} className="ml-0" style={{ borderLeft: 'solid 2px var(--info)' }}>
              <p>
                <span>{t('welcomeEureka')}</span> {t('manifestDesc')}
              </p>
            </Col>
          </Row>
        </section>
        <Masonry
          breakpointCols={{
            default: 3,
            1199: 3,
            768: 2,
            576: 1,
          }}
          className="d-flex mt-5"
        >
          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(1, 1) && (
              <section className="p-3 bg-secondary text-white" onClick={() => toggleBox(1, 1)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow1Box1}`} />
                <h2 className="h3 text-left">{t('manifestRow1Box1Title')}</h2>
              </section>
            )}

            {isVisible(1, 1) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(1, 1)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow1Box1Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow1Box1Desc')}</p>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(1, 2) && (
              <section className="p-3 bg-warning text-secondary" onClick={() => toggleBox(1, 2)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow1Box2}`} />
                <h2 className="h3 text-left">{t('manifestRow1Box2Title')}</h2>
              </section>
            )}

            {isVisible(1, 2) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(1, 2)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow2Box1Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow1Box2Desc')}</p>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(1, 3) && (
              <section className="p-3 bg-secondary text-white" onClick={() => toggleBox(1, 3)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow1Box3}`} />
                <h2 className="h3 text-left">{t('manifestRow1Box3Title')}</h2>
              </section>
            )}

            {isVisible(1, 3) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(1, 3)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow3Box1Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow1Box3Desc')}</p>
              </aside>
            )}
          </article>

          {/* row 2     */}

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(2, 1) && (
              <section className="p-3 bg-warning text-secondary" onClick={() => toggleBox(2, 1)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow2Box1}`} />
                <h2 className="h3 text-left">{t('manifestRow2Box1Title')}</h2>
              </section>
            )}

            {isVisible(2, 1) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(2, 1)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow2Box1Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow2Box1Desc')}</p>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(2, 2) && (
              <section className="p-3 bg-secondary text-white" onClick={() => toggleBox(2, 2)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow2Box2}`} />
                <h2 className="h3 text-left">{t('manifestRow2Box2Title')}</h2>
              </section>
            )}

            {isVisible(2, 2) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(2, 2)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow2Box2Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow2Box2Desc')}</p>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(2, 3) && (
              <section className="p-3 bg-warning text-secondary" onClick={() => toggleBox(2, 3)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow2Box3}`} />
                <h2 className="h3 text-left">{t('manifestRow2Box3Title')}</h2>
              </section>
            )}

            {isVisible(2, 3) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(2, 3)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow2Box3Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow2Box3Desc')}</p>
              </aside>
            )}
          </article>

          {/* row 3     */}

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(3, 1) && (
              <section className="p-3 bg-secondary text-white" onClick={() => toggleBox(3, 1)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow3Box1}`} />
                <h2 className="h3 text-left">{t('manifestRow3Box1Title')}</h2>
              </section>
            )}

            {isVisible(3, 1) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(3, 1)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow3Box1Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow3Box1Desc')}</p>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(3, 2) && (
              <section className="p-3 bg-warning text-secondary" onClick={() => toggleBox(3, 2)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow3Box2}`} />
                <h2 className="h3 text-left">{t('manifestRow3Box2Title')}</h2>
              </section>
            )}

            {isVisible(3, 2) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(3, 2)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow3Box2Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow3Box2Desc')}</p>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(3, 3) && (
              <section className="p-3 bg-secondary text-white" onClick={() => toggleBox(3, 3)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow3Box3}`} />
                <h2 className="h3 text-left">
                  {t('manifestRow3Box3Title')} <span className="text-secondary">{t('manifestRow3Box3Title')}</span>
                </h2>
              </section>
            )}

            {isVisible(3, 3) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(3, 3)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow3Box3Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow3Box3Desc')}</p>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(4, 1) && (
              <section className="p-3 bg-secondary text-white" onClick={() => toggleBox(4, 1)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow4Box1}`} />
                <h2 className="h3 text-left">{t('manifestRow4Box1Title')}</h2>
              </section>
            )}

            {isVisible(4, 1) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(4, 1)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow4Box1Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow4Box1Desc')}</p>
                <ul>
                  <li>{t('manifestRow4Box1Desc1')}</li>
                  <li>{t('manifestRow4Box1Desc2')}</li>
                  <li>{t('manifestRow4Box1Desc3')}</li>
                  <li>{t('manifestRow4Box1Desc4')}</li>
                  <li>{t('manifestRow4Box1Desc5')}</li>
                </ul>
              </aside>
            )}
          </article>

          <article className="cursor-pointer p-3 rounded d-flex justify-content-center align-items-center ml-0">
            {!isVisible(4, 2) && (
              <section className="p-3 bg-warning text-secondary" onClick={() => toggleBox(4, 2)} role="presentation">
                <aside className={`${styles.box} ${styles.bgRow4Box2}`} />
                <h2 className="h3 text-left">
                  {t('manifestRow4Box2Title')} <span className="text-warning">{t('manifestRow4Box2Title')}</span>
                </h2>
              </section>
            )}

            {isVisible(4, 2) && (
              <aside className="bg-white text-darkgray" onClick={() => toggleBox(4, 2)} role="presentation">
                <h2 className="fs-6 fw-bolder">{t('manifestRow4Box2Title')}</h2>
                <p className="p-0 m-0 text-wrap text-left fs-6">{t('manifestRow4Box2Desc')}</p>
              </aside>
            )}
          </article>
        </Masonry>

        <hr />

        <section className="mb-5">
          <Row>
            <Col xs={12} md={4} className="pr-0 mr-0 d-flex align-items-center justify-content-center">
              <RiAlertLine
                className="text-warning"
                style={{ opacity: '.5', fontSize: '8em', margin: '-.3em -.5em 0 0' }}
              />
              <h1 className="h1 text-secondary">{t('enforcement')}</h1>
            </Col>
            <Col xs={12} md={8} className="ml-0" style={{ borderLeft: 'solid 2px var(--info)' }}>
              <h2 className="h5">{t('enforcementHeadLbl')}</h2>
              <ol>
                <li>{t('manifestEnforcement1')}</li>
                <li>{t('manifestEnforcement2')}</li>
                <li>{t('manifestEnforcement3')}</li>
                <li>{t('manifestEnforcement4')}</li>
                <li>{t('manifestEnforcement5')}</li>
                <li>{t('manifestEnforcement6')}</li>
                <li>{t('manifestEnforcement7')}</li>
              </ol>
              <p>{t('enforcementFooterLbl')}</p>
            </Col>
          </Row>
        </section>
      </Container>
    </SimpleLayout>
  );
};

export default ManifestPage;
