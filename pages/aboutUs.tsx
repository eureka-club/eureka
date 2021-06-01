import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import Image from 'next/image';
import {
  TiSocialTwitterCircular,
  TiSocialFacebookCircular,
  TiSocialInstagramCircular,
  TiSocialLinkedinCircular,
} from 'react-icons/ti';
import SimpleLayout from '../src/components/layouts/SimpleLayout';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('aboutUs');

  return (
    <SimpleLayout title={t('browserTitle')}>
      {/* Language=css */}
      <style jsx>{`
        .middle-container {
          margin: auto;
        }
        h1 {
          color: var(--eureka-green);
        }
        h2,
        h3 {
          font-size: 1.2em;
        }
        h2 {
          color: var(--eureka-green);
          margin-top: 1em;
        }
        h4 {
          font-size: 1em;
          color: black;
        }
        .infoContainer {
          text-align: center;
        }

        .logo-img {
          max-width: 180px;
          max-height: 140px;
          padding: 10px 30px 40px 30px;
          vertical-align: middle;
        }

        .logo-img2 {
          max-width: 180px;
          padding: 10px 30px 40px 30px;
          vertical-align: middle;
        }

        .logo-img3 {
          max-width: 180px;
          max-height: 160px;
          padding: 10px 30px 40px 30px;
          vertical-align: middle;
        }

        .rounded-circle {
          border-radius: 50% !important;
        }
        .thanks {
          width: 50%;
          margin: auto;
        }
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <h1>{t('title')}</h1>
      </div>
      <br />
      <br />
      <div className="middle-container">
        <Container fluid="md">
          <Row>
            <Col style={{ textAlign: 'center', marginBottom: '5em' }} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/julie_ricard.jpg"
                alt="Founder, Director"
                width={180}
                height={180}
              />
              <h2 className="peopleName">Julie Ricard</h2>
              <h3 className="professionName">{t('Founder, Director')}</h3>
              <h4 className="positionName">{t('Researcher and technologist')}</h4>
              <Badge pill variant="secondary">
                {t('social justice')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('intersectional feminism')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('disinformation')}
              </Badge>
            </Col>

            <Col style={{ textAlign: 'center', marginBottom: '5em' }} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/alejandro_noriega.jpeg"
                alt="Co-creator from Prosperia"
                width={180}
                height={180}
              />
              <h2 className="peopleName">Alejandro Noriega</h2>
              <h3 className="professionName">{t('Co-creator from Prosperia')}</h3>
              <h4 className="positionName">{t('AI and technology expert')}</h4>
              <Badge pill variant="secondary">
                {t('artificial intelligence')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('social policies')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('public health')}
              </Badge>
            </Col>

            <Col style={{ textAlign: 'center', marginBottom: '5em' }} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/geordanis_bano_vega.png"
                alt="Picture of Software Engineer"
                width={180}
                height={180}
              />
              <h2 className="peopleName">Geordanis Baño Vega</h2>
              <h3 className="professionName">{t('Software Engineer')}</h3>
              <h4 className="positionName">{t('Full-stack expert')}</h4>
              <Badge pill variant="secondary">
                {t('environment')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('good cinema')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('music')}
              </Badge>
            </Col>

            <Col style={{ textAlign: 'center', marginBottom: '5em' }} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/igor_hlina.jpg"
                alt="Picture of Software Engineer"
                width={180}
                height={180}
              />
              <h2 className="peopleName">Igor Hlina</h2>
              <h3 className="professionName">{t('Full-stack developer (via Toptal)')}</h3>
              <h4 className="positionName">{t('Devops and front-end expert')}</h4>
              <Badge pill variant="secondary">
                {t('electronics')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('swimming')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('beatbox')}
              </Badge>
            </Col>

            <Col style={{ textAlign: 'center', marginBottom: '5em' }} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/daniela-goncalves.jpeg"
                alt="Picture of Advisor"
                width={180}
                height={180}
              />
              <h2 className="peopleName">Daniela Gonçalves</h2>
              <h3 className="professionName">{t('Advisor')}</h3>
              <h4 className="positionName">{t('Cinema and documentary expert')}</h4>
              <Badge pill variant="secondary">
                {t('anthropology')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('cultural heritage and memory')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('education')}
              </Badge>
            </Col>

            <Col style={{ textAlign: 'center', marginBottom: '5em' }} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/fernanda-pacheco.jpeg"
                alt="Picture of UI-UX Consultant"
                width={180}
                height={180}
              />
              <h2 className="peopleName">Fernanda Pacheco</h2>
              <h3 className="professionName">{t('UI-UX Consultant')}</h3>
              <h4 className="positionName">{t('UX/UI Web & App designer')}</h4>
              <Badge pill variant="secondary">
                {t('technology')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('watersports')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('foodie')}
              </Badge> 
            </Col>

            <Col style={{ textAlign: 'center', marginBottom: '5em' }} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src="/img/aboutUs/don-zamna.jpeg"
                alt="Picture of Mastermind"
                width={180}
                height={180}
              />
              <h2 className="peopleName">Don Zamna</h2>
              <h3 className="professionName">{t('Mastermind')}</h3>
              <h4 className="positionName">{t('Napping expert')}</h4>
              <Badge pill variant="secondary">
                {t('birds')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('sleeping')}
              </Badge>
              <br />
              <Badge pill variant="secondary">
                {t('music')}
              </Badge>
            </Col>
          </Row>
        </Container>
        <div style={{ textAlign: 'center', marginBottom: '4em' }}>
          <div className="thanks">
            <p style={{ color: 'var(--eureka-green)' }}>
              {t('We are grateful for Eureka’s many friends that support us in a variety of ways!')}
            </p>
            <p>
              Roland Trompette, Aranzazu Zacarias, Ricardo Sanginés, Jacques Ricard, Rafael Millán, Daniel C. Zorrilla,
              Giovana Salazar, Amy Shapiro Raikar, Jessie Keating
            </p>
          </div>

          <div className="contact-me">
            <br />
            <h4 style={{ color: 'var(--eureka-green)' }}>{t('common:eurekaSupport')}</h4>
            <img className="logo-img2" src="https://mozilla.design/files/2019/06/Mozilla_Logo_Static.png" alt="" />
            <img
              className="logo-img3"
              src="https://pbs.twimg.com/profile_images/687011340104273920/lvROD7bu_400x400.png"
              alt=""
            />
            <img
              className="logo-img"
              src="https://datapopalliance.org/wp-content/uploads/2019/02/DPA-Logo-Color.png"
              alt=""
            />
            <img
              className="logo-img"
              src="https://static.wixstatic.com/media/9c73d4_6be410789c004ed2b2281f0b7503645f~mv2.png/v1/fill/w_1046,h_700,al_c,q_90,usm_0.66_1.00_0.01/Logo%20-%20prosperia%20only%20-%20E%20normal%20-%20point.webp"
              alt=""
            />
          </div>
          <p>
            {t('common:contact')} <a href="mailto:hola@eureka.club ">hola@eureka.club</a>
          </p>
          <p>{t('Follow us on social media')}:</p>
          <a href="https://twitter.com/eleurekaclub">
            <TiSocialTwitterCircular style={{ color: '#63cab0', fontSize: '4em', cursor: 'pointer' }} />
          </a>
          <a href="https://facebook.com/eleurekaclub">
            <TiSocialFacebookCircular style={{ color: '#63cab0', fontSize: '4em', cursor: 'pointer' }} />
          </a>
          <a href="https://instagram.com/eleurekaclub">
            <TiSocialInstagramCircular style={{ color: '#63cab0', fontSize: '4em', cursor: 'pointer' }} />
          </a>
          <a href="https://linkedin.com/company/eleurekaclub">
            <TiSocialLinkedinCircular style={{ color: '#63cab0', fontSize: '4em', cursor: 'pointer' }} />
          </a>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default AboutPage;
