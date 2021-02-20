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
import BootstrapNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { BiUser } from 'react-icons/bi';
import { BsBookmark } from 'react-icons/bs';

import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import { Session } from '../types';
import ChevronToggle from './ui/dropdown/ChevronToggle';
import globalModalsAtom from '../atoms/globalModals';
import styles from './Navbar.module.css';

const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const Navbar: FunctionComponent = () => {
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

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
    }
  };

  return (
    <Container className={styles.container}>
      <BootstrapNavbar variant="light" className="p-0">
        <BootstrapNavbar.Brand href="/" className={classNames(styles.brand, 'mr-4')}>
          <img src="/img/logo.png" className="d-inline-block align-middle mr-4" width={52} alt="Project logo" />
          <h1 className={styles.brandText}>{siteName}</h1>
        </BootstrapNavbar.Brand>

        {session == null ? (
          <Nav className={styles.nav}>
            <Button onClick={openSignInModal}>{t('login')}</Button>
          </Nav>
        ) : (
          <Nav className="ml-auto">
            <Dropdown className="mr-4">
              <Dropdown.Toggle as={ChevronToggle} id="create">
                {t('create')}
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdownMenu}>
                <Link href="/cycle/create">
                  <a className={classNames(styles.dropdownMenuItem, 'dropdown-item')}>{t('cycle')}</a>
                </Link>
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
            <NavItem>
              <Link href="/my-list">
                <a className="nav-link mr-3">
                  <BsBookmark /> My List
                </a>
              </Link>
            </NavItem>
            <NavDropdown alignRight title={<BiUser className={styles.profileDropdown} />} id="profileDropdown">
              <NavDropdown.ItemText>{session.user.email}</NavDropdown.ItemText>
              <NavDropdown.Item onClick={() => signOut()}>{t('logout')}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}

        {router.locales?.length && (
          <Nav className={classNames('ml-4', styles.langSwitch)}>
            <Dropdown alignRight onSelect={handleLanguageSelect}>
              <Dropdown.Toggle as={ChevronToggle} id="langSwitch">
                <img src={`/img/lang-flags/${router.locale}.png`} alt={`Language flag '${router.locale}'`} />
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
          </Nav>
        )}
      </BootstrapNavbar>
    </Container>
  );
};

export default Navbar;
