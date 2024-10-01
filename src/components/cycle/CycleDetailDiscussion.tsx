import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { FunctionComponent, MouseEvent, useState,useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { CycleDetail } from '../../types/cycle';
import UserAvatar from '../common/UserAvatar';
import useWorks from '@/src/useWorksDetail';
import {useModalContext} from '@/src/hooks/useModal'
import styles from './CycleDetailDiscussion.module.css';
import toast from 'react-hot-toast';
import CycleDetailDiscussionCreateEurekaForm from './CycleDetailDiscussionCreateEurekaForm';
import CycleDetailDiscussionSuggestRelatedWork from './CycleDetailDiscussionSuggestRelatedWork';
import SignInForm from '../forms/SignInForm';
interface Props {
  cycle: CycleDetail;
  className?: string;
  cacheKey:string[];
}
// const whereCycleParticipants = (id:number)=>({
//   where:{OR:[
//     {cycles: { some: { id } }},//creator
//     {joinedCycles: { some: { id } }},//participants
//   ], }
// });
const CycleDetailDiscussion: FunctionComponent<Props> = ({ cycle, className, cacheKey }) => {
  const {data:session, status} = useSession();
  const router = useRouter();
  const isSessionLoading = status == 'loading';
  const {show} = useModalContext()
  const { t } = useTranslation('cycleDetail');
  const { data: dataWorks } = useWorks({where:{cycles: { some: { id: cycle?.id } }} }, {
    enabled:!!cycle?.id
  })
  const [works,setWorks] = useState(dataWorks?.works)
  useEffect(()=>{
    if(dataWorks)setWorks(dataWorks.works)
  },[dataWorks])


  // const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants(cycle.id),
  //   {
  //     enabled:!!cycle,
  //     from:'CycleDetailDiscussion'
  //   }
  // )

   useEffect(()=>{
       if(router.query.tabKey && router.query.tabKey.toString() === 'eurekas'){ 
         if (!session) {
      show(<SignInForm/>)
    } else if(isParticipant()){
                setIsSuggestRelatedWork(false);
                setDiscussionItem("-1");
                setIsCreateEureka(true);
          }
          else
            toast.error( t('canNotCreatePostJoinToCycle'))
     }
  },[router])

  

  const [isCreateEureka, setIsCreateEureka] = useState<boolean>(true);
  const [isSuggestRelatedWork, setIsSuggestRelatedWork] = useState<boolean>(false);
  const [discussionItem, setDiscussionItem] = useState<string | undefined>(undefined); // by default empty but required

  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
  if (!session) {
      show(<SignInForm/>)
    } else {
          if(isParticipant()){
                setIsSuggestRelatedWork(false);
                setIsCreateEureka(true);
                // setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
          }
          else
            toast.error( t('canNotCreatePostJoinToCycle'))

    }
  };
  
  const handleCreateRelatedWorkClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!isSessionLoading && session && session.user.roles === 'admin') {
      setIsSuggestRelatedWork(true);
      //setIsCreateEureka(false);
    }
    // setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: true } });
  };

 

  const isParticipant = ()=>{
    if(!session && !isSessionLoading)return false;
    if (session && cycle && cycle.participants) {
      if (session.user.id === cycle.creatorId) return true; 
      const idx = cycle.participants.findIndex(p=>p.id==session.user.id)
      if(idx>-1)return true;
    }
    return false;
  }

  const canCreateWork = () => {
    return !isSessionLoading && session && session.user.roles === 'admin';
  };


    const onClose = () => {
    //setIsCreateEureka(false);
  };

  return (
    <>
      {cycle && (
        <div className={`${styles.container} ${className}`}>
          {/*<div className='container text-center'>
          <p className={`${styles.initialText}`}>{t('EurekaMomentsExplain')}</p>
          </div>*/}
          <Row className={`d-flex justify-content-center ${styles.discussionContainer}`}>
            {session && session.user && (
              <Col xs={12} md={1} className="d-flex justify-content-center mb-2 mt-3">
                <UserAvatar userId={session.user.id} />
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
              </ButtonGroup>*/}
              {/*(isCreateEureka) && (                
                )*/}
              {/*<Form className="mt-3 font-weight-light">
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
                </Form>*/}

              {isCreateEureka && (
                <div className="mt-3">
                  <CycleDetailDiscussionCreateEurekaForm
                    cycle={cycle}
                    discussionItem={discussionItem}
                    setDiscussionItem={setDiscussionItem}
                    close={onClose}
                  />
                </div>
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
