import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, MouseEvent, useMemo } from 'react';
import { useMutation, useQueryClient,useIsFetching } from 'react-query';
import { useRouter } from 'next/router';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useSession } from 'next-auth/client';
import { CgMediaLive } from 'react-icons/cg';

import { useAtom } from 'jotai';
// import { Cycle } from '@prisma/client';
import { DATE_FORMAT_SHORT } from '../../constants';
import { CycleMosaicItem } from '../../types/cycle';
// import { UserDetail } from '../../types/user';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import globalModalsAtom from '../../atoms/globalModals';

import useUser from '@/src/useUser';
import useUsers from '@/src/useUsers'
import { Session } from '../../types';
import SocialInteraction from '../common/SocialInteraction';
import { useCycleContext } from '../../useCycleContext';
import {useNotificationContext} from '@/src/useNotificationProvider'
import { useToasts } from 'react-toast-notifications'
import useCycle from '@/src/useCycle'
import Avatar from '../common/UserAvatar';
import { UserMosaicItem } from '@/src/types/user';
import useCycleJoinRequests,{setCycleJoinRequests,removeCycleJoinRequest} from '@/src/useCycleJoinRequests'
// import { useMosaicContext } from '../../useMosaicContext';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
interface Props {
  // workWithImages: WorkWithImages;
  // cycle: CycleMosaicItem;
  cycleId:number;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showParticipants?: boolean;
  detailed?: boolean;
  cacheKey?: [string,string];
  showSocialInteraction?: boolean;
  showTrash?: boolean;
  className?: string;
}
const MosaicItem: FunctionComponent<Props> = ({
  showButtonLabels = false,
  // showShare,
  detailed = false,
  showSocialInteraction = true,
  showParticipants = false,
  cacheKey = undefined,
  showTrash = false,
  className,
  cycleId
}) => {
  const {notifier} = useNotificationContext();
  const { linkToCycle = true, currentUserIsParticipant } = useCycleContext();
  const [session,isLoadingSession] = useSession() as [Session | null | undefined, boolean];
  const [idSession,setIdSession] = useState<string>('')
  const { data: user } = useUser(+idSession,{ enabled: !!+idSession });
  const [isCurrentUserJoinedToCycle, setIsCurrentUserJoinedToCycle] = useState<boolean>(false);
  const [countParticipants,setCountParticipants] = useState<number>()
  
  const [loading, setLoading] = useState<boolean>(false);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToast } = useToasts()
  const {data:cycle} = useCycle(cycleId,{enabled:!!cycleId})
  
  const whereCycleParticipants = {
    OR:[
      {cycles: { some: { id: cycle?.id } }},//creator
      {joinedCycles: { some: { id: cycle?.id } }},//participants
    ], 
  };
  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants,
    {
      enabled:!!cycle?.id
    }
  )

  const isFetchingParticipants = useIsFetching(['USERS',JSON.stringify(whereCycleParticipants)])
  
  useEffect(() => {
    const s = session as unknown as Session;
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
  
  const isActive = () => cycle ? dayjs().isBetween(cycle.startDate, cycle.endDate, null, '[]') : false;


  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };
  const {
    mutate: execJoinCycle,
    isLoading: isJoinCycleLoading,
    data: mutationResponse,
    // isSuccess: isJoinCycleSuccess,
  } = useMutation(
    async () => {      
      let notificationMessage = `userJoinedCycle!|!${JSON.stringify({
        userName: user?.name,
        cycleTitle: cycle?.title,
      })}`;
      const notificationToUsers = (participants || []).map(p=>p.id);
      if(cycle?.creatorId) notificationToUsers.push(cycle?.creatorId);

      const res = await fetch(`/api/cycle/${cycle!.id}/join`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationMessage,
          notificationContextURL: `/cycle/${cycle!.id}?tabKey=participants`,
          notificationToUsers,
        }),
      });
      if (!res.ok) {
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'info',
            title: t('Join Cycle request notification'),
            message: t(res.statusText),
          },
        });
      }
      else if(res.ok){
        setCycleJoinRequests({userId:+idSession,cycleId:cycle!.id})
        const json = await res.json();
        if(notifier){
          notifier.notify({
            toUsers:notificationToUsers,
            data:{message:notificationMessage}
          });
        }
        if(cycle?.access == 2)
               addToast( t(json.message), {appearance: 'success', autoDismiss: true,})
      }

    },
    {
      onMutate: async () => {
        const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
        await queryClient.cancelQueries(ck);
        const ss = queryClient.getQueryData<UserMosaicItem[]>(ck)
        // setIsCurrentUserJoinedToCycle(true);
        // setCountParticipants(res=>res?res+1:undefined)
      
        //   if (user) {
        //     // debugger;
        //     user.joinedCycles.push(cycle);
        //     queryClient.setQueryData(['USER', user.id.toString()], () => user);
        // setIsCurrentUserJoinedToCycle(true);
        // setParticipants(cycle.participants.length + 1);
        //   }
        return {ss,ck}

      },
      onSettled(_data,error,_variable,context) {
        const {ck,ss} = context as {ss:UserMosaicItem[],ck:string[]}
        if(error){
          // setIsCurrentUserJoinedToCycle(false);
          // setCountParticipants(res=>res?res-1:undefined)
          queryClient.setQueryData(ck,ss)
        }
        if(user){
          queryClient.invalidateQueries(['USER', user.id.toString()]);
          queryClient.invalidateQueries(cacheKey||['CYCLE',cycle?.id.toString()]);
          queryClient.invalidateQueries(ck)
        }
        queryClient.invalidateQueries(['USER', +idSession, 'cycles-join-requests'])
      },
    },
  );
  const {
    mutate: execLeaveCycle,
    isLoading: isLeaveCycleLoading,
    // isSuccess: isLeaveCycleSuccess,
  } = useMutation(
    async () => {
      let notificationMessage = `userLeftCycle!|!${JSON.stringify({
        userName: user?.name,
        cycleTitle: cycle?.title,
      })}`;
      const notificationToUsers = (participants || []).filter(p=>p.id!==user?.id).map(p=>p.id);
      if(cycle?.creatorId) notificationToUsers.push(cycle?.creatorId);

      const res = await fetch(`/api/cycle/${cycle!.id}/join`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationMessage,
          notificationContextURL: `/cycle/${cycle!.id}?tabKey=participants`,
          notificationToUsers,
        })
      });
      if(!res.ok){
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'info',
            title: t('Join Cycle request notification'),
            message: t(res.statusText),
          },
        });        
      }
      else{
        await removeCycleJoinRequest(+idSession,cycle!.id)
        const json = await res.json();
        if(notifier){
          notifier.notify({
            toUsers:notificationToUsers,
            data:{message:notificationMessage}
          });
        }
      }
      
    },
    {
      onMutate: async () => {
        const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
        await queryClient.cancelQueries(ck);
        const ss = queryClient.getQueryData<UserMosaicItem[]>(ck)
        // setIsCurrentUserJoinedToCycle(false);
        // setCountParticipants(res=>res?res-1:undefined)
        //   if (user) {
        //     // debugger;
        //     user.joinedCycles.push(cycle);
        //     queryClient.setQueryData(['USER', user.id.toString()], () => user);
        // setIsCurrentUserJoinedToCycle(true);
        // setParticipants(cycle.participants.length + 1);
        //   }
        return {ss,ck}

      },
      onSettled(_data,error,_variable,context) {
        const {ck,ss} = context as {ss:UserMosaicItem[],ck:string[]}
        if(error){
          // setIsCurrentUserJoinedToCycle(true);
          // setCountParticipants(res=>res?res+1:undefined)
          queryClient.setQueryData(ck,ss)
        }
        if(user){
          queryClient.invalidateQueries(['USER', user.id.toString()]);
          queryClient.invalidateQueries(cacheKey||['CYCLE',cycle?.id.toString()]);
          queryClient.invalidateQueries(ck)
        }
        queryClient.invalidateQueries(['USER', +idSession, 'cycles-join-requests'])
      },
    },
  );

  useEffect(() => {
    if (mutationResponse) {
      setGlobalModalsState({
        ...globalModalsState,
        showToast: {
          show: true,
          type: 'success',
          title: t('Join Cycle request notification'),
          message: mutationResponse,
        },
      });
    }
  }, [mutationResponse]);

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
    if (!session) openSignInModal();
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
      ? <> 
      <LocalImageComponent  filePath={cycle?.localImages[0].storedFile} alt={cycle?.title} />
      {detailed && (cycle && cycle.creator && cycle.startDate && cycle.endDate ) && (<div className={`d-flex flex-row align-items-center ${styles.date}`}>
                         <Avatar width={28} height={28} userId={cycle.creator.id} showName={false} size="xs" />
                          <div className='fs-6 ms-2 mt-1' >
                          {dayjs(cycle?.startDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
                          <span className='ms-1 me-1'>-</span>
                          {dayjs(cycle?.endDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
                        </div>
                        </div>)}
      </>
      : undefined;
    if (linkToCycle) {
      return (
        <div
          className={`${styles.imageContainer} ${!loading ? 'cursor-pointer' : ''} mb-2`}
          onClick={onImgClick}
          role="presentation"
        >
          {!canNavigate() && <Spinner className="position-absolute top-50 start-50" animation="grow" variant="info" />}
          {img}
        </div>
      );
    }
    return img;
  };
  
  const renderJoinLeaveCycleBtn = ()=>{
    console.log(cycle && cycle?.id,new Date())
    if(cycle && !isLoadingSession){

      if(cycle.currentUserIsCreator)
        return <Button  variant="button border-warning text-warning fs-6 disabled" className="w-75">
        {t('MyCycle')}
      </Button>

      if(cycle.currentUserIsParticipant)
        return <Button 
          disabled={(isJoinCycleLoading || isLeaveCycleLoading)}
          onClick={handleLeaveCycleClick} variant="button border-primary text-primary fs-6" className="w-75">
            {t('leaveCycleLabel')}
          </Button>

      if(cycle.currentUserIsPending)
        return <Button 
            disabled={true}
            className="w-75 text-white">
              {t('joinCyclePending')}
            </Button>

      return <Button 
        disabled={(isJoinCycleLoading || isLeaveCycleLoading)}
        onClick={handleJoinCycleClick} className="w-75 text-white">
          {t('joinCycleLabel')}
        </Button>
      
    }
    return <Button 
          disabled={true}
          className="w-75 text-white">
            <Spinner size='sm' animation='grow'/>
          </Button>
  }

  if(!cycle)return <></>

  return (
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
        {detailed && (
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
          {/**/}
        </div>
      )}
      <div className={`text-center ${showParticipants ? 'mt-3' : ''} ${styles.joinButtonContainer}`}>
        {renderJoinLeaveCycleBtn()}
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
  );
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

export default MosaicItem;
