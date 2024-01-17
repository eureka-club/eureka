import Link from 'next/link';
import { useRouter } from 'next/navigation';
//
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

import { useDictContext } from '@/src/hooks/useDictContext';

interface Props {
}
const Footer: FunctionComponent<Props> = ({}) => {

  //const { t } = useTranslation('navbar');
const {t,dict}=useDictContext()
  return (
  <footer className=" text-center m-0 mt-4" style={{ background: 'var(--eureka-grey-light'}}>
    <div className="container d-flex flex-column-reverse flex-lg-row justify-content-lg-between align-items-lg-center">
      <section className="mb-1 mb-lg-0">
        <div className="text-center d-flex flex-column flex-lg-row justify-content-around pt-3 text-secondary fs-6">
            <Link legacyBehavior  href="/manifest"><span className='text-secondary text-decoration-underline text-blue me-lg-5 mb-1 mb-lg-none' onClick={() => window.scrollTo(0, 0)}>{t(dict,'Manifest')} </span></Link>
            <Link legacyBehavior  href="/about"><span className='text-secondary text-decoration-underline me-lg-5 mb-1 mb-lg-none' onClick={() => window.scrollTo(0, 0)}>{t(dict,'About Eureka')}</span></Link>
            <Link legacyBehavior  href="/aboutUs"><span className='text-secondary text-decoration-underline me-lg-5 mb-1 mb-lg-none' onClick={() => window.scrollTo(0, 0)}>{t(dict,'About Us')}</span></Link>
            <Link legacyBehavior  href="/policy"><span className='text-secondary text-decoration-underline me-lg-5 mb-1 mb-lg-none' onClick={() => window.scrollTo(0, 0)}>{t(dict,'policyText')}</span></Link>
          <p>{t(dict,'contact')} <a className='text-decoration-underline text-secondary me-lg-3' href="mailto:hola@eureka.club">hola@eureka.club</a></p>
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
         className="text-center p-2 fs-6" style={{ background: 'white' }}>  
      <a className="text-secondary" href="https://www.eureka.club/">  www.eureka.club</a>
    <section>
      <Link legacyBehavior  href={'https://www-archive.mozilla.org/mpl/mpl-1.0'}>
            <span>MOZILLA PUBLIC LICENSE Version 1.0 (MPL-1.0)</span>
      </Link>
    </section>
    </div>
  </footer>
  );
};

export default Footer;
