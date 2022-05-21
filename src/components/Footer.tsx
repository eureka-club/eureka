import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent} from 'react';
import {
  TiSocialTwitter,
  TiSocialFacebookCircular,
  TiSocialInstagram,
  TiSocialLinkedinCircular,
} from 'react-icons/ti';
import { RiMailLine } from 'react-icons/ri';
import { SiTiktok } from 'react-icons/si';
import styles from './Footer.module.css';


const Footer: FunctionComponent = () => {
  const { t } = useTranslation('navbar');

  return (
    <div className="mt-5"  style={{ background: 'var(--eureka-green)' }}>
  <footer className="text-center text-white">
    <div className="container d-flex flex-column-reverse flex-lg-row justify-content-lg-around">
      <section className="mt-1 mt-lg-2 mb-1">
        <div className="text-center d-flex flex-column flex-lg-row justify-content-center pt-3">
          <div className="me-lg-5">
              <Link href="/manifest" ><p className="text-white cursor-pointer">{t('Manifest')}</p></Link>
          </div>
          <div className="me-lg-5">
              <Link href="/about" ><p className="text-white cursor-pointer">{t('About Eureka')}</p></Link>
          </div>
          <div className="me-lg-5">
              <Link href="/aboutUs" ><p className="text-white cursor-pointer">{t('About Us')}</p></Link>
          </div>
          <div className="">
              <Link href="/policy" ><p className="text-white cursor-pointer">{t('policyText')}</p></Link>
          </div>
        </div>
      </section>

      <section className={`mt-2 mb-1 ${styles.fallowsSection}`}>
            <a href="https://instagram.com/eleurekaclub">
              <TiSocialInstagram className={styles.ti} />
            </a>
            <a href="https://twitter.com/eleurekaclub">
              <TiSocialTwitter className={styles.ti} />
            </a>
            <a href="https://facebook.com/eleurekaclub">
              <TiSocialFacebookCircular className={styles.ti} />
            </a>
            <a href="https://linkedin.com/company/eleurekaclub">
              <TiSocialLinkedinCircular className={styles.ti} />
            </a>
             <a href="tiktok">
              <SiTiktok className={styles.tiktok} />
            </a>
            <a href="mailto:hola@eureka.club">
              <RiMailLine className={styles.ti} />
            </a>
          </section>
    </div>

    <div
         className="text-center p-2" style={{ background: 'var(--eureka-purple)' }}> © 2021  
      <a className="text-white" href="https://www.eureka.club/">  www.eureka.club</a>
    </div>
  </footer>
    </div>
  );
};

export default Footer;
