import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, MouseEvent, useMemo } from 'react';
import {  useQueryClient,useIsFetching } from 'react-query';
import { useRouter } from 'next/router';
import { Card, Button, Spinner, Badge,Tooltip} from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useSession } from 'next-auth/react';
import { CgMediaLive } from 'react-icons/cg';
import { MdGroup } from 'react-icons/md';
import { RiDoorOpenLine, RiDoorClosedLine } from 'react-icons/ri';AiOutlineCrown
import { BiAlarm } from 'react-icons/bi'
import { AiOutlineCrown } from 'react-icons/ai'
import { DATE_FORMAT_SHORT } from '../../constants';
import LocalImageComponent from '../LocalImage';
import styles from './NewMosaicItem.module.css';
import useUser from '@/src/useUser';
import useUsers from '@/src/useUsers'
import SocialInteraction from '../common/SocialInteraction';
import { useCycleContext } from '../../useCycleContext';
import toast from 'react-hot-toast';
import useCycle from '@/src/useCycle'
import Avatar from '../common/UserAvatar';
import useCycleJoinRequests,{setCycleJoinRequests,removeCycleJoinRequest} from '@/src/useCycleJoinRequests'
import {useJoinUserToCycleAction,useLeaveUserFromCycleAction} from '@/src/hooks/mutations/useCycleJoinOrLeaveActions'
import {useModalContext} from '@/src/useModal'
import SignInForm from '../forms/SignInForm';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
interface Props {
  cycleId:number;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showParticipants?: boolean;
  detailed?: boolean;
  cacheKey?: [string,string];
  showSocialInteraction?: boolean;
  showCreateEureka?: boolean;
  showSaveForLater?: boolean;
  showTrash?: boolean;
  size?: string;
  className?: string;
}
const NewMosaicItem: FunctionComponent<Props> = ({
  showButtonLabels = false,
  detailed = true,
  showSocialInteraction = true,
  showParticipants = true,
  showCreateEureka,
  showSaveForLater,
  cacheKey = undefined,
  showTrash = false,
  size,
  className,
  cycleId
}) => {
  const { linkToCycle = true, currentUserIsParticipant } = useCycleContext();
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  const [idSession,setIdSession] = useState<string>('')
  const { data: user } = useUser(+idSession,{ enabled: !!+idSession });
  const [isCurrentUserJoinedToCycle, setIsCurrentUserJoinedToCycle] = useState<boolean>(false);
  const [countParticipants,setCountParticipants] = useState<number>()
  
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const {data:cycle} = useCycle(cycleId,{enabled:!!cycleId})

  const {show} = useModalContext()
  
  const whereCycleParticipants = {
    where:{
      OR:[
        {cycles: { some: { id: cycle?.id } }},//creator
        {joinedCycles: { some: { id: cycle?.id } }},//participants
      ], 
    }
  };
  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants,
    {
      enabled:!!cycle?.id,
      from:'cycle/Mosaic'
    }
  )

  const isFetchingParticipants = useIsFetching(['USERS',JSON.stringify(whereCycleParticipants)])
  
  useEffect(() => {
    const s = session;
    if (s) {
      setIdSession(s.user.id.toString());
    }
  }, [session]);
  
  const {data:cycleJoinRequests,isLoading:isLoadingCycleJoinRequests} = useCycleJoinRequests(+idSession,{enabled:!!idSession})

  useEffect(() => {
    setIsCurrentUserJoinedToCycle(false)
    if (cycle && user && participants) {
      setCountParticipants(participants.length);
      const idx = participants.findIndex(p=>p.id==user.id);
      if(idx > -1) 
        setIsCurrentUserJoinedToCycle(true)
      // if (currentUserIsParticipant === undefined) {
      //   if (session && user && user.joinedCycles) {
      //     if (!user.joinedCycles.length) setIsCurrentUserJoinedToCycle(false);
      //     else {
      //       const icujtc = user.joinedCycles.findIndex((c) => cycle.id === c!.id) !== -1;
      //       setIsCurrentUserJoinedToCycle(icujtc);
      //     }
      //   }
      // } else setIsCurrentUserJoinedToCycle(!!currentUserIsParticipant);
    }
  }, [user, cycle,participants, /* currentUserIsParticipant, */ session]);

  
  // const { id, title, localImages,} = cycle!;
  const { t } = useTranslation('common');
  const isFetchingCycle = useIsFetching(['CYCLE',`${cycle?.id}`])
  
  const isActive = () => cycle ? dayjs().isBetween(cycle.startDate, cycle.endDate, null, '[]') : false;

  const {
    mutate: execJoinCycle,
    isLoading: isJoinCycleLoading,
    data: mutationResponse,
    // isSuccess: isJoinCycleSuccess,
  } = useJoinUserToCycleAction(user!,cycle!,participants!,(_data,error)=>{
    if(!error) {//para q no salgan dos toast al unirse a ciclo privado
      if(cycle?.access != 2)
        toast.success(t('OK'));
    }
    else
      toast.error(t('Internal Server Error'));
});

  const {
    mutate: execLeaveCycle,
    isLoading: isLeaveCycleLoading,
    // isSuccess: isLeaveCycleSuccess,
  } = useLeaveUserFromCycleAction(user!,cycle!,participants!,(_data,error)=>{
    if(!error) 
        toast.success(t('OK'));
    else
      toast.error(t('Internal Server Error'));
});

  const isPending = ()=> isLoadingSession || isFetchingCycle>0 || isJoinCycleLoading || isLeaveCycleLoading;

  const showJoinButtonCycle = () => {
    const isLoading = isJoinCycleLoading || isLeaveCycleLoading;
    if (isLoading) return false;
    if (user) {
      if (isJoinCycleLoading) return false;
      if (user.id === cycle!.creatorId) return false;
    }
    return true;
  };

  const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) {
      show(<SignInForm/>)
    }
    else execJoinCycle();
  };

  const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execLeaveCycle();
  };

  const getCycleAccesLbl = () => {
    if (cycle) {
      if (cycle.access === 1) return t('public');
      if (cycle.access === 2) return t('private');
      if (cycle.access === 3) return t('secret');
    }
    return '';
  };

  const canNavigate = () => {
    return !loading;
  };
  const onImgClick = () => {
    if (canNavigate()) router.push(`/cycle/${cycle?.id}`);
    setLoading(true);
  }; 

  const renderLocalImageComponent = () => {
    const img = cycle?.localImages 
      ? <div className='img h-100 cursor-pointer'> 
      <LocalImageComponent className='cycle-img-card'  filePath={cycle?.localImages[0].storedFile} title={cycle?.title} alt={cycle?.title} />
      
      {detailed && (cycle && cycle.creator && cycle.startDate && cycle.endDate ) && (<div className={`d-flex flex-row justify-content-between  ${styles.date}`}>
                        <div  className={` d-flex flex-row aling-items-center fs-6`}>
                         <Avatar className='' width={26} height={26} userId={cycle.creator.id} showName={false} size="xs" />
                         <div className='d-flex align-items-center'>
                            {dayjs(cycle?.startDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
                          <span className='' style={{marginLeft:'1.5px',marginRight:'1.5px'}}>-</span>
                            {dayjs(cycle?.endDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
                         </div>   
                        
          </div>
                        </div>)}
                          
      </div>
      : undefined;
    if (linkToCycle) {
      return (
        <div
          className={`${!loading ? 'cursor-pointer' : ''} mb-2`}
          onClick={onImgClick}
          role="presentation"
        >
          {!canNavigate() && <Spinner className="position-absolute top-50 start-50" animation="grow" variant="info" style={{zIndex:'1'}} />}
          {img}
        </div>
      );
    }
    return img;
  };


  
  const renderJoinLeaveCycleBtn = useMemo(()=>{
    if(cycle && !isLoadingSession){
     
      if(cycle.currentUserIsCreator)
        return   <Button   variant="btn-warning border-warning text-white fs-6 disabled" className={`rounded rounded-2  ${styles.joinButtonContainer}`} size='sm'>
          <span className='fs-6'>{t('MyCycle')}</span>
      </Button>

      if(cycle.currentUserIsParticipant)         
          return <Button  disabled={isPending()} onClick={handleLeaveCycleClick} variant="button border-primary text-primary" className={`rounded rounded-2  ${styles.joinButtonContainer}`} size='sm'>
           {!isPending() ? <span className='fs-6'>{t('leaveCycleLabel')}</span> :  <Spinner size='sm' animation='grow'/> } 
            </Button>

      if(cycle.currentUserIsPending)
         return  <Button 
            disabled={true}
            className={`rounded rounded-2 text-white ${styles.joinButtonContainer}`} size='sm'>
            <span className='fs-6'>{t('joinCyclePending')}</span>
            </Button>

          return  <Button 
            disabled={isPending()}
            onClick={handleJoinCycleClick} className={`rounded rounded-2 text-white ${styles.joinButtonContainer}`} size='sm'>
              {!isPending() ? <span className='fs-6'>{t('joinCycleLabel')}</span> :  <Spinner size='sm' animation='grow'/> }
            </Button>           
    }

    return <Button 
          disabled={true}
          className="text-white">
            <Spinner size='sm' animation='grow'/>
          </Button>
  },[cycle,isLoadingSession])

  if(!cycle)return <></>

  return (
     <Card className={`${size?.length ? `mosaic-${size}` : 'mosaic'} ${isActive() ? 'my-1 isActive' : ''} ${className}`} data-cy={`mosaic-item-cycle-${cycle.id}`} >
        <Card.Body>  
        <div className={`${linkToCycle ? 'cursor-pointer' : ''} ${styles.imageContainer}`} >
            {renderLocalImageComponent()}
            {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
            <Badge bg="primary" className={`d-flex flex-row align-items-center  fw-normal fs-6 text-black rounded-pill px-2 ${styles.type}`}>
              {getCycleAccesLbl()}
               {showParticipants && (<div className={`ms-2 d-flex  flex-row`}><MdGroup className='text-black  d-flex align-items-start' style={{fontSize:'1.1em'}}/>
              <span className='text-black d-flex align-items-center' style={{fontSize:'.9em'}}>{`${participants?.length ||'...'}`}
            </span></div>)
          } 
            </Badge>
           <div className={`h-100 d-flex justify-content-center align-items-end`}>
              {renderJoinLeaveCycleBtn}
              
           </div> 
         </div>
                
      </Card.Body>    
       
        <Card.Footer className={`${styles.footer}  d-flex justifify-content-between`}>
             
          {showSocialInteraction && cycle && (
            <SocialInteraction
              cacheKey={cacheKey||['CYCLE',cycle.id.toString()]}
              showButtonLabels={showButtonLabels}
              showRating={false}
              showCounts
              entity={cycle}
              showTrash={showTrash}
              showCreateEureka={showCreateEureka}
              showSaveForLater={showSaveForLater}
              className="w-100"
            />
          )}
        </Card.Footer>
     </Card>
  );

  /*
  <Card className={`mosaic ${isActive() ? 'my-1 isActive' : ''} ${className}`} data-cy={`mosaic-item-cycle-${cycle.id}`} >
      <div
        className={`${linkToCycle ? 'cursor-pointer' : ''} ${styles.imageContainer} ${
          detailed && styles.detailedImageContainer
        }`}
      >
        {renderLocalImageComponent()}
        {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
        <Badge bg="primary" className={`fw-normal fs-6 text-black rounded-pill px-2 ${styles.type}`}>
          {getCycleAccesLbl()}
        </Badge>
      </div>

      <div className={`${styles.details}`}>
        {detailed && !showParticipants && (
        <div className={`d-flex flex-column align-items-center justify-content-center ${styles.detailedInfo}`}>
          <h6 className={`d-flex align-items-center text-center cursor-pointer ${styles.title}`}>
            {linkToCycle ? (
              <Link href={`/cycle/${cycle.id}`}>
                <a>{cycle.title}</a>
              </Link>
            ) : (
              <span>{cycle.title}</span>
            )}{' '}
          </h6>
        </div>
      )}
      <div className={`text-center ${showParticipants ? 'mt-3' : ''} ${styles.joinButtonContainer}`}>
        {renderJoinLeaveCycleBtn}
      </div>
      {showParticipants && (<p className={`${styles.title} mt-3 fs-6 text-center text-gray my-2`}>
        {`${t('Participants')}: ${participants!.length ||'...'}`}
        </p>)
      } 
      </div>
      {showSocialInteraction && (
        <Card.Footer className={styles.footer}>
          {cycle && (
            <SocialInteraction
              cacheKey={cacheKey||['CYCLE',cycle.id.toString()]}
              showButtonLabels={showButtonLabels}
              showCounts
              entity={cycle}
              showTrash={showTrash}
            />
          )}
        </Card.Footer>
      )}
    </Card>
  */
  // <article className={styles.cycle}>
  //   <Link href={`/cycle/${id}`}>
  //     <a className="d-inline-block">
  //       <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />

  //       <div className={styles.gradient} />
  //       <div className={styles.embeddedInfo}>
  //         <h3 className={styles.title}>{title}</h3>
  //         <span className={styles.date}>
  //           {sd.format(DATE_FORMAT_SHORT)}
  //           &mdash; {ed.format(DATE_FORMAT_SHORT)}
  //         </span>
  //       </div>
  //       <span className={styles.type}>{t('cycle')}</span>
  //     </a>
  //   </Link>
  // </article>
};

export default NewMosaicItem;
