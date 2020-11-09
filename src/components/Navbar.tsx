import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { Button, Dropdown, Form, FormControl, Nav, Navbar as BootstrapNavbar, NavDropdown } from 'react-bootstrap';
import { BiCheck, BiUser } from 'react-icons/bi';

import ChevronToggle from './ui/dropdown/ChevronToggle';
import styles from './Navbar.module.css';

const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const Navbar: FunctionComponent = () => {
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
              <Dropdown.Item className={styles.dropdownMenuItem}>Cycle</Dropdown.Item>
              <Dropdown.Item className={styles.dropdownMenuItem}>Post</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="link">My cycles</Button>
          <NavDropdown title={<BiUser className={styles.profileDropdown} />} id="profile">
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
