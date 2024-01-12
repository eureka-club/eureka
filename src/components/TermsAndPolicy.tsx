/* eslint-disable react/no-unescaped-entities */
import { signIn } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans'
import { FormEvent, FunctionComponent, MouseEvent,useRef } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useMutation } from "react-query";
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import styles from './TermsAndPolicy.module.css';

const TermsAndPolicy: FunctionComponent = () => {
  const { t } = useTranslation('termsAndPolicy');

  return (
    <>
    <Container className='p-lg-0 m-lg-0'>
    <Row className='d-flex justify-content-between'>
          <Col className={`col-12`}>
          <h1 className={`${styles.title} mb-4`} >{t('policyText')}</h1>

          <Row>
            <span>{t('AgreeText')}
              <Link legacyBehavior  href="/manifest" passHref>
                  <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t('Manifesto')}</span>
              </Link>
            </span>
          </Row>
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
          </Col>
          </Row>
          </Container>
          </>
  );
};

export default TermsAndPolicy;
