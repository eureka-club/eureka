// import classNames from 'classnames';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import { setCookie } from 'nookies';
import { FunctionComponent, ChangeEvent } from 'react';
import { Container, Row, Col, InputGroup, Form, FormControl } from 'react-bootstrap';

import { AiOutlineSearch } from 'react-icons/ai';

// import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import { Session } from '../types';
import globalSearchEngineAtom from '../atoms/searchEngine';
import styles from './SearchEngine.module.css';

const { NEXT_PUBLIC_SITE_NAME: siteName } = process.env;

const SearchEngine: FunctionComponent = () => {
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [session] = useSession() as [Session | null | undefined, boolean];
  const router = useRouter();
  const { t } = useTranslation('common');
  /*
  const openSignInModal = () => {
    setGlobalSearchEngineState({ ...globalSearchEngineState, ...{ signInModalOpened: true } });
  };

  const handleCreatePostClick = (ev: MouseEvent<DropdownItemProps>) => {
    ev.preventDefault();

    setGlobalSearchEngineState({ ...globalSearchEngineState, ...{ createPostModalOpened: true } });
  };

  const handleCreateWorkClick = (ev: MouseEvent<DropdownItemProps>) => {
    ev.preventDefault();

    setGlobalSearchEngineState({ ...globalSearchEngineState, ...{ createWorkModalOpened: true } });
  };

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
    }
  };

  const handleAboutSelect = (eventKey: string | null) => {
    if (eventKey === 'aboutEureka') router.push('/about');
    else if (eventKey === 'aboutUs') router.push('/aboutUs');
  };
*/
  const handlerComboxesChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    let { only } = globalSearchEngineState;
    if (only.includes(type)) only = only.filter((i) => i !== type);
    else only.push(type);
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      ...{ only },
    });
  };

  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <InputGroup className="mb-3">
            <InputGroup.Append>
              <InputGroup.Text id="inputGroup-sizing-default">
                <AiOutlineSearch />
              </InputGroup.Text>
            </InputGroup.Append>
            <FormControl
              placeholder={t('Search for anything you wanna learn about')}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
        </Col>
        <Col>
          <Form>
            <Form.Group className={styles.formGroup}>
              <Form.Check inline type="checkbox" label="Cycles" onChange={(e) => handlerComboxesChange(e, 'cycle')} />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Check inline type="checkbox" label="Eurekas" onChange={(e) => handlerComboxesChange(e, 'post')} />
            </Form.Group>
            <Form.Group className={styles.formGroup}>
              <Form.Check
                inline
                type="checkbox"
                label="Films"
                onChange={(e) => handlerComboxesChange(e, 'work-film')}
              />
            </Form.Group>

            <Form.Group className={styles.formGroup} controlId="checkboxes">
              <Form.Check
                inline
                type="checkbox"
                label="Books"
                onChange={(e) => handlerComboxesChange(e, 'work-book')}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchEngine;
