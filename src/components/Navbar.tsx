import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useSession, signOut } from 'next-auth/client';
import Link from 'next/link';
import { FunctionComponent, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { BiUser } from 'react-icons/bi';

import { Session } from '../types';
import ChevronToggle from './ui/dropdown/ChevronToggle';
import homepageAtom from '../atoms/homepage';
import styles from './Navbar.module.css';

const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const Navbar: FunctionComponent = () => {
  const [homepageState, setHomepageState] = useAtom(homepageAtom);
  const [session] = useSession() as [Session | null | undefined, boolean];

  const openSignInModal = () => {
    setHomepageState({ ...homepageState, ...{ signInModalOpened: true } });
  };

  const handleCreatePostClick = (ev: MouseEvent<DropdownItemProps>) => {
    ev.preventDefault();

    setHomepageState({ ...homepageState, ...{ createPostModalOpened: true } });
  };

  const handleCreateWorkClick = (ev: MouseEvent<DropdownItemProps>) => {
    ev.preventDefault();

    setHomepageState({ ...homepageState, ...{ createWorkModalOpened: true } });
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
            <Button onClick={openSignInModal}>Login</Button>
          </Nav>
        ) : (
          <Nav className="ml-auto">
            <Dropdown className="mr-4">
              <Dropdown.Toggle as={ChevronToggle} id="create">
                Create
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdownMenu}>
                <Link href="/cycle/create">
                  <a className={classNames(styles.dropdownMenuItem, 'dropdown-item')}>Cycle</a>
                </Link>
                <Dropdown.Item className={styles.dropdownMenuItem} onClick={handleCreatePostClick}>
                  Post
                </Dropdown.Item>
                {session?.user.roles.includes('admin') && (
                  <Dropdown.Item className={styles.dropdownMenuItem} onClick={handleCreateWorkClick}>
                    Work
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>

            <NavDropdown alignRight title={<BiUser className={styles.profileDropdown} />} id="profileDropdown">
              <NavDropdown.ItemText>{session.user.email}</NavDropdown.ItemText>
              <NavDropdown.Item onClick={() => signOut()}>Sign-out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
      </BootstrapNavbar>
    </Container>
  );
};

export default Navbar;
