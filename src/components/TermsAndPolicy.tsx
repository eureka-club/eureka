

// import Trans from 'next-translate/Trans'
import { FunctionComponent } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import styles from './TermsAndPolicy.module.css';
import { useDictContext } from '../hooks/useDictContext';


const TermsAndPolicy: FunctionComponent = () => {
  const { t, dict } = useDictContext();

  return (
    <>
    <Container className='p-lg-0 m-lg-0'>
    <Row className='d-flex justify-content-between'>
          <Col className={`col-12`}>
          <h1 className={`${styles.title} mb-4`} >{t(dict,'policyText')}</h1>

          <Row>
            <span>{t(dict,'AgreeText')}
              <Link legacyBehavior  href="/manifest" passHref>
                  <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t(dict,'Manifesto')}</span>
              </Link>
            </span>
          </Row>
           <div className={`${styles.contentText}`}> 
                <p>{t(dict,'policyIntro1')}</p>

                <p>{t(dict,'policyIntro2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

                <p>{t(dict,'policyIntro3')} <a href="https://www.generateprivacypolicy.com/">{t(dict,'linkPolicyGenerator')}</a>.</p>

              {/* <Trans
                i18nKey="termsAndPolicy:titles1To4"
                components={{ p: <p/>,
                h2: <h2/>,
                ul: <ul/>,
                li: <li/>,
              }}
              /> */}
                <h2>{t(dict,'title5')}</h2>

                <p>{t(dict,'title5P1')}</p>

                <p>{t(dict,'title5P2')} <a href="https://www.generateprivacypolicy.com/#cookies">{t(dict,'LinkTitle5P2')}</a>.</p>

              {/* <Trans
                i18nKey="termsAndPolicy:titles6To7"
                components={{ p: <p/>,
                h2: <h2/>,
                  ul: <ul/>,
                li: <li/>,
              }}
              /> */}
             <p>{t(dict,'title7P2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

              {/* <Trans
                i18nKey="termsAndPolicy:title8"
                components={{ p: <p/>,
                h2: <h2/>,
              }}
              /> */}

                
          </div>
          </Col>
          </Row>
          </Container>
          </>
  );
};

export default TermsAndPolicy;
