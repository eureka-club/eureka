import { NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '../src/components/layouts/SimpleLayout';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('common');

  return (<>
  <Head>
        <meta name="title" content={t('meta:aboutTitle')}></meta>
        <meta name="description" content={t('meta:aboutDescription')}></meta>
    </Head> 
    <SimpleLayout title={t('browserTitleAbout')}>
      {/* Language=css */}
      <style jsx>{`
        h1 {
          color: var(--eureka-green);
        }

        .middle-container {
          width: 60%;
          margin: auto;
        }

        .what-is1 {
          margin: 60px auto 40px auto;
          text-align: left;
          line-height: 1.5;
        }

        .what-is2 {
          margin: 60px auto 40px auto;
          text-align: right;
          line-height: 1.5;
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

        .bottom-container {
          padding-top: 20px;
          padding-bottom: 40px;
          background-color: var(--eureka-green);
        }

        .copyright {
          color: var(--text-color-light);
          font-size: 16px;
        }

        .summary {
          line-height: 2;
        }
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <h1 className="text-secondary fw-bold">{t('aboutPageHeading')}</h1>
      </div>
      <br />
      <hr />

      <div className="middle-container">
        <h2 className="h1 text-secondary">{t('aboutHeading')}</h2>
        <p className="summary">{t('aboutText')}</p>

        <div className="what-is2">
          <h2 className="h1 text-secondary">{t('whatisCycleHeading')}</h2>
          <p className="summary">{t('whatisCycleText')}</p>
        </div>

        <div className="what-is1">
          <h2 className="h1 text-secondary">{t('whatisPostHeading')}</h2>
          <p className="summary">{t('whatisPostText')}</p>
        </div>
        <hr />
        <br />

        <h3 className="h1 text-secondary">{t('ethicsHeading')}</h3>
        <p className="summary">
          {} <a href="https://www.eureka.club/manifest"> {t('ethicsText1')}</a>
          {/* <a href="https://www.mozilla.org/en-US/about/governance/policies/participation/"> {t('hereLinkENG')}</a>,{' '}
          <a href="https://www.mozilla.org/es-ES/about/governance/policies/participation/"> {t('hereLinkSPA')}</a>,{' '}
          <a href="https://www.mozilla.org/pt-BR/about/governance/policies/participation/"> {t('hereLinkPORT')}</a>,{' '}
          <a href="https://www.mozilla.org/fr/about/governance/policies/participation/"> {t('hereLinkFR')}</a>). */}
        </p>
        <p className="summary">{t('ethicsText2')}</p>
        <p>
          {t('ethicsText3')}
          <a href="mailto:hola@eureka.club">hola@eureka.club</a>
        </p>
        {/* <ul style={{ textAlign: 'left' }}>
          <li>{t('violence')}</li>
          <li>{t('attacks')}</li>
          <li>{t('language')}</li>
          <li>{t('harassment')}</li>
        </ul>
        <p>
          <em>{t('ethicsText4')}</em>
        </p> */}
        <hr className="my-5" />

        <div className="contact-me" />
      </div>
    </SimpleLayout>
    </>
  );
};

export default AboutPage;
