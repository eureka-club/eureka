import { NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import Image from 'next/image';
import className from 'classnames';

import {
  TiSocialLinkedinCircular,
} from 'react-icons/ti';
import { SiUpwork } from 'react-icons/si';
import styles from './aboutUs.module.css';

import SimpleLayout from '../src/components/layouts/SimpleLayout';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('aboutUs');

  return (<>
    <Head>
        <meta name="title" content={t('meta:aboutUsTitle')}></meta>
        <meta name="description" content={t('meta:aboutUsDescription')}></meta>
    </Head> 
    <SimpleLayout title={t('browserTitle')}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="text-secondary fw-bold">{t('title')}</h1>
      </div>
      <br />
      <br />
      <div className="middle-container">
        <Container fluid="md">
          <Row>
            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/julie_ricard.webp"
                alt="Founder, Director"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Julie Ricard
                <a href="https://www.linkedin.com/in/ricardjulie/" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Founder, Director')}</h3>
              <h4 className={styles.positionName}>{t('Researcher and technologist')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('social justice')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('intersectional feminism')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('disinformation')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/alejandro_noriega.jpeg"
                alt="Co-creator from Prosperia"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Alejandro Noriega
                <a
                  href="https://www.linkedin.com/in/alejandro-noriega-campero-40305637/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Co-creator from Prosperia')}</h3>
              <h4 className={styles.positionName}>{t('AI and technology expert')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('artificial intelligence')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('social policies')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('public health')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/geordanis_bano_vega.png"
                alt="Picture of Software Engineer"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Geordanis Baño Vega
                <a href="https://linkedin.com/in/geordanis-baño-vega-488a1863/" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Software Engineer')}</h3>
              <h4 className={styles.positionName}>{t('Full-stack expert')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('environment')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('good cinema')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('music')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/jose-manuel-gallardo.webp"
                alt="Picture of Software Engineer"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                José Manuel Gallardo
                <a href="https://www.linkedin.com/in/jose-manuel-gallardo-1a13a8100/" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Software Engineer')}</h3>
              <h4 className={styles.positionName}>{t('Front-end expert')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('History')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('music')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('Nature')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/aime_cruz.webp"
                alt="Picture of Software Engineer"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Aimé Cruz
                <a href="https://www.linkedin.com/in/aim%C3%A9-rub%C3%AD-cruz-ruiz-72776113b/ " target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Communications Officer')}</h3>
              <h4 className={styles.positionName}>{t('Graphic design and social media expert')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('Communications')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('Graphic design')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('Social Media')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/daniela-goncalves.jpeg"
                alt="Picture of Advisor"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Daniela Gonçalves
                <a href="https://www.linkedin.com/in/daniela-gonçalves-565aba50/" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Advisor')}</h3>
              <h4 className={styles.positionName}>{t('Cinema and documentary expert')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('anthropology')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('cultural heritage and memory')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('education')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/aranzazu-zaga.jpeg"
                alt="Picture of Advisor"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Aranzazu Zaga
                <a href="https://www.linkedin.com/in/aranzazuzg/" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Advisor')}</h3>
              <h4 className={styles.positionName}>{t('Narrative and public affairs expert')}</h4>
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('Communication')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('Crisis management')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('Public relations')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/fernanda-pacheco.jpeg"
                alt="Picture of UI-UX Consultant"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Fernanda Pacheco
                <a href="https://www.upwork.com/freelancers/fernandaland" target="_blank" rel="noreferrer">
                  <SiUpwork className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('UI-UX Consultant')}</h3>
              <h4 className={styles.positionName}>{t('UX/UI Web & App designer')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('technology')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('watersports')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('foodie')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/don-zamna.jpeg"
                alt="Picture of Mastermind"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Don Zamna
                <a href="https://linkedin.com/company/eleurekaclub" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Mastermind')}</h3>
              <h4 className={styles.positionName}>{t('Napping expert')}</h4>
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('birds')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('sleeping')}
              </Badge>
              <br />
              <Badge pill className={`badge-secondary ${styles.interest}`}>
                {t('music')}
              </Badge>
            </Col>
          </Row>
        </Container>
        <div style={{ textAlign: 'center', marginBottom: '4em' }}>
          <div className={styles.thanks}>
            <hr />
            <h5 className='h4' style={{ color: 'var(--eureka-green)' }}>
              {t('We are grateful for Eureka’s many friends that support us in a variety of ways!')}
            </h5>
            <p>
              Roland Trompette, Giovanna Salazar, Maïssa Hubert Chakour, Amy Shapiro Raikar, Jessie Keating, Jacques
              Ricard, Ricardo Sanginés, Rafael Millán
            </p>
          </div>

          <div className={styles['contact-me']}>
            <br />
            <hr />
            <h5 className='h4' style={{ color: 'var(--eureka-green)' }}>{t('common:eurekaSupport')}</h5>
            <img
              className={styles['logo-img2']}
              src="https://mozilla.design/files/2019/06/Mozilla_Logo_Static.png"
              alt=""
            />
            <img
              className={styles['logo-img3']}
              src="/equis.jpg"
              alt=""
            />
            <img
              className={styles['logo-img']}
              src="https://datapopalliance.org/wp-content/uploads/2019/02/DPA-Logo-Color.png"
              alt=""
            />
            <img
              className={styles['logo-img']}
              src="https://static.wixstatic.com/media/9c73d4_6be410789c004ed2b2281f0b7503645f~mv2.png/v1/fill/w_1046,h_700,al_c,q_90,usm_0.66_1.00_0.01/Logo%20-%20prosperia%20only%20-%20E%20normal%20-%20point.webp"
              alt=""
            />
          </div>         
        </div>
      </div>
    </SimpleLayout>
    </>
  );
};
export default AboutPage;
