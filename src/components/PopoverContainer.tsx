// import classNames from 'classnames';
import { useAtom } from 'jotai';
// import { useSession } from 'next-auth/client';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
// import { setCookie } from 'nookies';
import { FunctionComponent, ChangeEvent, useState, ReactElement } from 'react';
import { Container, Row, Col, InputGroup, Form, Button, Popover, OverlayTrigger } from 'react-bootstrap';

import { AiOutlineSearch } from 'react-icons/ai';

// import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL } from '../constants';
import { Session, SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../types';

import globalSearchEngineAtom from '../atoms/searchEngine';
import styles from './Popover.module.css';

type Props = {
  children: ReactElement[];
  title: string;
  className?: string;
};

const PopoverContainer: FunctionComponent<Props> = (props) => {
  const { children, title, className } = props;
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const router = useRouter();
  const { t } = useTranslation('searchEngine');

  // const handlerComboxesChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
  //   let { only } = globalSearchEngineState;
  //   if (only.includes(type)) only = only.filter((i) => i !== type);
  //   else only.push(type);
  //   setGlobalSearchEngineState({
  //     ...globalSearchEngineState,
  //     ...{ only },
  //   });
  // };

  return (
    <>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <Popover id="popover-positioned-bottom" className={className}>
            <Popover.Title as="h3">{title}</Popover.Title>
            <Popover.Content>{children}</Popover.Content>
          </Popover>
        }
      >
        <Button variant="light" className={styles.button}>
          {title}
        </Button>
      </OverlayTrigger>
    </>
  );
};

export default PopoverContainer;
