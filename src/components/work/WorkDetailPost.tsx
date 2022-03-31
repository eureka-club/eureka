import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FunctionComponent, MouseEvent, useState } from 'react';
import { Button, Col, Row, ButtonGroup, Form } from 'react-bootstrap';
import { GiBrain } from 'react-icons/gi';
import { BiBookHeart } from 'react-icons/bi';
import { Session } from '../../types';
import UserAvatar from '../common/UserAvatar';
import globalModals from '../../atoms/globalModals';
import useWork from '@/src/useWork';
import styles from './WorkDetailPost.module.css';
import { useToasts } from 'react-toast-notifications'

// import globalSearchEngineAtom from '../../atoms/searchEngine';
import WorkDetailCreateEurekaForm from './WorkDetailCreateEurekaForm';
//import CycleDetailDiscussionSuggestRelatedWork from './CycleDetailDiscussionSuggestRelatedWork';
//import CycleDetailDiscussionCreateCommentForm from './CycleDetailDiscussionCreateCommentForm';
// import CommentsList from '../common/CommentsList';

interface Props {
  workId:number  
  className?: string;
  cacheKey:string[];
}

const WorkDetailPost: FunctionComponent<Props> = ({workId,className, cacheKey }) => {

  const [session, isSessionLoading] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  const { addToast } = useToasts()

   const {data:work} = useWork(workId,{
    enabled:!!workId
  })

  const [isCreateEureka, setIsCreateEureka] = useState<boolean>(false);
  const [discussionItem, setDiscussionItem] = useState<string | undefined>(undefined); // by default empty but required
  const [globalModalsAtom, setGlobalsModalsAtom] = useAtom(globalModals);

  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) {
      setGlobalsModalsAtom({
        ...globalModalsAtom,
        signInModalOpened: true,
      });
    }
    else 
       setIsCreateEureka(true);
  };


    const onClose = () => {
    setIsCreateEureka(false);
  };

  return (
    <>
      {work && (
        <div className={`${styles.container} ${className}`}>
          <div className='container text-center'>
          <p className={`${styles.initialText}`}>{t('EurekaMomentsExplain')}</p>
          </div>
          <Row className={`d-flex justify-content-center ${styles.discussionContainer}`}>
            <Col xs={12} md={1} className="text-center mb-1">
              {session && session.user && <UserAvatar width={28} height={28} userId={session.user.id} showName={false} />}
            </Col>
            <Col xs={12} md={11}>
              <ButtonGroup className={`d-flex flex-column flex-md-row justify-content-between ${styles.optButtons}`} size="lg">
                <Button
                  //disabled={!isParticipant()}
                  data-cy="bt-create-eureka"
                  onClick={handleCreateEurekaClick}
                  className={`d-flex align-items-center  justify-content-center ${styles.optButton} ${
                    styles.eurekaBtn
                  } ${isCreateEureka && styles.optButtonActive}`}
                >
                  <GiBrain className="mr-1" />
                  <span className="fs-6">{t('Create an Eureka')}</span>
                </Button>
              </ButtonGroup>
             
              {isCreateEureka && (
                <div className="mt-3">
                 <WorkDetailCreateEurekaForm
                    cacheKey={cacheKey}
                    workItem={work}
                    discussionItem={`work-${work.id}`}
                    setDiscussionItem={setDiscussionItem}
                    close={onClose}
                  />
                </div>
              )}
             </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default WorkDetailPost;
