import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useSession, signOut } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { setCookie } from 'nookies';
import { FunctionComponent, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import NotificationsList from './NotificationsList';

// import NavItem from 'react-bootstrap/NavItem';

import {
  // BootstrapNavbar,
  Navbar,
  // Brand,
  // Toggle,
  // Collapse
  Col,
} from 'react-bootstrap';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { BiUser } from 'react-icons/bi';
// import { BsBookmark } from 'react-icons/bs';
import { RiDashboardLine } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
// import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import SearchEngine from './SearchEngine';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import { Session } from '../types';
import ChevronToggle from './ui/dropdown/ChevronToggle';
import globalModalsAtom from '../atoms/globalModals';
import styles from './NavbarMobile.module.css';
import useUser from '@/src/useUser';
import LocalImageComponent from '@/components/LocalImage'

// const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const NavBar: FunctionComponent = () => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [session] = useSession() as [Session | null | undefined, boolean];
  const router = useRouter();
  const { t } = useTranslation('navbar');

  const { data:user } = useUser(+(session as Session)?.user.id,{
    enabled: !!+(session as Session)?.user.id,
    staleTime:1
  });

  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const handleCreatePostClick = (ev: MouseEvent<HTMLElement>) => {
    ev.preventDefault();

    setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
  };

  const handleCreateWorkClick = (ev: MouseEvent<HTMLElement>) => {
    ev.preventDefault();

    setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: true } });
  };

  const handlerEditUserClick = (ev: MouseEvent<HTMLElement>) => {
    ev.preventDefault();
    setGlobalModalsState({ ...globalModalsState, ...{ editUserModalOpened: true } });
  };

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
    }
  };

  const handlerLogout = () => {
    signOut();
  };

  // const handleAboutSelect = (eventKey: string | null) => {
  //   if (eventKey === 'aboutEureka') router.push('/about');
  //   else if (eventKey === 'aboutUs') router.push('/aboutUs');
  // };

  const getAvatar = () => {
      if(user){
      if(!user?.photos.length)
        return <img
        className={styles.navbarIconNav}    
        src={user.image || '/img/default-avatar.png'}
        alt={user.name||''}
      />;
      return <LocalImageComponent className={styles.navbarIconNav} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />
    }
    return <BiUser className={styles.navbarIconNav} />;
  };

  return (
    <Container fluid className={styles.container}>
      <Navbar collapseOnSelect expand="lg" variant="light" className="position-relative" style={{zIndex:9999}}>
        {/* <Container> */}
        <Link href="/">
          <Navbar.Brand className="cursor-pointer">
            <aside className="d-flex justify-content-between align-items-center">
              <img className='eurekaLogo' src="/logo.svg" alt="Project logo" />
              <section className="me-1">
                <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                <p className=" my-0 text-secondary ms-3 font-weight-light fs-xs">{t('tagline')}</p>
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
        </Link>
       <div className='d-flex'>
        <NotificationsList />  
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className={`position-absolute top-100 end-0 bg-white border border-info px-2 p-1 ${styles['responsive-navbar-nav']}`}
        >
          <Nav className="mx-2 mb-1">
            <SearchEngine />
          </Nav>
          <Nav className="mx-2">
            {!session && (
              <Button className="text-white" onClick={openSignInModal}>
                {t('login')}
              </Button>
            )}
          </Nav>
          <Nav className="mx-2">
            {session && session.user && (
              <Dropdown className={`rounded-1 me-4 ${styles.actionBtn}`}>
                <Dropdown.Toggle as={ChevronToggle} id="create">
                  <span className="text-white">{t('create')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.dropdownMenu}>
                  {session?.user.roles.includes('admin') && (
                    <Link href="/cycle/create">
                      <a className="dropdown-item">{t('cycle')}</a>
                    </Link>
                  )}
                  <Dropdown.Item className="" onClick={handleCreatePostClick}>
                    {t('post')}
                  </Dropdown.Item>
                  {session?.user.roles.includes('admin') && (
                    <Dropdown.Item className="" onClick={handleCreateWorkClick}>
                      {t('work')}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
          {session && session.user && (
            <Nav className="mx-2">
              <Nav.Item>
                <Link href={`/mediatheque/${session.user.id}`}>
                  <a className={styles.navLink}>
                    <RiDashboardLine className={styles.navbarIconNav} />
                    {` `}
                    <span className={styles.menuBottomInfo}>{t('My Mediatheque')}</span>
                  </a>
                </Link>
              </Nav.Item>
            </Nav>
          )}
          <Nav className={`mx-2 ${styles.navbarNav}`}>
            <Dropdown align="end" className={styles.langSwitch}>
              <Dropdown.Toggle as={ChevronToggle}>
                <AiOutlineInfoCircle className={styles.navbarIconNav} />
                {` `}
                <span className={styles.menuBottomInfo}>{t('About')}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
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
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          <Nav className="mx-2">
            {router.locales?.length && (
              <Dropdown align="end" className={styles.langSwitch} onSelect={handleLanguageSelect}>
                <Dropdown.Toggle as={ChevronToggle} id="langSwitch">
                  <img
                    className={styles.navbarIconNav}
                    src={`/img/lang-flags/${router.locale}.png`}
                    alt={`Language flag '${router.locale}'`}
                  />
                  {` `}
                  <span className={styles.menuBottomInfo}>{t('Language')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {router.locales.map((locale) => (
                    <Dropdown.Item key={locale} eventKey={locale} active={locale === router.locale}>
                      <Link href={router.asPath} locale={locale}>
                        <img src={`/img/lang-flags/${locale}.png`} alt={`Language flag '${locale}'`} />
                      </Link>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
          {session && session.user && (
            <Nav className="mx-2">
              <Dropdown align="end" className={styles.langSwitch}>
                <Dropdown.Toggle as={ChevronToggle}>
                  {getAvatar()}
                  {` `}
                  <span className={styles.menuBottomInfo}>{t('Account')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handlerEditUserClick}>
                    {/* <Button > */}
                    {t('Profile')}
                    {/* </Button> */}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handlerLogout}>
                    {/* <Button > */}
                    {t('logout')}
                    {/* </Button> */}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          )}
        </Navbar.Collapse>
        </div>
                {/* </Container> */}
      </Navbar>
    </Container>
  );
};

export default NavBar;
