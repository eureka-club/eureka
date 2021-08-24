// import HyvorTalk from 'hyvor-talk-react';
// import { useAtom } from 'jotai';
// import { useSession } from 'next-auth/client';
// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FunctionComponent, MouseEvent, useState } from 'react';

import { Button, Col, Row, ButtonGroup, Form } from 'react-bootstrap';

// import Link from 'next/link';

// import { Post, Work } from '@prisma/client';

import { BsPlusCircleFill } from 'react-icons/bs';

// import { useMutation, useQueryClient, useQuery } from 'react-query';
// import globalModalsAtom from '../../atoms/globalModals';

// import { Session } from '../../types';
// import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { CycleMosaicItem } from '../../types/cycle';
// import { WorkMosaicItem } from '../../types/work';

// import HyvorComments from '../common/HyvorComments';
import UserAvatar from '../common/UserAvatar';

// import useTopics from '../../useTopics';

// import detailPagesAtom from '../../atoms/detailPages';

import styles from './CycleDetailDiscussion.module.css';

// import globalSearchEngineAtom from '../../atoms/searchEngine';
import CycleDetailDiscussionCreateEurekaForm from './CycleDetailDiscussionCreateEurekaForm';

interface Props {
  cycle: CycleMosaicItem;
}

const CycleDetailDiscussion: FunctionComponent<Props> = ({ cycle }) => {
  // const [items, setItems] = useState<Item[]>();
  // const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  // const router = useRouter();
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  // const hyvorId = `${WEBAPP_URL}cycle/${cycle.id}`;

  const getWorksOpt = () => {
    return cycle.works.map((w) => {
      return (
        <option key={w.id} value={w.id}>
          {w.title}
        </option>
      );
    });
  };

  const [isCreateEureka, setIsCreateEureka] = useState<boolean>(false);
  const [isCreateComment, setIsCreateComment] = useState<boolean>(false);
  const [isCreateRelatedWork, setIsCreateRelatedWork] = useState<boolean>(false);
  const [discussionItem, setDiscussionItem] = useState<string>('-1'); // by default Cycle itself

  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsCreateRelatedWork(false);
    setIsCreateComment(false);
    setIsCreateEureka(true);
    // setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
  };
  const handleCreateCommentClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsCreateRelatedWork(false);
    setIsCreateComment(true);
    setIsCreateEureka(false);
    // setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
  };
  const handleCreateRelatedWorkClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsCreateRelatedWork(true);
    setIsCreateComment(false);
    setIsCreateEureka(false);
    // setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: true } });
  };

  const onChangeDiscussionItem = (e: ChangeEvent<HTMLInputElement>) => {
    setDiscussionItem(() => e.target.value);
  };

  return (
    <>
      {cycle && (
        <div className={styles.container}>
          {' '}
          <Row className={styles.discussionContainer}>
            <Col xs={12} md={1}>
              {cycle.creator && <UserAvatar user={cycle.creator} />}
            </Col>
            <Col xs={12} md={11}>
              <Form>
                <Form.Group controlId="discussionItem">
                  <Form.Control
                    as="select"
                    className={styles.discussionItem}
                    value={discussionItem}
                    onChange={onChangeDiscussionItem}
                  >
                    <option value={-1}>{t('Cycle itself')}</option>
                    {getWorksOpt()}
                  </Form.Control>
                </Form.Group>
              </Form>
              <ButtonGroup as={Row} className={styles.optButtons} size="lg">
                <Button
                  onClick={handleCreateEurekaClick}
                  as={Col}
                  xs={12}
                  md={4}
                  className={`${styles.optButton} ${styles.eurekaBtn} ${isCreateEureka && styles.optButtonActive}`}
                >
                  <BsPlusCircleFill className={styles.optButtonIcon} />
                  Create an Eureka
                </Button>
                <Button
                  onClick={handleCreateCommentClick}
                  as={Col}
                  xs={12}
                  md={4}
                  className={`${styles.optButton} ${styles.commentBtn} ${isCreateComment && styles.optButtonActive}`}
                >
                  <BsPlusCircleFill className={styles.optButtonIcon} /> Add a quick comment
                </Button>
                <Button
                  onClick={handleCreateRelatedWorkClick}
                  as={Col}
                  xs={12}
                  md={4}
                  className={`${styles.optButton} ${styles.relatedWorkBtn} ${
                    isCreateRelatedWork && styles.optButtonActive
                  }`}
                >
                  <BsPlusCircleFill className={styles.optButtonIcon} /> Suggest a related work
                </Button>
              </ButtonGroup>
              {isCreateEureka && (
                <div className="mt-3">
                  <CycleDetailDiscussionCreateEurekaForm cycle={cycle} discussionItem={discussionItem} />
                </div>
              )}
              {isCreateComment && <div>comments</div>}
              {isCreateRelatedWork && <div>related works</div>}
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default CycleDetailDiscussion;
