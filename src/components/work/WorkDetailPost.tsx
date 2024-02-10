import { useSession} from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FunctionComponent, MouseEvent, useState ,useEffect} from 'react';
import { Button, Col, Row, ButtonGroup, Form } from 'react-bootstrap';
import { GiBrain } from 'react-icons/gi';
import { BiBookHeart } from 'react-icons/bi';
import { Session } from '../../types';
import UserAvatar from '../common/UserAvatar';
import useWork from '@/src/useWorkDetail';
import styles from './WorkDetailPost.module.css';
import {useModalContext} from '@/src/useModal'
import SignInForm from '../forms/SignInForm';


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

  const {data:session, status} = useSession();
  const isSessionLoading = status == 'loading';
  const {show} = useModalContext()
  const router = useRouter();
  
  const { t } = useTranslation('cycleDetail');

   const {data:work} = useWork(workId,{
    enabled:!!workId
  })

  const [isCreateEureka, setIsCreateEureka] = useState<boolean>(true);
  const [discussionItem, setDiscussionItem] = useState<string | undefined>(undefined); // by default empty but required
  const query = router.query;

   useEffect(()=>{
       if(query.tabKey && query.tabKey.toString() === 'posts'){ 
          setIsCreateEureka(true);  
       }
  },[])

  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) {
        show(<SignInForm/>)
    }
    else 
       setIsCreateEureka(true);
  };


    const onClose = () => {
    //setIsCreateEureka(false);
  };

  return (
    <>
      {work && (
        <div className={`${styles.container} ${className}`}>
          {/*<div className='container text-center'>
         <p className={`${styles.initialText}`}>{t('EurekaMomentsExplain')}</p>
          </div>*/}
          <Row className={`d-flex justify-content-center ${styles.discussionContainer}`}>
            {session && session.user && (
              <Col xs={12} md={1} className="d-flex justify-content-center mb-2 mt-3">
                <UserAvatar  width={28} height={28} userId={session.user.id} showName={false} />
              </Col>
            )}
            <Col xs={12} md={11}>
              {/*<ButtonGroup className={`border-0 d-flex flex-column flex-md-row justify-content-between ${styles.optButtons}`} size="lg">
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
              </ButtonGroup>*/}

              {isCreateEureka && (
                <div className="">
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
