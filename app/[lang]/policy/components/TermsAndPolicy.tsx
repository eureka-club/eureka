"use client"
import { FunctionComponent } from 'react';
import Link from 'next/link'
import styles from './TermsAndPolicy.module.css';
import { Container, Grid } from '@mui/material';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t as t_} from '@/src/get-dictionary';

interface Props {
}

const TermsAndPolicy: FunctionComponent<Props> = ({ }) => {
  const{t,dict}=useDictContext()

  return <Container>
    <Grid container className='d-flex justify-content-between'>
      <Grid item className={`col-12`}>
        <h1 className={`${styles.title} mb-4`} >{t(dict,'policyText')}</h1>

        <section>
          <span>{t(dict,'AgreeText')}{` `}
            <Link href="/manifest" passHref>
              <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t(dict,'Manifesto')}</span>
            </Link>
          </span>
        </section>
        <div className={`${styles.contentText}`}>
          <p>{t(dict,'policyIntro1')}</p>

          <p>{t(dict,'policyIntro2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

          <p>{t(dict,'policyIntro3')} <a href="https://www.generateprivacypolicy.com/">{t(dict,'linkPolicyGenerator')}</a>.</p>


          <h2>{t(dict,'title5')}</h2>

          <p>{t(dict,'title5P1')}</p>

          <p>{t(dict,'title5P2')} <a href="https://www.generateprivacypolicy.com/#cookies">{t(dict,'LinkTitle5P2')}</a>.</p>


          <p>{t(dict,'title7P2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

        </div>
      </Grid>
    </Grid>
  </Container>
};

export default TermsAndPolicy;
