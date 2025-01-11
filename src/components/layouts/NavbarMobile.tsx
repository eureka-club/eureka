import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { setCookie } from 'nookies';
import { FunctionComponent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
// import NotificationsList from '@/components/NotificationsList';

import { Navbar } from 'react-bootstrap';
import { BiUser } from 'react-icons/bi';
import { RiDashboardLine } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import SearchInput from '@/src/components/SearchInputOLD';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '@/src/constants';
import ChevronToggle from '@/components/ui/dropdown/ChevronToggle';
import styles from './NavbarMobile.module.css';
import LocalImageComponent from '@/src/components/LocalImage';
import { AiOutlineSearch } from 'react-icons/ai';
import { useAtom } from 'jotai';
import searchEngine from '@/src/atoms/searchEngine';
import { HiOutlineHashtag } from 'react-icons/hi';
import slugify from 'slugify';
import useUserSumary from '@/src/useUserSumary';

const topics = [
  'gender-feminisms',
  'technology',
  'environment',
  'racism-discrimination',
  'wellness-sports',
  'social issues',
  'politics-economics',
  'philosophy',
  'migrants-refugees',
  'introspection',
  'sciences',
  'arts-culture',
  'history',
];

const NavBar: FunctionComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation('navbar');
  const [userId, setUserId] = useState(-1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [, setSearchEngineState] = useAtom(searchEngine);

  useEffect(() => {
    if (session) setUserId(session.user.id);
  }, [session]);

  const { data: user } = useUserSumary(userId, {
    enabled: userId != -1,
    staleTime: 1,
  });

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
    }
  };

  const handlerLogin = () => {
    sessionStorage.setItem('loginRedirect', router.asPath);
    router.push("/login")

    /*     localStorage.setItem('loginRedirect', router.asPath);
     router.push({ pathname: `/` }, undefined, { scroll: false });
     window.scrollTo(0, 200);*/
  };

  const handlerLogout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}/` });
  };

  const getAvatar = () => {
    if (user && user.photos) {
      if (!user?.photos.length)
        return (
          <img className={styles.navbarIconNav} src={user.image || '/img/default-avatar.png'} alt={user.name || ''} />
        );
      return (
        <LocalImageComponent
          className={`rounded rounded-circle`}
          width={30}
          height={30}
          filePath={`users-photos/${user.photos[0].storedFile}`}
          alt={user.name || ''}
        />
      );
    }
    return <BiUser className={styles.navbarIconNav} />;
  };

  const renderSearch = () => {
    return (
      <div className="mb-3">
        {' '}
        <SearchInput className="" />{' '}
      </div>
    );
  };

  const handlerTopicsLinkClick = (v: string) => {
    setSearchEngineState((res) => ({ ...res, itemsFound: [] }));
    router.push(`/search?q=${v}`);
  };

  const getMediathequeSlug = () => {
    if (session) {
      const u = session.user;
      const s = `${u.name}`;
      const slug = `${slugify(s, { lower: true })}-${u.id}`;
      return slug;
    }
    return '';
  };

  const getTopicsLinks = () => {
    return (
      <>
        {topics.map((topic) => {
          return (
            <Dropdown.Item key={topic} onClick={() => handlerTopicsLinkClick(topic)}>
              {/* <Link href="/aboutUs"> */}
              {t(`topics:${topic}`)}
              {/* </Link> */}
            </Dropdown.Item>
          );
        })}
      </>
    );
  };

  return (
    <Container fluid className={styles.container}>
      <Navbar collapseOnSelect expand="lg" variant="light" className="position-relative" style={{ zIndex: 9999 }}>
        {/* <Container> */}
        <Link href="/">
          <Navbar.Brand className="cursor-pointer">
            <aside className="d-flex justify-content-between align-items-center">
              <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
              <section className="me-1">
                <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                <p className=" my-0 text-secondary ms-3 font-weight-light fs-xs">{t('tagline')}</p>
              </section>
            </aside>
          </Navbar.Brand>
        </Link>
        <div className="d-flex">
          <div className="me-2">
            <Button
              size="sm"
              variant=""
              className={`border-0 p-0 text-primary`}
              onClick={() => setShowSearch((s) => !s)}
            >
              <AiOutlineSearch className={`mt-2 ${styles.searchIcon}`} />
            </Button>
          </div>
          <div className="me-1">
            {/* <NotificationsList /> */}
          </div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            className={`position-absolute top-100 end-0 bg-white border border-info px-2 p-1 ${styles['responsive-navbar-nav']}`}
          >
            <Nav className={`mx-2 ${styles.navbarNav}`}>
              <Dropdown align="end" className={styles.langSwitch}>
                <Dropdown.Toggle as={ChevronToggle}>
                  <HiOutlineHashtag
                    className={`${styles.navbarIconNav} border border-2 border-primary`}
                    style={{ scale: '90%', padding: '2px' }}
                  />
                  {` `}
                  <span className={styles.menuBottomInfo}>{t('Topics')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>{getTopicsLinks()}</Dropdown.Menu>
              </Dropdown>
            </Nav>

            {session && session.user && (
              <Nav className="mx-2">
                <Dropdown className={styles.langSwitch}>
                  <Dropdown.Toggle as={ChevronToggle}>
                    <RiDashboardLine className={styles.navbarIconNav} />
                    <span className={styles.menuBottomInfo}>{t('My Mediatheque')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu >
                    <Dropdown.Item>
                      <Link href={`/mediatheque/${getMediathequeSlug()}`}>
                        <a data-cy="my-mediatheque-link" className={styles.navLink}>
                          {t('My Mediatheque')}
                        </a>
                      </Link>

                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link href={`/user/${getMediathequeSlug()}/my-read-or-watched/books`}>
                        <a className={styles.navLink}>
                          {t("MyReadOrWatched")}
                        </a>
                      </Link>

                    </Dropdown.Item>

                  </Dropdown.Menu>

                </Dropdown>
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
                    {t('Manifest')}
                  </Dropdown.Item>
                  <Dropdown.Item active={router.asPath.search(/about$/g) !== -1} onClick={() => router.push('/about')}>
                    {t('About Eureka')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={router.asPath.search(/aboutUs$/g) !== -1}
                    onClick={() => router.push('/aboutUs')}
                  >
                    {t('About Us')}
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
                          <img
                            className={`m-1 ${styles.navbarIconNav}`}
                            src={`/img/lang-flags/${locale}.png`}
                            alt={`Language flag '${locale}'`}
                          />
                        </Link>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
            {session && session.user && (
              <Nav className="mx-1">
                <Dropdown align="end" className={styles.langSwitch}>
                  <Dropdown.Toggle as={ChevronToggle}>
                    {getAvatar()}
                    {` `}
                    <span className={styles.menuBottomInfo}>{t('Account')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      active={router.asPath.search(/profile$/g) !== -1}
                      onClick={() => router.push('/profile')}
                    >
                      {t('Profile')}
                    </Dropdown.Item>
                    {session?.user.roles && session?.user.roles == 'admin' && (
                      <Dropdown.Item
                        active={router.asPath.search(/back-office$/g) !== -1}
                        onClick={() => router.push('/back-office')}
                      >
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
            {!session && (
              <Nav className="mx-2 mt-2 mb-2">
                <Button className="text-white w-100" onClick={handlerLogin}>
                  {t('login')}
                </Button>
              </Nav>
            )}
            <Nav className="mx-2 mt-2 mb-2">
              {session && session.user && (
                <Dropdown className={`rounded-1 ${styles.actionBtn}`}>
                  <Dropdown.Toggle as={ChevronToggle} id="create">
                    <span className="text-white">{t('create')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.dropdownMenu}>
                    {session?.user.roles && session?.user.roles == 'admin' && (
                      <Link href="/cycle/create">
                        <a className="dropdown-item">{t('cycle')}</a>
                      </Link>
                    )}
                    <Link href="/post/create">
                      <a className="dropdown-item">{t('post')}</a>
                    </Link>
                    {/* {session?.user.roles && session?.user.roles == 'admin' && ( */}
                      <Link href="/work/create">
                        <a className="dropdown-item">{t('work')}</a>
                      </Link>
                  {/* )} */}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      {showSearch && <div className="d-flex justify-content-end align-items-end">{renderSearch()}</div>}
    </Container>
  );
};

export default NavBar;
