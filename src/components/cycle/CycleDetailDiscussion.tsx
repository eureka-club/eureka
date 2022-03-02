// import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FunctionComponent, MouseEvent, useState } from 'react';

import { Button, Col, Row, ButtonGroup, Form } from 'react-bootstrap';

// import Link from 'next/link';

// import { Post, Work } from '@prisma/client';
import { GiBrain } from 'react-icons/gi';
import { MdShortText } from 'react-icons/md';
import { BiBookHeart } from 'react-icons/bi';

// import { useMutation, useQueryClient, useQuery } from 'react-query';
// import globalModalsAtom from '../../atoms/globalModals';

import { Session } from '../../types';
// import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { CycleMosaicItem } from '../../types/cycle';
// import { WorkMosaicItem } from '../../types/work';

// import HyvorComments from '../common/HyvorComments';
import UserAvatar from '../common/UserAvatar';
import globalModals from '../../atoms/globalModals';
import useWorks from '@/src/useWorks';

// import detailPagesAtom from '../../atoms/detailPages';

import styles from './CycleDetailDiscussion.module.css';

// import globalSearchEngineAtom from '../../atoms/searchEngine';
import CycleDetailDiscussionCreateEurekaForm from './CycleDetailDiscussionCreateEurekaForm';
import CycleDetailDiscussionSuggestRelatedWork from './CycleDetailDiscussionSuggestRelatedWork';
import CycleDetailDiscussionCreateCommentForm from './CycleDetailDiscussionCreateCommentForm';
// import CommentsList from '../common/CommentsList';

interface Props {
  cycle: CycleMosaicItem;
  className?: string;
  cacheKey:string[];
}

const CycleDetailDiscussion: FunctionComponent<Props> = ({ cycle, className, cacheKey }) => {
  // const [items, setItems] = useState<Item[]>();
  // const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);

  // const router = useRouter();
  const [session, isSessionLoading] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  // const hyvorId = `${WEBAPP_URL}cycle/${cycle.id}`;

  const { data: works } = useWorks({ cycles: { some: { id: cycle?.id } } }, {
    enabled:!!cycle?.id
  })

  const getWorksOpt = () => {
    if (!works) return [];
    return works.map((w) => {
      return (
        <option key={w.id} value={`work-${w.id}`}>
          {w.title}
        </option>
      );
    });
  };

  const [isCreateEureka, setIsCreateEureka] = useState<boolean>(false);
  const [isCreateComment, setIsCreateComment] = useState<boolean>(false);
  const [isSuggestRelatedWork, setIsSuggestRelatedWork] = useState<boolean>(false);
  const [discussionItem, setDiscussionItem] = useState<string | undefined>(undefined); // by default empty but required
  const [globalModalsAtom, setGlobalsModalsAtom] = useAtom(globalModals);

  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) {
      setGlobalsModalsAtom({
        ...globalModalsAtom,
        signInModalOpened: true,
      });
    } else {
      setIsSuggestRelatedWork(false);
      setIsCreateComment(false);
      setIsCreateEureka(true);
      // setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
    }
  };
  const handleCreateCommentClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) {
      setGlobalsModalsAtom({
        ...globalModalsAtom,
        signInModalOpened: true,
      });
    } else {
      setIsSuggestRelatedWork(false);
      setIsCreateComment(true);
      setIsCreateEureka(false);
      // setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
    }
  };
  const handleCreateRelatedWorkClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!isSessionLoading && session && session.user.roles === 'admin') {
      setIsSuggestRelatedWork(true);
      setIsCreateComment(false);
      setIsCreateEureka(false);
    }
    // setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: true } });
  };

  const onChangeDiscussionItem = (e: ChangeEvent<HTMLInputElement>) => {
    setDiscussionItem(() => e.target.value);
  };

  const isParticipant = ()=>{
    if(!session)return false;
    if (session && cycle) {
      if (session.user.id === cycle.creatorId) return true; 
      const idx = cycle.participants.findIndex(p=>p.id==session.user.id)
      if(idx>-1)return true;
    }
    return false;
  }

  const canCreateWork = () => {
    return !isSessionLoading && session && session.user.roles === 'admin';
  };

  return (
    <>
      {cycle && (
        <div className={`${styles.container} ${className}`}>
          {' '}
          <Row className={`d-flex justify-content-center ${styles.discussionContainer}`}>
            <Col xs={12} md={1} className="text-center mb-1">
              {session && session.user && <UserAvatar user={session.user} showName={false} />}
            </Col>
            <Col xs={12} md={11}>
              <ButtonGroup className={`d-flex flex-column flex-md-row justify-content-between ${styles.optButtons}`} size="lg">
                <Button
                  disabled={!isParticipant()}
                  onClick={handleCreateEurekaClick}
                  className={`d-flex align-items-center  justify-content-center ${styles.optButton} ${
                    styles.eurekaBtn
                  } ${isCreateEureka && styles.optButtonActive}`}
                >
                  <GiBrain className="mr-1" />
                  <span className="fs-6">{t('Create an Eureka')}</span>
                </Button>
                <Button
                  disabled={!isParticipant()}
                  onClick={handleCreateCommentClick}
                  className={`d-flex align-items-center  justify-content-center ${styles.optButton} ${
                    styles.commentBtn
                  } ${isCreateComment && styles.optButtonActive}`}
                >
                  <MdShortText className="mr-1" /> <span className="fs-6">{t('Add a quick comment')}</span>
                </Button>
                {canCreateWork() && (
                  <Button
                    onClick={handleCreateRelatedWorkClick}
                    className={`d-flex align-items-center  justify-content-center ${styles.optButton} ${
                      styles.relatedWorkBtn
                    } ${isSuggestRelatedWork && styles.optButtonActive}`}
                  >
                    <BiBookHeart className="mr-1" /> <span className="fs-6">{t('Suggest a related work')}</span>
                  </Button>
                )}
              </ButtonGroup>
              {(isCreateEureka || isCreateComment) && (
                <Form className="mt-3 font-weight-light">
                  <Form.Group controlId="discussionItem">
                    <Form.Control
                      as="select"
                      className={styles.discussionItem}
                      value={discussionItem}
                      onChange={onChangeDiscussionItem}
                    >
                      <option value="">{t('emptyDiscussionItemLbl')}</option>
                      <option value={-1}>{t('Cycle itself')}</option>
                      {getWorksOpt()}
                    </Form.Control>
                  </Form.Group>
                </Form>
              )}
              {isCreateEureka && (
                <div className="mt-3">
                  <CycleDetailDiscussionCreateEurekaForm
                    cacheKey={cacheKey}
                    cycle={cycle}
                    discussionItem={discussionItem}
                    setDiscussionItem={setDiscussionItem}
                  />
                </div>
              )}
              {isCreateComment && (
                <>
                  <div className="mt-3">
                    <CycleDetailDiscussionCreateCommentForm
                      cacheKey={cacheKey}
                      cycle={cycle}
                      discussionItem={discussionItem}
                      setDiscussionItem={setDiscussionItem}
                    />
                  </div>
                </>
              )}
              {isSuggestRelatedWork && canCreateWork() && (
                <div className="mt-3">
                  <CycleDetailDiscussionSuggestRelatedWork cycle={cycle} />
                </div>
              )}
              {/* <CommentsList entity={cycle} /> */}
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default CycleDetailDiscussion;
