import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useSession, signOut } from 'next-auth/client';
import Link from 'next/link';
import { FunctionComponent, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { BiCheck, BiUser } from 'react-icons/bi';

import ChevronToggle from './ui/dropdown/ChevronToggle';
import homepageAtom from '../atoms/homepage';
import styles from './Navbar.module.css';

const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const Navbar: FunctionComponent = () => {
  const [homepageState, setHomepageState] = useAtom(homepageAtom);
  const [session] = useSession();

  const openSignInModal = () => {
    setHomepageState({ ...homepageState, ...{ signInModalOpened: true } });
  };

  const handleCreatePost = (ev: MouseEvent<DropdownItemProps>) => {
    ev.preventDefault();

    if (session == null) {
      openSignInModal();
    } else {
      setHomepageState({ ...homepageState, ...{ createPostModalOpened: true } });
    }
  };

  return (
    <BootstrapNavbar variant="light" expand="xl" className="p-0">
      <BootstrapNavbar.Brand href="/" className={classNames(styles.brand, 'mr-4')}>
        <img className="d-inline-block align-top mr-1" alt="Project logo" src="/img/logo.png" width={60} /> {siteName}
      </BootstrapNavbar.Brand>

      <Form inline className="mr-auto">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      </Form>

      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse>
        <Nav>
          <Button variant="outline-primary" className="mr-2">
            <BiCheck /> Cycle
          </Button>
          <Button variant="outline-primary" className="mr-2">
            <BiCheck /> Read
          </Button>
          <Button variant="outline-primary" className="">
            <BiCheck /> Watch
          </Button>
        </Nav>

        <Nav className="ml-auto">
          <Dropdown>
            <Dropdown.Toggle as={ChevronToggle} id="create">
              Create
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenu}>
              {session == null ? (
                <Dropdown.Item className={styles.dropdownMenuItem} onClick={openSignInModal}>
                  Cycle
                </Dropdown.Item>
              ) : (
                <Link href="/cycle/create">
                  <a className={classNames(styles.dropdownMenuItem, 'dropdown-item')}>Cycle</a>
                </Link>
              )}
              <Dropdown.Item className={styles.dropdownMenuItem} onClick={handleCreatePost}>
                Post
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="link">My cycles</Button>
          <NavDropdown title={<BiUser className={styles.profileDropdown} />} id="profile">
            {session == null ? (
              <NavDropdown.Item onClick={openSignInModal}>Sign-in</NavDropdown.Item>
            ) : (
              <>
                <NavDropdown.ItemText>{session.user.email}</NavDropdown.ItemText>
                <NavDropdown.Item onClick={() => signOut()}>Sign-out</NavDropdown.Item>
              </>
            )}
          </NavDropdown>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
