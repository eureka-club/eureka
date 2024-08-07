import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import searchEngine from '@/src/atoms/searchEngine';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { setCookie } from 'nookies';
import { FunctionComponent } from 'react';
import LocalImageComponent from '@/src/components/LocalImage';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../forms/SignInForm';
import { Container, Button, Nav, Navbar, Dropdown, Spinner } from 'react-bootstrap';
import { BiUser } from 'react-icons/bi';
// import NotificationsList from '@/components/NotificationsList';
import { RiDashboardLine } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { HiOutlineHashtag } from 'react-icons/hi';
import SearchInput from '@/src/components/SearchInputOLD';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL, WEBAPP_URL } from '@/src/constants';
import ChevronToggle from '@/components/ui/dropdown/ChevronToggle';
import styles from './Navbar.module.css';
import slugify from 'slugify';
import { useQueryClient } from 'react-query';
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

const NavBarOld: FunctionComponent = () => {
  const queryClient = useQueryClient();
  
  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';
  const router = useRouter();
  const { t } = useTranslation('navbar');
  const [, setSearchEngineState] = useAtom(searchEngine);
  const { show } = useModalContext();

  const { data: user } = useUserSumary(session?.user.id!, {
    enabled: !!session,
  });

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      queryClient.clear();
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
      window.location.replace(`${WEBAPP_URL}/${locale}${router.asPath}`);
    }
  };

  const handlerLogout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}` });
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
          filePath={`users-photos/${user.photos[0].storedFile}`}
          alt={user.name || ''}
        />
      );
    }
    return <BiUser className={styles.navbarIconNav} />;
  };

  const handlerLogin = () => {
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
    setSearchEngineState((res) => ({ ...res, itemsFound: [] }));
    router.push(`/search?q=${v}`);
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
    <Container className={`${styles.container}`}>
      <Navbar collapseOnSelect expand="lg" bg="white" fixed="top" className="border-bottom border-primary">
        <Container className="px-0  d-flex flex-lg-column flex-xxl-row">
          <section className='d-flex flex-row w-100 justify-content-start ms-2 ' >
          <Link href="/" replace>
            <a className="d-flex align-items-center">
              <Navbar.Brand className="cursor-pointer">
                <aside className="d-flex justify-content-around align-items-center">
                  {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
                  <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                  <section>
                    <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                    <p className="text-secondary my-0 ms-3 font-weight-light fs-xs">{t('tagline')}</p>
                  </section>
                </aside>
              </Navbar.Brand>
            </a>
          </Link>
            <Nav className="d-flex align-items-center ms-2 ms-xxl-5">{!isLoadingSession && <SearchInput className="" style={{ width: '385px' }} />}</Nav>
        </section>
          <section className='d-flex my-lg-1 flex-row w-100 justify-content-start' >
          {isLoadingSession ? (
            <Spinner animation="grow" variant="info" />
          ) : (
            <>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse className={`d-flex justify-content-lg-start justify-content-xxl-center`}>
                <Nav className={`${styles.navbarNav} ms-xxl-2`}>
                  <Dropdown data-cy="link-topics" align="start" className={styles.langSwitch}>
                    <Dropdown.Toggle as={ChevronToggle}>
                      <HiOutlineHashtag
                        className={`${styles.navbarIconNav} border border-2 border-primary`}
                        style={{ scale: '90%', padding: '2px' }}
                      />
                    </Dropdown.Toggle>
                    <span className={styles.menuBottomInfo}>{t('Topics')}</span>
                    <Dropdown.Menu data-cy="links-topics">{getTopicsLinks()}</Dropdown.Menu>
                  </Dropdown>
                </Nav>
                {session && session.user && (
                  <Nav className={`${styles.navbarNav} text-center d-flex`}>
                    <Dropdown className={styles.langSwitch}>
                      <Dropdown.Toggle as={ChevronToggle}>
                        <RiDashboardLine className={styles.navbarIconNav} />
                      </Dropdown.Toggle>
                      <span className={styles.menuBottomInfo}>{t('My Mediatheque')}</span>
                        <Dropdown.Menu >
                          <Dropdown.Item>
                            <Link href={`/mediatheque/${getMediathequeSlug()}`}>
                              <a data-cy="my-mediatheque-link" className={styles.navLink}>
                                {t('My Mediatheque')}
                              </a>
                            </Link>

                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Link href={`/user/${getMediathequeSlug() }/my-read-or-watched`}>
                              <a className={styles.navLink}>
                                {t("MyReadOrWatched")}
                              </a>
                            </Link>

                          </Dropdown.Item>
                         
                        </Dropdown.Menu>

                    </Dropdown>
                    {/*<Nav.Item>
                      <Link href={`/mediatheque/${getMediathequeSlug()}`}>
                        <a data-cy="my-mediatheque-link" className={styles.navLink}>
                          <RiDashboardLine className={styles.navbarIconNav} />
                          <span className={styles.menuBottomInfo}>{t('My Mediatheque')}</span>
                        </a>
                      </Link>
                    </Nav.Item>*/}
                  </Nav>
                )}
                {!isLoadingSession && (
                  <>
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
                          <Dropdown.Item
                            active={router.asPath.search(/about$/g) !== -1}
                            onClick={() => router.push('/about')}
                          >
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
                    <Nav className="me-1">
                      {router.locales?.length && (
                        <Dropdown
                          data-cy="link-language"
                          align="end"
                          className={styles.langSwitch}
                          onSelect={handleLanguageSelect}
                        >
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
                                {/* <Link href={router.asPath} locale={locale}> */}
                                  <img
                                    className={`m-1 ${styles.navbarIconNav}`}
                                    src={`/img/lang-flags/${locale}.png`}
                                    alt={`Language flag '${locale}'`}
                                  />
                                {/* </Link> */}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </Nav>
                  </>
                )}
                {session && session.user && (
                  <Nav className={`${styles.navbarNav} d-flex me-1`}>
                    <Dropdown data-cy="session-actions" align="end" className={`${styles.sessionActions} ${styles.avatar}`}>
                      <Dropdown.Toggle as={ChevronToggle}>{getAvatar()}</Dropdown.Toggle>
                      <span className={styles.menuBottomInfo}>{t('Account')}</span>
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
                          {t('logout')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav>
                )}
                
                    <Nav className={styles.navbarNav}>
                      {!session && !isLoadingSession && (
                        <Button
                          className="ms-4 btn-eureka"
                          data-cy="btn-login"
                          onClick={handlerLogin} /*onClick={openSignInModal}*/
                        >
                          {t('login')}
                        </Button>
                      )}
                    </Nav>
                   {session && session.user && ( <>
                   <Nav.Item data-cy="notifications-btn">
                  {/* <NotificationsList /> */}
                </Nav.Item>
                   <Nav className="ms-2 d-flex align-items-center ">
                      
                        <Dropdown className={`rounded-1 ${styles.actionBtn}`}>
                          <Dropdown.Toggle as={ChevronToggle} id="create">
                            <span className="text-white">{t('create')}</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {session?.user.roles && session?.user.roles == 'admin' && (
                              <Link href="/cycle/create">
                                <a className="dropdown-item">{t('cycle')}</a>
                              </Link>
                            )}
                            <Link href="/post/create">
                              <a className="dropdown-item">{t('post')}</a>
                            </Link>
                            {/*<Dropdown.Item onClick={handleCreatePostClick}>{t('post')}</Dropdown.Item>*/}
                            {/*{session?.user.roles && session?.user.roles == 'admin' && (*/}
                            <Link href="/work/create">
                              <a className="dropdown-item">{t('work')}</a>
                            </Link>
                            {/*)}
                  <Dropdown.Item onClick={handleCreateWorkClick}>{t('v')}</Dropdown.Item>*/}
                          </Dropdown.Menu>
                        </Dropdown>
                      
                      </Nav></>)}
              </Navbar.Collapse>
                  
            </>
          )}          
          </section>
        </Container>
      </Navbar>
    </Container>
  );
};

export default NavBarOld;
