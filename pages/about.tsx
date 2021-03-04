import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '../src/components/layouts/SimpleLayout';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('common');

  <>
    <meta charSet="utf-8" />
    <link rel="stylesheet" href="_app.css" />
  </>

  return (
    <SimpleLayout title={t('browserTitleAbout')}>
      {/* Language=css */}
      <style jsx>{`
        h1 {
          color: var(--eureka-green);
        }
      `}</style>

      <div style={{textAlign: 'center'}}> <h1>{t('aboutPageHeading')}</h1></div>
      <br />
      <br />
      <div className="middle-container">
        <h1>{t('aboutHeading')}</h1>
        <p className="summary">{t('aboutText')}</p>
        <hr />
        <div className="what-is2">
          <h1>{t('whatisCycleHeading')}</h1>
          <p className="summary">{t('whatisCycleText')}</p>
        </div>
        <div className="what-is1">
          <h1>{t('whatisPostHeading')}</h1>
          <p className="summary">{t('whatisPostText')}</p>
        </div>
        <hr />
        <br />
        <h1>{t('ethicsHeading')}</h1>
        <p className="summary">{t('ethicsText1')} <a href="https://www.mozilla.org/en-US/about/governance/policies/participation/"> {t('hereLink')}</a>).</p>
        <p className="summary">{t('ethicsText2')}</p>
        <p>{t('ethicsText3')}</p>
        <ul style={{ textAlign: 'left' }}>
          <li>{t('violence')}</li>
          <li>{t('attacks')}</li>
          <li>{t('language')}</li>
          <li>{t('harrassment')}</li>
        </ul>
        <p><em>{t('ethicsText4')}</em></p>
        <hr />
        <div className="contact-me">
          <br />
          <h4>{t('eurekaSupport')}</h4>
          <img className="logo-img2" src="https://mozilla.design/files/2019/06/Mozilla_Logo_Static.png" alt />
          <img className="logo-img3" src="https://pbs.twimg.com/profile_images/687011340104273920/lvROD7bu_400x400.png" alt />
          <img className="logo-img" src="https://datapopalliance.org/wp-content/uploads/2019/02/DPA-Logo-Color.png" alt />
          <img className="logo-img" src="https://static.wixstatic.com/media/9c73d4_6be410789c004ed2b2281f0b7503645f~mv2.png/v1/fill/w_1046,h_700,al_c,q_90,usm_0.66_1.00_0.01/Logo%20-%20prosperia%20only%20-%20E%20normal%20-%20point.webp" alt />
        </div>
        <p>{t('contact')} <a href="mailto:hola@eureka.club ">hola@eureka.club</a></p>
      </div>

    </SimpleLayout>
  );
};

export default AboutPage;
