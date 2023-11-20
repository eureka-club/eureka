import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, MouseEvent } from 'react';
import { useIsFetching } from 'react-query';
import { useRouter } from 'next/router';
import { Card, Button, Spinner, Badge} from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { CgMediaLive } from 'react-icons/cg';
import { MdGroup } from 'react-icons/md';
import { DATE_FORMAT_SHORT } from '../../constants';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import useUser from '@/src/useUser';
import useUsers from '@/src/useUsers'
import SocialInteraction from '../common/SocialInteraction';
import { useCycleContext } from '../../useCycleContext';
import toast from 'react-hot-toast';
import useCycle from '@/src/useCycle'
import Avatar from '../common/UserAvatar';
// import useCycleJoinRequests,{setCycleJoinRequests,removeCycleJoinRequest} from '@/src/useCycleJoinRequests'
import {useJoinUserToCycleAction,useLeaveUserFromCycleAction} from '@/src/hooks/mutations/useCycleJoinOrLeaveActions'
import {useModalContext} from '@/src/useModal'
import SignInForm from '../forms/SignInForm';
import { CycleMosaicItem } from '@/src/types/cycle';
import { useCyclePrice } from '@/src/hooks/useCyclePrices';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
interface Props {
  cycle?:CycleMosaicItem;
  cycleId:number;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showParticipants?: boolean;
  detailed?: boolean;
  cacheKey?: [string,string];
  showSocialInteraction?: boolean;
  showCreateEureka?: boolean;
  showSaveForLater?: boolean;
  showJoinOrLeaveButton?:boolean;
  showTrash?: boolean;
  imageLink?: boolean;
  size?: string;
  className?: string;
}


const MosaicItem: FunctionComponent<Props> = ({
  cycle:cycleItem,
  showButtonLabels = false,
  detailed = true,
  showSocialInteraction = true,
  showParticipants = true,
  showCreateEureka,
  showSaveForLater,
  showJoinOrLeaveButton = true,
  cacheKey = undefined,
  showTrash = false,
  imageLink = false,
  size,
  className,
  cycleId
}) => {
  const { linkToCycle = true, currentUserIsParticipant } = useCycleContext();
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  const [idSession,setIdSession] = useState<string>('')
  const { data: user } = useUser(+idSession,{ enabled: !!+idSession });
  const [countParticipants,setCountParticipants] = useState<number>()
  
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {data} = useCycle(cycleId,{enabled:!!cycleId && !cycleItem})
  
  
  const [cycle,setCycle]=useState(cycleItem)
  useEffect(()=>{
    if(!cycleItem && data)setCycle(data)
  },[data])

  const {data:{price,currency}={currency:'',price:-1}} =  useCyclePrice(cycle);
  
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

  // const isFetchingParticipants = useIsFetching(['USERS',JSON.stringify(whereCycleParticipants)])
  
  useEffect(() => {
    const s = session;
    if (s) {
      setIdSession(s.user.id.toString());
    }
  }, [session]);
  
  useEffect(() => {
    if (cycle && user && participants) {
      setCountParticipants(participants.length);
      const idx = participants.findIndex(p=>p.id==user.id);
    }
  }, [user, cycle,participants, session]);

  
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
      if (cycle && ![2,4].includes(cycle?.access))
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
    if(!error) {
      toast.success(t('OK'));
      if(router.query.join)
        router.push(`/cycle/${cycle?.id}`);
    }
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
      show(<SignInForm joinToCycle={cycle?.id} />)
    }
    else execJoinCycle();
  };

  const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    
    if(cycle?.access==4){
      const res = confirm(t('abandoningPaidCycleWarning'));
      if(!res)return;
    }
    execLeaveCycle();
  };

  const getCycleAccesLbl = () => {
    if (cycle) {
      if (cycle.access === 1) return t('public');
      if (cycle.access === 2) return t('private');
      if (cycle.access === 3) return t('secret');
      if (cycle.access === 4) return t('payment');
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
      {detailed && (cycle && cycle.creatorId && cycle.startDate && cycle.endDate ) && (<div className={`d-flex flex-row justify-content-between  ${styles.date}`}>
                        <div  className={` d-flex flex-row aling-items-center fs-6`}>
                         <Avatar className='' width={26} height={26} userId={cycle.creatorId} showName={false} size="xs" />
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
          {!canNavigate() && <Spinner className="position-absolute top-50 start-50"  size="sm" animation="grow" variant="info" style={{zIndex:'1'}} />}
          {imageLink ? <a href={`/cycle/${cycle?.id}`}>{img}</a> : img}
        </div>
      );
    }
    return <div className={`mb-2`} role="presentation">{img}</div>;
     };


  
  const renderJoinLeaveCycleBtn = ()=>{
    if (cycle && !isLoadingSession ){

      if(cycle.creatorId == session?.user.id)
        return   <Button   variant="btn-warning border-warning bg-warning text-white fs-6 disabled"
         className={`rounded rounded-3  ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} size='sm'>
          <span className='fs-6'>{t('MyCycle')}</span> {/*MyCycle*/}
      </Button>

      if(cycle.participants.findIndex(p=>p.id==session?.user.id) > -1 )         
          return <Button  disabled={isPending()} onClick={handleLeaveCycleClick} variant="button border-primary bg-white text-primary" 
          className={`rounded rounded-3  ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} size='sm' >
           <span className='fs-6'>{t('common:leaveCycleLabel')}</span>
            </Button>

      if(cycle.usersJoined.findIndex(p=>p.userId==session?.user.id && p.pending) > -1)
         return  <Button 
            disabled={true}
            className={`rounded rounded-2 text-white ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} 
            size='sm' >
            <span className='fs-6'>{t('joinCyclePending')}</span>
            </Button>

          return  <Button 
            disabled={isPending()}
            onClick={handleJoinCycleClick} className={`rounded rounded-3 text-white ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} 
            size='sm'>
              <span className='fs-6'>{t('joinCycleLabel')}</span> 
              
              {cycle.access==4 && price!=-1
                ? <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
                : <></>
              }
            </Button>           
    }
    else
    return <Button 
          disabled={true}
          className={`rounded rounded-3  text-white ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`}>
            <Spinner size='sm' animation='grow'/>
          </Button>
  }

  if(!cycle)return <></>

  return (
     <Card className={`${size?.length ? `mosaic-${size}` : 'mosaic'} ${isActive() ? 'my-1 isActive' : ''} ${className}`} data-cy={`mosaic-item-cycle-${cycle.id}`} >
        <Card.Body>  
        <div className={`${linkToCycle ? 'cursor-pointer' : ''} ${styles.imageContainer}`} >
            {renderLocalImageComponent()}
            {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
            <Badge bg="primary" className={`d-flex flex-row align-items-center  fw-normal fs-6 text-white rounded-pill px-2 ${styles.type}`}>
              {getCycleAccesLbl()}
               {showParticipants && (<div className={`ms-2 d-flex  flex-row`}><MdGroup className='text-white  d-flex align-items-start' style={{fontSize:'1.1em'}}/>
              <span className='text-white d-flex align-items-center' style={{fontSize:'.9em'}}>{`${participants?.length ||'...'}`}
            </span></div>)
          } 
            </Badge>
           <div className={`h-100 d-flex justify-content-center align-items-end`}>
            {showJoinOrLeaveButton && !(cycle.participants.findIndex(p => p.id == session?.user.id) > -1 && cycle.access == 4) && renderJoinLeaveCycleBtn()}
           </div> 
         </div>
                
      </Card.Body>    
         {showSocialInteraction && cycle && (
        <Card.Footer className={`${styles.footer}  d-flex justifify-content-between`}>
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
         
        </Card.Footer>
         )}
     </Card>
  );
};

export default MosaicItem;
