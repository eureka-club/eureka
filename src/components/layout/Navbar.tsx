//"use client"

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
// import { useAtom } from 'jotai';
// import searchEngine from '@/src/atoms/searchEngine';
import { setCookie } from 'nookies';
import { FunctionComponent, useEffect, useState } from 'react';
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
import styles from './Navbar.module.css';
import useUser from '@/src/hooks/useUser';
import slugify from 'slugify';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { i18n } from 'i18n-config';
import { t } from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';

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
interface Props{
}
const NavBar: FunctionComponent<Props> = ({}) => {
  const queryClient = useQueryClient();
  const {dict}=useDictContext()
  const router = useRouter();
  const asPath = usePathname();
  const searchParams = useSearchParams();
  
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
          filePath={`users-photos/${user.photos.length ? user.photos[0]?.storedFile:''}`}
          alt={user.name || ''}
        />
      );
    }
    return <BiUser className={styles.navbarIconNav} />;
  };

  const handlerLogin = () => {
    const sp = searchParams?.toString();
    localStorage.setItem('loginRedirect',`${asPath}/?${sp}`)
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
              {t(dict,`${topic}`)}
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
          <Link legacyBehavior  href="/" replace>
            <span className="d-flex align-items-center">
              <Navbar.Brand className="cursor-pointer">
                <aside className="d-flex justify-content-around align-items-center">
                  <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                  <section>
                    <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                      <p className="text-secondary my-0 ms-3 font-weight-light fs-xs">{t(dict, 'tagline')}</p>
                  </section>
                </aside>
              </Navbar.Brand>
            </span>
          </Link>
            <Nav className="d-flex align-items-center ms-2 ms-xxl-5">{
            // !isLoadingSession && 
              <SearchInput className="" style={{ width: '420px' }} />}
            </Nav>
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
                        <span className={styles.menuBottomInfo}>{t(dict,'Topics')}</span>
                    <Dropdown.Menu data-cy="links-topics">{getTopicsLinks()}</Dropdown.Menu>
                  </Dropdown>
                </Nav>
                 {session && session.user && (
                  <Nav className={`${styles.navbarNav} text-center d-flex`}>
                    <Dropdown className={styles.langSwitch}>
                      <Dropdown.Toggle as={ChevronToggle}>
                        <RiDashboardLine className={styles.navbarIconNav} />
                      </Dropdown.Toggle>
                          <span className={styles.menuBottomInfo}>{t(dict,'My Mediatheque')}</span>
                        <Dropdown.Menu >
                          <Dropdown.Item>
                            <Link legacyBehavior  href={`/mediatheque/${getMediathequeSlug()}`}>
                              <span data-cy="my-mediatheque-link" className={styles.navLink}>
                                  {t(dict,'My Mediatheque')}
                              </span>
                            </Link>

                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Link legacyBehavior  href={`/user/${getMediathequeSlug() }/my-read-or-watched`}>
                              <span className={styles.navLink}>
                                  {t(dict,'MyReadOrWatched')}
                              </span>
                            </Link>

                          </Dropdown.Item>
                         
                        </Dropdown.Menu>

                    </Dropdown>
                  </Nav>
                )}
                {!isLoadingSession && (
                  <>
                    <Nav className={styles.navbarNav}>
                      <Dropdown data-cy="link-about" align="end" className={styles.langSwitch}>
                        <Dropdown.Toggle as={ChevronToggle}>
                          <AiOutlineInfoCircle className={styles.navbarIconNav} />
                        </Dropdown.Toggle>
                            <span className={styles.menuBottomInfo}>{t(dict,'About')}</span>
                        <Dropdown.Menu data-cy="links-about">
                          <Dropdown.Item
                            active={asPath?.search(/manifest$/g) !== -1}
                            onClick={() => router.push('/manifest')}
                          >
                                {t(dict,'Manifest')}
                          </Dropdown.Item>
                          <Dropdown.Item
                            active={asPath?.search(/about$/g) !== -1}
                            onClick={() => router.push('/about')}
                          >
                                {t(dict,'About Eureka')}
                          </Dropdown.Item>
                          <Dropdown.Item
                            active={asPath?.search(/aboutUs$/g) !== -1}
                            onClick={() => router.push('/aboutUs')}
                          >
                                {t(dict,'About Us')}
                          </Dropdown.Item>
                          <Dropdown.Item
                            active={asPath?.search(/policy$/g) !== -1}
                            onClick={() => router.push('/policy')}
                          >
                                {t(dict,'policyText')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Nav>
                  </>
                )}
                {session && session.user && (
                  <Nav className={`${styles.navbarNav} d-flex me-1`}>
                    <Dropdown data-cy="session-actions" align="end" className={`${styles.langSwitch} ${styles.avatar}`}>
                      <Dropdown.Toggle as={ChevronToggle}>{getAvatar()}</Dropdown.Toggle>
                          <span className={styles.menuBottomInfo}>{t(dict,'Account')}</span>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          active={asPath?.search(/profile$/g) !== -1}
                          onClick={() => router.push('/profile')}
                        >
                              {t(dict,'Profile')}
                        </Dropdown.Item>
                        {session?.user.roles && session?.user.roles == 'admin' && (
                          <Dropdown.Item
                            active={asPath?.search(/back-office$/g) !== -1}
                            onClick={() => router.push('/back-office')}
                          >
                                {t(dict,'Admin Panel')}
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item onClick={handlerLogout}>
                              {t(dict,'logout')}
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
                          onClick={handlerLogin} 
                        >
                          <span>{t(dict,'login')}</span>
                        </Button>
                      )}
                    </Nav>
                   {session && session.user && ( <>
                   <Nav.Item data-cy="notifications-btn">
                      <NotificationsList />
                      
                   </Nav.Item>
                   <Nav className="ms-2 d-flex align-items-center ">
                      
                        <Dropdown className={`rounded-1 ${styles.actionBtn}`}>
                          <Dropdown.Toggle as={ChevronToggle} id="create">
                            <span className="text-white">{t(dict,'create')}</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {session?.user.roles && session?.user.roles == 'admin' && (
                              <Link legacyBehavior  href="/cycle/create">
                                <span className="dropdown-item  text-primary">{t(dict,'cycle')}</span>
                              </Link>
                            )}
                            <Link legacyBehavior  href="/post/create">
                              <span className="dropdown-item text-primary">{t(dict,'post')}</span>
                            </Link>
                            <Link legacyBehavior  href="/work/create">
                              <span className="dropdown-item text-primary">{t(dict,'work')}</span>
                            </Link>
                          </Dropdown.Menu>
                        </Dropdown>
                      
                      </Nav></>)
                    } 
              </Navbar.Collapse>
                  
            </>
          )}          
          </section>
        </Container>
      </Navbar>
    </Container>
  );
};

export default NavBar;
