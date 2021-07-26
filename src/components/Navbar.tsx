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
import NavItem from 'react-bootstrap/NavItem';

import {
  // BootstrapNavbar,
  Navbar,
  // Brand,
  // Toggle,
  // Collapse
  Col,
} from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { BiUser } from 'react-icons/bi';
import { BsBookmark } from 'react-icons/bs';
import { RiDashboardLine } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import SearchEngine from './SearchEngine';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import { Session } from '../types';
import ChevronToggle from './ui/dropdown/ChevronToggle';
import globalModalsAtom from '../atoms/globalModals';
import styles from './Navbar.module.css';

const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const NavBar: FunctionComponent = () => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [session] = useSession() as [Session | null | undefined, boolean];
  const router = useRouter();
  const { t } = useTranslation('navbar');

  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const handleCreatePostClick = (ev: MouseEvent<DropdownItemProps>) => {
    ev.preventDefault();

    setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
  };

  const handleCreateWorkClick = (ev: MouseEvent<DropdownItemProps>) => {
    ev.preventDefault();

    setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: true } });
  };

  const handlerEditUserClick = (ev: MouseEvent<DropdownItemProps>) => {
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

  const handleAboutSelect = (eventKey: string | null) => {
    if (eventKey === 'aboutEureka') router.push('/about');
    else if (eventKey === 'aboutUs') router.push('/aboutUs');
  };

  const getAvatar = () => {
    if (session && session.user.image)
      return <img src={session.user.image} className={styles.navbarIconNav} alt="user" />;
    return <BiUser className={styles.navbarIconNav} />;
  };

  return (
    <Container className={styles.container}>
      <Navbar collapseOnSelect expand="lg" variant="light">
        {/* <Container> */}
        <Link href="/">
          <Navbar.Brand>
            <Container>
              <Col className={styles.brandContainer}>
                <img src="/img/logo.png" className="d-inline-block align-middle mr-2" width={52} alt="Project logo" />
              </Col>
              <Col>
                {/* <h1 className={styles.brandText}> */}
                <div className={styles.siteName}>{siteName}</div>

                {/* </h1> */}
                <div className={styles.brandInfo}>{t('Social media to foster awareness')}</div>
              </Col>
            </Container>
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className={styles.navbarNav}>
            <SearchEngine />
          </Nav>
          <Nav className={styles.navbarNav}>{!session && <Button onClick={openSignInModal}>{t('login')}</Button>}</Nav>
          <Nav className={styles.navbarNav}>
            {session && session.user && (
              <Dropdown className="mr-4">
                <Dropdown.Toggle as={ChevronToggle} id="create">
                  {t('create')}
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.dropdownMenu}>
                  {session?.user.roles.includes('admin') && (
                    <Link href="/cycle/create">
                      <a className={classNames(styles.dropdownMenuItem, 'dropdown-item')}>{t('cycle')}</a>
                    </Link>
                  )}
                  <Dropdown.Item className={styles.dropdownMenuItem} onClick={handleCreatePostClick}>
                    {t('post')}
                  </Dropdown.Item>
                  {session?.user.roles.includes('admin') && (
                    <Dropdown.Item className={styles.dropdownMenuItem} onClick={handleCreateWorkClick}>
                      {t('work')}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
          {session && session.user && (
            <Nav className={styles.navbarNav}>
              <Nav.Item>
                <Link href="/mediatheque">
                  <a className={styles.navLink}>
                    <RiDashboardLine className={styles.navbarIconNav} />
                    <span className={styles.menuBottomInfo}>{t('My Mediatheque')}</span>
                  </a>
                </Link>
              </Nav.Item>
            </Nav>
          )}
          <Nav className={styles.navbarNav}>
            <Dropdown alignRight className={styles.langSwitch}>
              <Dropdown.Toggle as={ChevronToggle}>
                <AiOutlineInfoCircle className={styles.navbarIconNav} />
              </Dropdown.Toggle>
              <span className={styles.menuBottomInfo}>{t('About Eureka')}</span>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => router.push('/about')}>
                  {/* <Link href="/about"> */}
                  {t('About Eureka')}
                  {/* </Link> */}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => router.push('/aboutUs')}>
                  {/* <Link href="/aboutUs"> */}
                  {t('About Us')}
                  {/* </Link> */}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          <Nav className={styles.navbarNav}>
            {router.locales?.length && (
              <Dropdown alignRight className={styles.langSwitch} onSelect={handleLanguageSelect}>
                <Dropdown.Toggle as={ChevronToggle} id="langSwitch">
                  <img
                    className={styles.navbarIconNav}
                    src={`/img/lang-flags/${router.locale}.png`}
                    alt={`Language flag '${router.locale}'`}
                  />
                </Dropdown.Toggle>
                <span className={styles.menuBottomInfo}>&nbsp;</span>
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
            <Nav className={styles.navbarNav}>
              <Dropdown alignRight className={styles.langSwitch}>
                <Dropdown.Toggle as={ChevronToggle}>{getAvatar()}</Dropdown.Toggle>
                <span className={styles.menuBottomInfo}>&nbsp;</span>
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
        {/* </Container> */}
      </Navbar>
    </Container>
  );
};

export default NavBar;
