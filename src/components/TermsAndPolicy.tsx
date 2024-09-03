/* eslint-disable react/no-unescaped-entities */
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans'
import { FunctionComponent } from 'react';
import Link from 'next/link'
import styles from './TermsAndPolicy.module.css';
import { Stack } from '@mui/material';

const TermsAndPolicy: FunctionComponent = () => {
  const { t } = useTranslation('termsAndPolicy');

  return (
      <Stack gap={3}>
        <Stack gap={2}>
        <h1 className={`${styles.title}`} >{t('policyText')}</h1>
        <span>{t('AgreeText')}
          <Link href="/manifest" passHref>
              <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t('Manifesto')}</span>
          </Link>
        </span>
        </Stack>
        <div className={`${styles.contentText}`}> 
              <p>{t('policyIntro1')}</p>

              <p>{t('policyIntro2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

              <p>{t('policyIntro3')} <a href="https://www.generateprivacypolicy.com/">{t('linkPolicyGenerator')}</a>.</p>

            <Trans
              i18nKey="termsAndPolicy:titles1To4"
              components={{ p: <p/>,
              h2: <h2/>,
              ul: <ul/>,
              li: <li/>,
            }}
            />
              <h2>{t('title5')}</h2>

              <p>{t('title5P1')}</p>

              <p>{t('title5P2')} <a href="https://www.generateprivacypolicy.com/#cookies">{t('LinkTitle5P2')}</a>.</p>

            <Trans
              i18nKey="termsAndPolicy:titles6To7"
              components={{ p: <p/>,
              h2: <h2/>,
                ul: <ul/>,
              li: <li/>,
            }}
            />
            <p>{t('title7P2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

            <Trans
              i18nKey="termsAndPolicy:title8"
              components={{ p: <p/>,
              h2: <h2/>,
            }}
            />

              
        </div>
      </Stack>
  );
};

export default TermsAndPolicy;
