import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { setCookie } from 'nookies';
import { FunctionComponent, useEffect, useState } from 'react';
import LocalImageComponent from '@/src/components/LocalImage'
import {
  Container,
  Button,
  Nav,
  Navbar,
  Dropdown,
  Spinner,
} from 'react-bootstrap';

import { BiUser } from 'react-icons/bi';
import NotificationsList from '@/components/NotificationsList';
import { RiDashboardLine } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import SearchInput from '@/components/SearchInput';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '@/src/constants';
import ChevronToggle from '@/components/ui/dropdown/ChevronToggle';
import styles from './Navbar.module.css';
import useUser from '@/src/useUser';
import slugify from 'slugify'

const NavBar: FunctionComponent = () => {
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  const router = useRouter();
  const { t } = useTranslation('navbar');
  const [userId,setUserId] = useState(-1)
  useEffect(()=>{
    if(session)setUserId(session.user.id)
  },[session])

   const { data:user } = useUser(userId,{
    enabled: userId!=-1,
    staleTime:1
  });

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
    }
  };

  const handlerLogout = () => {
    signOut({callbackUrl:`${process.env.NEXT_PUBLIC_WEBAPP_URL}/`});
  };

  const avatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };

  const getAvatar = () => {
      if(user && user?.photos){
      if(!user?.photos.length)
        return <img onError={avatarError}
        className={styles.navbarIconNav}    
        src={user.image || '/img/default-avatar.png'}
        alt={user.name||''}
      />;
      return <LocalImageComponent className={`rounded rounded-circle`} width={30} height={29.5} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />
    }
    return <BiUser className={styles.navbarIconNav} />;
  };

  const handlerLogin = ()=>{
    localStorage.setItem('loginRedirect',router.asPath);
    router.push({pathname: `/`}, undefined, { scroll: false });
    window.scrollTo(0, 60);
  }

  const getMediathequeSlug = ()=>{
    if(session){
      const u = session.user
      const s =`${u.name}`
      const slug = `${slugify(s,{lower:true})}-${u.id}` 
      return slug
    }
    return ''
  }

  return (
    <Container className={styles.container}>
      <Navbar collapseOnSelect expand="lg" bg="white" fixed="top" className='border-bottom border-primary'>
        <Container>
        <Link href="/" replace>
          <a className="d-flex align-items-center">
          <Navbar.Brand className="cursor-pointer">
            <aside className="d-flex justify-content-around align-items-center">
              {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
               <img  className='eurekaLogo' src="/logo.svg" alt="Project logo" /> 
              <section>
                <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                <p className="text-secondary my-0 ms-3 font-weight-light fs-xs">{t('tagline')}</p>
              </section>
            </aside>
            {/* <Container>
              <Col xs={4} className={styles.brandContainer}>
                <img src="/img/logo.png" className="d-inline-block align-middle me-2" width={52} alt="Project logo" />
              </Col>
              <Col xs={7} className="pe-0">
                
                <div className={styles.siteName}>{siteName}</div>

                
                <div className={styles.brandInfo}>{t('tagline')}</div>
              </Col>
            </Container> */}
          </Navbar.Brand>
          </a>
        </Link>
       {(isLoadingSession) ? <Spinner animation="grow" variant="info" /> :
        <>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className={`${styles['responsive-navbar-nav']}`}>
          <Nav className="">
             {!isLoadingSession &&(
            <SearchInput className="" style={{width:'460px'}}/>

             )}
          </Nav>
          <Nav className={styles.navbarNav}>
            {!session && !isLoadingSession &&(
              <Button className="ms-4 btn-eureka"  data-cy="btn-login" onClick={handlerLogin} /*onClick={openSignInModal}*/>
                {t('login')}
              </Button>
            )}
          </Nav>
          <Nav className="me-3">
            {session && session.user && (
              <Dropdown className={`rounded-1 ${styles.actionBtn}`}>
                <Dropdown.Toggle as={ChevronToggle} id="create">
                  <span className="text-white">{t('create')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {session?.user.roles && session?.user.roles=='admin' && (
                    <Link href="/cycle/create">
                      <a className="dropdown-item">{t('cycle')}</a>
                    </Link>
                  )}
                  <Link href="/post/create">
                      <a className="dropdown-item">{t('post')}</a>
                    </Link>
                  {/*<Dropdown.Item onClick={handleCreatePostClick}>{t('post')}</Dropdown.Item>*/}
                  {session?.user.roles && session?.user.roles=='admin' && (
                    <Link href="/work/create">
                      <a className="dropdown-item">{t('work')}</a>
                    </Link>                    
                  )}
                  {/*<Dropdown.Item onClick={handleCreateWorkClick}>{t('v')}</Dropdown.Item>*/}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
          {session && session.user && (
            <Nav className={`${styles.navbarNav} text-center d-flex me-1`}>
              <Nav.Item>
                <Link href={`/mediatheque/${getMediathequeSlug()}`}>
                  <a data-cy="my-mediatheque-link" className={styles.navLink}>
                    <RiDashboardLine className={styles.navbarIconNav} />
                    <span className={styles.menuBottomInfo}>{t('My Mediatheque')}</span>
                  </a>
                </Link>
              </Nav.Item>
            </Nav>
          )}
          {!isLoadingSession  && (<>
          <Nav className={styles.navbarNav}>
            <Dropdown data-cy="link-about" align="end" className={styles.langSwitch}>
              <Dropdown.Toggle as={ChevronToggle}>
                <AiOutlineInfoCircle className={styles.navbarIconNav} />
              </Dropdown.Toggle>
              <span className={styles.menuBottomInfo}>{t('About')}</span>
              <Dropdown.Menu data-cy="links-about">
                <Dropdown.Item
                  active={router.asPath.search(/manifest$/g) !== -1}
                  onClick={() => router.push('/manifest')}
                >
                  {/* <Link href="/aboutUs"> */}
                  {t('Manifest')}
                  {/* </Link> */}
                </Dropdown.Item>
                <Dropdown.Item active={router.asPath.search(/about$/g) !== -1} onClick={() => router.push('/about')}>
                  {/* <Link href="/about"> */}
                  {t('About Eureka')}
                  {/* </Link> */}
                </Dropdown.Item>
                <Dropdown.Item
                  active={router.asPath.search(/aboutUs$/g) !== -1}
                  onClick={() => router.push('/aboutUs')}
                >
                  {/* <Link href="/aboutUs"> */}
                  {t('About Us')}
                  {/* </Link> */}
                </Dropdown.Item>
                 <Dropdown.Item
                  active={router.asPath.search(/policy$/g) !== -1}
                  onClick={() => router.push('/policy')}
                >
                  {t('policyText')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          <Nav className='me-1'>
            {router.locales?.length && (
              <Dropdown data-cy="link-language" align="end" className={styles.langSwitch} onSelect={handleLanguageSelect}>
                <Dropdown.Toggle as={ChevronToggle} id="langSwitch">
                  <img
                    className={styles.navbarIconNav}
                    src={`/img/lang-flags/${router.locale}.png`}
                    alt={`Language flag '${router.locale}'`}
                  />
                </Dropdown.Toggle>
                <span className={`${styles.menuBottomInfo}`}>{t('Language')}</span>
                <Dropdown.Menu data-cy="links-language">
                  {router.locales.map((locale) => (
                    <Dropdown.Item key={locale} eventKey={locale} active={locale === router.locale}>
                      <Link href={router.asPath} locale={locale}>
                        <img className={`m-1 ${styles.navbarIconNav}`} src={`/img/lang-flags/${locale}.png`} alt={`Language flag '${locale}'`} />
                      </Link>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
          </>)}
          {session && session.user && (
            <Nav className={`${styles.navbarNav} d-flex me-1`}>
              <Dropdown data-cy="session-actions" align="end" className={`${styles.langSwitch} ${styles.avatar}`}>
                <Dropdown.Toggle as={ChevronToggle} >{getAvatar()}</Dropdown.Toggle>
                <span className={styles.menuBottomInfo}>{t('Account')}</span>
                <Dropdown.Menu>
                  <Dropdown.Item
                   active={router.asPath.search(/profile$/g) !== -1}
                  onClick={() => router.push('/profile')} >
                    {t('Profile')}
                  </Dropdown.Item>
                  {session?.user.roles && session?.user.roles=='admin' && (
                   <Dropdown.Item
                        active={router.asPath.search(/back-office$/g) !== -1}
                        onClick={() => router.push('/back-office')} >
                          {t('Admin Panel')}
                  </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handlerLogout}>
                    {/* <Button > */}
                    {t('logout')}
                    {/* </Button> */}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          )}
          <Nav.Item data-cy="notifications-btn">
            <NotificationsList />  
          </Nav.Item>
        </Navbar.Collapse>
        </>}
        </Container>
      </Navbar>
    </Container>
  );
};

export default NavBar;
