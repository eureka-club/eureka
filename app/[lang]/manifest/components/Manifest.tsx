"use client"
import { useState,FC } from 'react';
import { BsCircleFill } from 'react-icons/bs';
import { RiAlertLine } from 'react-icons/ri';
import { CgArrowLongRight } from 'react-icons/cg';
import Link from 'next/link'

import styles from './Manifest.module.css';
import { Container, Grid } from '@mui/material';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t as t_} from '@/src/get-dictionary';

interface Props{
}
const Manifest:FC<Props> = ({})=>{
  const{t,dict}=useDictContext()

    const [show, setShow] = useState<Record<string, boolean>>({});

  const toggleBox = (rowNr: number, boxNr: number) => {
    const key = `${rowNr}!|!${boxNr}`;
    if (key in show) {
      setShow((s) => ({ ...s, [`${key}`]: !s[`${key}`] }));
    } else setShow((s) => ({ ...s, [`${key}`]: true }));
  };

  const isVisible = (rowNr: number, boxNr: number) => {
    const key = `${rowNr}!|!${boxNr}`;
    return show[key];
  };

    return <Container>
    <section className="mb-5">
      <Grid container>
        <Grid item xs={12} md={4} className="pe-0 me-0 d-flex flex-column">
          <h1 className="text-primary" style={{ fontSize: '2.5em' }}>
            {t(dict,'manifestLbl')} <br />
            Eureka <BsCircleFill style={{ fontSize: '.2em' }} />{' '}
          </h1>
          <h2 style={{fontSize:'1rem'}}><em className="d-block text-gray">{t(dict,'eurekaPrinciple')}</em></h2>
        </Grid>
        <Grid item xs={12} md={8} className="ms-0 border-start border-info border-2">
          <p>
            <span className="text-secondary fw-bold">{t(dict,'welcomeEureka')}</span> {t(dict,'manifestDesc')}
          </p>
        </Grid>
      </Grid>
    </section>
    
    <Grid item container>
      <Grid xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(1, 1) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
            onClick={() => toggleBox(1, 1)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow1Box1}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow1Box1Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(1, 1) && (
          <aside
            className="cursor-pointer bg-very-light-secondary text-darkgray"
            onClick={() => toggleBox(1, 1)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow1Box1Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow1Box1Desc')}</p>
          </aside>
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(1, 2) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
            onClick={() => toggleBox(1, 2)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow1Box2}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow1Box2Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(1, 2) && (
          <aside
            className="cursor-pointer bg-very-light-yellow text-darkgray"
            onClick={() => toggleBox(1, 2)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow1Box2Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow1Box2Desc')}</p>
          </aside>
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(1, 3) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
            onClick={() => toggleBox(1, 3)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow1Box3}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow1Box3Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(1, 3) && (
          <aside
            className="cursor-pointer bg-very-light-secondary text-darkgray"
            onClick={() => toggleBox(1, 3)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow1Box3Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow1Box3Desc')}</p>
          </aside>
        )}
      </Grid>
    </Grid>
    <Grid container>
      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(2, 1) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
            onClick={() => toggleBox(2, 1)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow2Box1}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow2Box1Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(2, 1) && (
          <aside
            className="cursor-pointer bg-very-light-yellow text-darkgray"
            onClick={() => toggleBox(2, 1)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow2Box1Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow2Box1Desc')}</p>
          </aside>
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(2, 2) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
            onClick={() => toggleBox(2, 2)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow2Box2}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow2Box2Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(2, 2) && (
          <aside
            className="cursor-pointer bg-very-light-secondary text-darkgray"
            onClick={() => toggleBox(2, 2)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow2Box2Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow2Box2Desc')}</p>
          </aside>
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(2, 3) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
            onClick={() => toggleBox(2, 3)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow2Box3}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow2Box3Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(2, 3) && (
          <aside
            className="cursor-pointer bg-very-light-yellow text-darkgray"
            onClick={() => toggleBox(2, 3)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow2Box3Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow2Box3Desc')}</p>
          </aside>
        )}
      </Grid>
    </Grid>
    <Grid container>
      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(3, 1) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
            onClick={() => toggleBox(3, 1)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow3Box1}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow3Box1Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(3, 1) && (
          <aside
            className="cursor-pointer bg-very-light-secondary text-darkgray"
            onClick={() => toggleBox(3, 1)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow3Box1Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow3Box1Desc')}</p>
          </aside>
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(3, 2) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
            onClick={() => toggleBox(3, 2)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow3Box2}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow3Box2Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(3, 2) && (
          <aside
            className="cursor-pointer bg-very-light-yellow text-darkgray"
            onClick={() => toggleBox(3, 2)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow3Box2Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow3Box2Desc')}</p>
          </aside>
        )}
      </Grid>

      <Grid item xs={12} md={6} lg={4} className=" p-3 ms-0">
        {!isVisible(3, 3) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
            onClick={() => toggleBox(3, 3)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow3Box3}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow3Box3Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(3, 3) && (
          <aside
            className="cursor-pointer bg-very-light-secondary text-darkgray"
            onClick={() => toggleBox(3, 3)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow3Box3Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow3Box3Desc')}</p>
          </aside>
        )}
      </Grid>
    </Grid>
    <Grid container>
      <Grid item xs={12} md={6} className=" p-3 ms-0">
        {!isVisible(4, 1) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-secondary text-white"
            onClick={() => toggleBox(4, 1)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow4Box1}`} />
            <h2 className="h3 text-start">{t(dict,'manifestRow4Box1Title')}</h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(4, 1) && (
          <aside
            className="cursor-pointer bg-very-light-secondary text-darkgray"
            onClick={() => toggleBox(4, 1)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow4Box1Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow4Box1Desc')}</p>
            <ul>
              <li className="fs-6">{t(dict,'manifestRow4Box1Desc1')}</li>
              <li className="fs-6">{t(dict,'manifestRow4Box1Desc2')}</li>
              <li className="fs-6">{t(dict,'manifestRow4Box1Desc3')}</li>
              <li className="fs-6">{t(dict,'manifestRow4Box1Desc4')}</li>
              <li className="fs-6">{t(dict,'manifestRow4Box1Desc5')}</li>
            </ul>
          </aside>
        )}
      </Grid>

      <Grid item xs={12} md={6} className=" p-3 ms-0">
        {!isVisible(4, 2) && (
          <section
            style={{ height: '250px' }}
            className="ps-5 p-3 rounded overflow-auto bg-yellow text-secondary"
            onClick={() => toggleBox(4, 2)}
            role="presentation"
          >
            <aside className={`${styles.box} ${styles.bgRow4Box2}`} />
            <h2 className="h3 text-start">
              {t(dict,'manifestRow4Box2Title')} 
            </h2>
            <h5 className="cursor-pointer fs-6">
              {t(dict,'learnMore')} <CgArrowLongRight />
            </h5>
          </section>
        )}

        {isVisible(4, 2) && (
          <aside
            className="cursor-pointer bg-very-light-yellow text-darkgray"
            onClick={() => toggleBox(4, 2)}
            role="presentation"
          >
            <h2 className="fs-6 fw-bolder text-secondary p-2">{t(dict,'manifestRow4Box2Title')}</h2>
            <p className="p-2 m-0 text-wrap text-start fs-6">{t(dict,'manifestRow4Box2Desc')}</p>
          </aside>
        )}
      </Grid>
    </Grid>
    <br />
    <hr />
    <br />

    <section className="mb-5">
      <Grid container>
        <Grid item xs={12} md={4} className="pe-2 me-0 d-flex align-items-center justify-content-center">
          <RiAlertLine
            className="text-yellow"
            style={{ opacity: '.7', fontSize: '15em', margin: '-.3em -.5em 0 -.3em' }}
          />
          <h2 className="h1 fw-bolder text-secondary mb-5 me-4" style={{ zIndex: 9999 }}>
            {t(dict,'enforcement')}
          </h2>
        </Grid>
        <Grid item xs={12} md={8} className="ms-0 border-start border-info border-2">
          <h2 className="h6 fw-bolder">{t(dict,'enforcementHeadLbl')}</h2>
          <ol>
            <li>{t(dict,'manifestEnforcement1')}</li>
            <li>{t(dict,'manifestEnforcement2')}</li>
            <li>{t(dict,'manifestEnforcement3')}</li>
            <li>{t(dict,'manifestEnforcement4')}</li>
            <li>{t(dict,'manifestEnforcement5')}</li>
            <li>{t(dict,'manifestEnforcement6')}</li>
            <li>{t(dict,'manifestEnforcement7')}</li>
          </ol>
          <p>
            {t(dict,'enforcementFooterLbl')}
            <a href="mailto:hola@eureka.club">hola@eureka.club</a>
          </p>
        </Grid>
      </Grid>
    </section>
   <section className="mb-5">
     <Grid container>
    <span>{t(dict,'AgreeText')}
      <Link href="/policy" passHref>
          <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t(dict,'policyText')}</span>
       </Link>
    </span>
    </Grid>
   </section> 
  </Container>
};
export default Manifest;