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
  const{dict}=useDictContext()
  const t=(s:string)=>t_(dict,s)

  return <Container>
    <Grid container className='d-flex justify-content-between'>
      <Grid item className={`col-12`}>
        <h1 className={`${styles.title} mb-4`} >{t('policyText')}</h1>

        <section>
          <span>{t('AgreeText')}{` `}
            <Link href="/manifest" passHref>
              <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t('Manifesto')}</span>
            </Link>
          </span>
        </section>
        <div className={`${styles.contentText}`}>
          <p>{t('policyIntro1')}</p>

          <p>{t('policyIntro2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

          <p>{t('policyIntro3')} <a href="https://www.generateprivacypolicy.com/">{t('linkPolicyGenerator')}</a>.</p>


          <h2>{t('title5')}</h2>

          <p>{t('title5P1')}</p>

          <p>{t('title5P2')} <a href="https://www.generateprivacypolicy.com/#cookies">{t('LinkTitle5P2')}</a>.</p>


          <p>{t('title7P2')} <a href="mailto:hola@eureka.club">hola@eureka.club</a>.</p>

        </div>
      </Grid>
    </Grid>
  </Container>
};

export default TermsAndPolicy;


