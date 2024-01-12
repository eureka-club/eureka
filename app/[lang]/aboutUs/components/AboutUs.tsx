"use client"
import Image from 'next/image';

import {
  TiSocialLinkedinCircular,
} from 'react-icons/ti';
import styles from './AboutUs.module.css';
import { FC } from "react";
import { Chip, Container, Grid } from '@mui/material';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t as t_} from '@/src/get-dictionary';

interface Props {
    NEXT_PUBLIC_AZURE_CDN_ENDPOINT:string;
    NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME:string;
}
const AboutUs:FC<Props> = ({NEXT_PUBLIC_AZURE_CDN_ENDPOINT,NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}) => {
  const{dict}=useDictContext()
  const t=(s:string)=>t_(dict,s)
  
  return (<Container>
      <div style={{ textAlign: 'center' }}>
        <h1 className="text-secondary fw-bold">{t('title')}</h1>
      </div>
      <br />
      <br />
      <div className="middle-container">
        <Container>
          <Grid container>
            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/julie_ricard.webp`}
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
            <Chip size="small" label={t('social justice')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('intersectional feminism')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('disinformation')} className={`1 ${styles.interest}`}/>
            </Grid>

            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/alejandro_noriega.jpeg`}
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
            <Chip size="small" label={t('artificial intelligence')} className={`1 ${styles.interest}`}/>
                
              <br />
            <Chip size="small" label={t('social policies')} className={`1 ${styles.interest}`}/>
                
              <br />
            <Chip size="small" label={t('public health')} className={`1 ${styles.interest}`}/>
                
              
            </Grid>

            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/geordanis_bano_vega.png`}
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
            <Chip size="small" label={t('environment')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('good cinema')} className={`1 ${styles.interest}`}/>
              <br/>
            <Chip size="small" label={t('music')} className={`1 ${styles.interest}`}/>
            </Grid>

            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/jose-manuel-gallardo.webp`}
                alt="Picture of Software Engineer"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                José Manuel Gallardo
                <a href="https://www.linkedin.com/in/jose-manuel-gallardo-1a13a8100/" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Software Engineer')}</h3>
              <h4 className={styles.positionName}>{t('Front-end expert')}</h4>
            <Chip size="small" label={t('History')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('music')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('Nature')} className={`1 ${styles.interest}`}/>
            </Grid>

            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/aime_cruz.webp`}
                alt="Picture of Software Engineer"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Aimé Cruz
                <a href="https://www.linkedin.com/in/aim%C3%A9-rub%C3%AD-cruz-ruiz-72776113b/ " target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Communications Officer')}</h3>
              <h4 className={styles.positionName}>{t('Graphic design and social media expert')}</h4>
            <Chip size="small" label={t('Communications')}  className={` ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('Graphic design')}  className={` ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('Social Media')}  className={` ${styles.interest}`}/>
            </Grid>
            
            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/amanda_gois.webp`}
                alt="Partnerships and Development"
                width={200}
                height={200}
              />
              <h2 className={styles.peopleName}>
                Amanda Quitério de Gois
                <a href="https://www.linkedin.com/in/amanda-quit%C3%A9rio-de-gois-0b5b111b5/" target="_blank" rel="noreferrer">
                  <TiSocialLinkedinCircular className={styles.si} />
                </a>
              </h2>
              <h3 className={styles.professionName}>{t('Partnerships and Development')}</h3>
              <h4 className={styles.positionName}>{t('Master in Literature')}</h4>    
            <Chip size="small" label={t('Gender and feminisms')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('Brazilian Popular Music')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('Books')} className={`1 ${styles.interest}`}/>
            </Grid>

            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/daniela-goncalves.jpeg`}
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
            <Chip size="small" label={t('anthropology')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('cultural heritage and memory')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('education')} className={`1 ${styles.interest}`}/>
            </Grid>

            <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
              <Image
                className="rounded-circle"
                src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/aranzazu-zaga.jpeg`}
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
            <Chip size="small" label={t('Communication')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('Crisis management')} className={`1 ${styles.interest}`}/>
              <br />
            <Chip size="small" label={t('Public relations')} className={`1 ${styles.interest}`}/>
            </Grid>

            <Grid container className='w-100 d-flex justify-content-center'>
              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/don-zamna.jpeg`}
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
              <Chip size="small" label={t('birds')} className={`1 ${styles.interest}`}/>
                <br />
              <Chip size="small" label={t('sleeping')} className={`1 ${styles.interest}`}/>
                <br />
              <Chip size="small" label={t('music')} className={`1 ${styles.interest}`}/>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <div style={{ textAlign: 'center', marginBottom: '4em' }}>
          <div className={styles.thanks}>
            <hr />
            <h5 className='h4' style={{ color: 'var(--eureka-green)' }}>
              {t('We are grateful for Eureka’s many friends that support us in a variety of ways!')}
            </h5>
            <p>
              Roland Trompette, Giovanna Salazar, Maïssa Hubert Chakour, Amy Shapiro Raikar, Jessie Keating, Jacques
              Ricard, Ricardo Sanginés, Rafael Millán
            </p>
          </div>

          <div className={styles['contact-me']}>
            <br />
            <hr />
            <h5 className='h4' style={{ color: 'var(--eureka-green)' }}>{t('common:eurekaSupport')}</h5>
            <section className='d-flex flex-row justify-content-around align-items-center mt-3'>
              <figure>
                <Image
                  width={120}
                  height={37}
                  src="https://mozilla.design/files/2019/06/Mozilla_Logo_Static.png"
                  alt=""
                />
              </figure>
              <figure>
                <Image
                  width={110}
                  height={110}
                  src="/equis.jpg"
                  alt=""
                />
              </figure>
              <figure>
                <Image
                  width={70}
                  height={90}
                  src="https://datapopalliance.org/wp-content/uploads/2019/02/DPA-Logo-Color.png"
                  alt=""
                />
              </figure>
              <figure>
                <Image
                  width={120}
                  height={80}
                  src="https://static.wixstatic.com/media/9c73d4_6be410789c004ed2b2281f0b7503645f~mv2.png/v1/fill/w_1046,h_700,al_c,q_90,usm_0.66_1.00_0.01/Logo%20-%20prosperia%20only%20-%20E%20normal%20-%20point.webp"
                  alt=""
                />
              </figure>
            </section>
          </div>
        </div>
      </div>
  </Container>
  );
};

export default AboutUs;
