import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent} from 'react';
import {
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiFillFacebook,
} from 'react-icons/ai';
import { SiTiktok } from 'react-icons/si';
import { RiMailLine } from 'react-icons/ri';
import styles from './Footer.module.css';


const Footer: FunctionComponent = () => {
  const { t } = useTranslation('navbar');

  return (
  <footer className=" text-center m-0 mt-4" style={{ background: 'var(--eureka-grey)'}}>
    <div className="container d-flex flex-column-reverse flex-lg-row justify-content-lg-around align-items-lg-center">
      <section className="mb-1 mb-lg-0">
        <div className="text-center d-flex flex-column flex-lg-row justify-content-around pt-3 text-secondary">
              <Link href="/manifest"><a className='text-secondary text-decoration-underline text-blue me-lg-5 mb-1 mb-lg-none'>{t('Manifest')}</a></Link>
              <Link href="/about"><a className='text-secondary text-decoration-underline me-lg-5 mb-1 mb-lg-none'>{t('About Eureka')}</a></Link>
              <Link href="/aboutUs"><a className='text-secondary text-decoration-underline me-lg-5 mb-1 mb-lg-none'>{t('About Us')}</a></Link>
              <Link href="/policy"><a className='text-secondary text-decoration-underline me-lg-5 mb-1 mb-lg-none'>{t('policyText')}</a></Link>
          <p className='text-decoration-underline'>{t('common:contact')}<a className='text-secondary me-lg-3' href="mailto:hola@eureka.club">hola@eureka.club</a></p>
        </div>

      </section>

      <section className={`mt-2 mt-lg-0 ${styles.fallowsSection}`}>
            <a className='me-1' href="https://instagram.com/eleurekaclub" target={'_blank'} rel="noreferrer">
              <AiOutlineInstagram className={styles.ti} /> 
            </a>
              <a className='me-1' href="https://www.tiktok.com/@eleurekaclub" target={'_blank'} rel="noreferrer">
              <SiTiktok className={styles.tiktok} />
            </a>
             <a className='me-1' href="https://linkedin.com/company/eleurekaclub" target={'_blank'} rel="noreferrer">
              <AiFillLinkedin className={styles.ti} />
            </a>
            <a className='me-1' href="https://twitter.com/eleurekaclub" target={'_blank'} rel="noreferrer">
              <AiOutlineTwitter className={styles.ti} />
            </a>
            <a href="https://facebook.com/eleurekaclub" target={'_blank'} rel="noreferrer">
              <AiFillFacebook className={styles.ti} />
            </a>
          
            {/*<a href="mailto:hola@eureka.club">
              <RiMailLine className={styles.ti} />
            </a>*/}
          </section>
    </div>

    <div
         className="text-center p-2" style={{ background: 'white' }}>  
      <a className="text-secondary" href="https://www.eureka.club/">  www.eureka.club</a>
    </div>
  </footer>
  );
};

export default Footer;
