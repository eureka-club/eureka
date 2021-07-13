import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import Image from 'next/image';
import className from 'classnames';

import {
  TiSocialTwitterCircular,
  TiSocialFacebookCircular,
  TiSocialInstagramCircular,
  TiSocialLinkedinCircular,
} from 'react-icons/ti';
import { SiUpwork, SiToptal } from 'react-icons/si';
import { RiMailLine } from 'react-icons/ri';
import styles from './aboutUs.module.css';

import SimpleLayout from '../src/components/layouts/SimpleLayout';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('aboutUs');

  return (
    <SimpleLayout title={t('browserTitle')}>
      <div style={{ textAlign: 'center' }}>
        <h1 className={styles.title}>{t('title')}</h1>
      </div>
      <br />
      <br />
      <div className="middle-container">
        <Container fluid="md">
          <Row>
            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/julie_ricard.jpg"
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
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('social justice')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('intersectional feminism')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
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
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('artificial intelligence')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('social policies')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
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
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('environment')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('good cinema')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('music')}
              </Badge>
            </Col>

            <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/igor_hlina.jpg"
                alt="Picture of Full-stack developer (via Toptal)"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Igor Hlina (via Toptal)
                <a href="https://www.toptal.com/resume/igor-hlina" target="_blank" rel="noreferrer">
                  <SiToptal className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Full-stack developer')}</h3>
              <h4 className={styles.positionName}>{t('Devops and front-end expert')}</h4>
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('electronics')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('swimming')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('beatbox')}
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
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('anthropology')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('cultural heritage and memory')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
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
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('technology')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('watersports')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
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
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('birds')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('sleeping')}
              </Badge>
              <br />
              <Badge pill className={className('badge-secondary', styles.interest)}>
                {t('music')}
              </Badge>
            </Col>
          </Row>
        </Container>
        <div style={{ textAlign: 'center', marginBottom: '4em' }}>
          <div className={styles.thanks}>
            <hr />
            <h4 style={{ color: 'var(--eureka-green)' }}>
              {t('We are grateful for Eureka’s many friends that support us in a variety of ways!')}
            </h4>
            <p>
              Roland Trompette, Aranzazu Zacarias, Ricardo Sanginés, Jacques Ricard, Rafael Millán, Daniel C. Zorrilla,
              Giovana Salazar, Amy Shapiro Raikar, Jessie Keating
            </p>
          </div>

          <div className={styles['contact-me']}>
            <br />
            <hr />
            <h4 style={{ color: 'var(--eureka-green)' }}>{t('common:eurekaSupport')}</h4>
            <img
              className={styles['logo-img2']}
              src="https://mozilla.design/files/2019/06/Mozilla_Logo_Static.png"
              alt=""
            />
            <img
              className={styles['logo-img3']}
              src="https://pbs.twimg.com/profile_images/687011340104273920/lvROD7bu_400x400.png"
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

          <section className={styles.fallowsSection}>
            <h5 className={styles.fallowsSectionTitle}>{t('Follow us on social media')}:</h5>
            <a href="https://twitter.com/eleurekaclub">
              <TiSocialTwitterCircular className={styles.ti} />
            </a>
            <a href="https://facebook.com/eleurekaclub">
              <TiSocialFacebookCircular className={styles.ti} />
            </a>
            <a href="https://instagram.com/eleurekaclub">
              <TiSocialInstagramCircular className={styles.ti} />
            </a>
            <a href="https://linkedin.com/company/eleurekaclub">
              <TiSocialLinkedinCircular className={styles.ti} />
            </a>
            <a href="mailto:hola@eureka.club">
              <RiMailLine className={styles.ti} />
            </a>
          </section>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default AboutPage;
