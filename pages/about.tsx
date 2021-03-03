import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '../src/components/layouts/SimpleLayout';

const AboutPage: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <SimpleLayout title={t('browserTitleAbout')}>
      {/* Language=css */}
      <style jsx>{`
        h1 {
          color: var(--eureka-green);
        }
      `}</style>

      <h1>{t('aboutPageHeading')}</h1>
      <p>Lorem ipsum dolor sit amet adiliscing elit.</p>
    </SimpleLayout>
  );
};

export default AboutPage;
