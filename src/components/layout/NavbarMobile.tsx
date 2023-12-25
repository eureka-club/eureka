
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
// import { useAtom } from 'jotai';
// import searchEngine from '@/src/atoms/searchEngine';
import { setCookie } from 'nookies';
import { FC, FunctionComponent, useEffect, useState } from 'react';
import LocalImageComponent from '@/src/components/LocalImage';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '@/src/components/forms/SignInForm';
import { Container, Button, Nav, Navbar, Dropdown, Spinner } from 'react-bootstrap';
import { BiUser } from 'react-icons/bi';
import NotificationsList from '@/src/components/NotificationsList';
import { RiDashboardLine } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { HiOutlineHashtag } from 'react-icons/hi';
import SearchInput from '@/src/components/SearchInput';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '@/src/constants';
import ChevronToggle from '@/src/components/ui/dropdown/ChevronToggle';
import styles from './NavbarMobile.module.css';
import useUser from '@/src/hooks/useUser';
import slugify from 'slugify';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { i18n } from '@/i18n-config';
import { t } from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';
import { AiOutlineSearch } from 'react-icons/ai';

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
  const queryClient = useQueryClient();
  const { dict } = useDictContext()
  const router = useRouter();
  const asPath = usePathname();
  const searchParams = useSearchParams();
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // const { t,lang:locale } = useTranslation('navbar');

  // const [, setSearchEngineState] = useAtom(searchEngine);
  const { show } = useModalContext();

  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    if (session) setUserId(session.user.id);
  }, [session]);

  const { data: user } = useUser(userId, {
    enabled: userId != -1,
    staleTime: 1,
  });
  // const isLoadingSession = false;
  // const user = {id:1,
  //   photos:[{storedFile:''}],
  //   name:'geo',
  //   image:'https://lh3.googleusercontent.com/ogw/AGvuzYZshecvPzhOkjNz1w8NctylfLq4HhFIDZ0fshuxOA=s64-c-mo',
  //   roles:'admin'
  // };
  // const session = {user}

  const renderSearch = () => {
    return (
      <div className="mb-3">
        {' '}
        <SearchInput className="" />{' '}
      </div>
    );
  };

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      queryClient.clear();
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
      window.location.replace(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/${locale}${asPath}`);
    }
  };

  const handlerLogout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}/${'es'}` });
  };

  const avatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };

  const getAvatar = () => {
    if (user && user?.photos) {
      if (!user?.photos.length)
        return (
          <img
            onError={avatarError}
            className={styles.navbarIconNav}
            src={user.image || '/img/default-avatar.png'}
            alt={user.name || ''}
          />
        );
      return (
        <LocalImageComponent
          className={`rounded rounded-circle`}
          width={30}
          height={29.5}
          filePath={`users-photos/${user.photos.length ? user.photos[0]?.storedFile : ''}`}
          alt={user.name || ''}
        />
      );
    }
    return <BiUser className={styles.navbarIconNav} />;
  };

  const handlerLogin = () => {
    const sp = searchParams.toString();
    localStorage.setItem('loginRedirect', `${asPath}/?${sp}`)
    show(<SignInForm />);
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

  const handlerTopicsLinkClick = (v: string) => {
    // setSearchEngineState((res) => ({ ...res, itemsFound: [] }));
    router.push(`/search/work?q=${v}`);
  };

  const getTopicsLinks = () => {
    return (
      <>
        {topics.map((topic) => {
          return (
            <Dropdown.Item key={topic} onClick={() => handlerTopicsLinkClick(topic)}>
              {t(dict, `${topic}`)}
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
          <Navbar.Brand className="cursor-pointer d-flex">
            <aside className="d-flex justify-content-between align-items-center">
              <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
              <section className="me-1">
                <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                <p className=" my-0 text-secondary ms-3 font-weight-light fs-xs">{t(dict,'tagline')}</p>
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
              <AiOutlineSearch className={`mt-1 ${styles.searchIcon}`} />
            </Button>
          </div>
          <div className="me-1">
            <NotificationsList />
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
                  <span className={styles.menuBottomInfo}>{t(dict,'Topics')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>{getTopicsLinks()}</Dropdown.Menu>
              </Dropdown>
            </Nav>

            {session && session.user && (
              <Nav className="mx-2">
                <Dropdown className={styles.langSwitch}>
                  <Dropdown.Toggle as={ChevronToggle}>
                    <RiDashboardLine className={styles.navbarIconNav} />
                    <span className={styles.menuBottomInfo}>{t(dict,'My Mediatheque')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu >
                    <Dropdown.Item>
                      <Link href={`/mediatheque/${getMediathequeSlug()}`}>
                        <a data-cy="my-mediatheque-link" className={styles.navLink}>
                          {t(dict,'My Mediatheque')}
                        </a>
                      </Link>

                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link href={`/user/${getMediathequeSlug()}/my-read-or-watched`}>
                        <a className={styles.navLink}>
                          {t(dict,"MyReadOrWatched")}
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
                  <span className={styles.menuBottomInfo}>{t(dict,'About')}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    active={asPath?.search(/manifest$/g) !== -1}
                    onClick={() => router.push('/manifest')}
                  >
                    {t(dict,'Manifest')}
                  </Dropdown.Item>
                  <Dropdown.Item active={asPath?.search(/about$/g) !== -1}
                    onClick={() => router.push('/about')}
                  >
                    {t(dict, 'About Eureka')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={asPath?.search(/aboutUs$/g) !== -1}
                    onClick={() => router.push('/aboutUs')}
                  >
                    {t(dict, 'About Us')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={asPath?.search(/policy$/g) !== -1}
                    onClick={() => router.push('/policy')}
                  >
                    {t(dict, 'policyText')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            {session && session.user && (
              <Nav className="mx-1">
                <Dropdown align="end" className={styles.langSwitch}>
                  <Dropdown.Toggle as={ChevronToggle}>
                    {getAvatar()}
                    {` `}
                    <span className={styles.menuBottomInfo}>{t(dict,'Account')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      active={asPath?.search(/profile$/g) !== -1}
                      onClick={() => router.push('/profile')}
                    >
                      {t(dict, 'Profile')}
                    </Dropdown.Item>
                    {session?.user.roles && session?.user.roles == 'admin' && (
                      <Dropdown.Item
                        active={asPath?.search(/back-office$/g) !== -1}
                        onClick={() => router.push('/back-office')}
                      >
                        {t(dict, 'Admin Panel')}
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={handlerLogout}>
                      {/* <Button > */}
                      {t(dict,'logout')}
                      {/* </Button> */}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            )}
            {!session && (
              <Nav className="mx-2 mt-2 mb-2">
                <Button className="text-white w-100" onClick={handlerLogin}>
                  {t(dict,'login')}
                </Button>
              </Nav>
            )}
            <Nav className="mx-2 mt-2 mb-2">
              {session && session.user && (
                <Dropdown className={`rounded-1 ${styles.actionBtn}`}>
                  <Dropdown.Toggle as={ChevronToggle} id="create">
                    <span className="text-white">{t(dict,'create')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.dropdownMenu}>
                    {session?.user.roles && session?.user.roles == 'admin' && (
                      <Link href="/cycle/create">
                        <a className="dropdown-item">{t(dict, 'cycle')}</a>
                      </Link>
                    )}
                    <Link href="/post/create">
                      <a className="dropdown-item">{t(dict,'post')}</a>
                    </Link>
                    {/* {session?.user.roles && session?.user.roles == 'admin' && ( */}
                      <Link href="/work/create">
                        <a className="dropdown-item">{t(dict,'work')}</a>
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
