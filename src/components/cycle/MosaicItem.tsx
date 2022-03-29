import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, MouseEvent } from 'react';
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
  const [session] = useSession() as [Session | null | undefined, boolean];
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
          queryClient.invalidateQueries(cacheKey);
          queryClient.invalidateQueries(ck)
        }
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
          queryClient.invalidateQueries(cacheKey);
          queryClient.invalidateQueries(ck)
        }
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
      <LocalImageComponent  className='cycleImage' filePath={cycle?.localImages[0].storedFile} alt={cycle?.title} />
      {detailed && (cycle && cycle.creator && cycle.startDate && cycle.endDate ) && (<div className={`d-flex flex-row align-items-baseline ${styles.date}`}>
                         <Avatar userId={cycle.creator.id} showName={false} size="xs" />
                          <div className='fs-6 ms-2 mt-1' >
                          {dayjs(cycle?.startDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
                          &mdash; {dayjs(cycle?.endDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
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
        {/* {(isJoinCycleLoading || isLeaveCycleLoading) && <Spinner animation="grow" size="sm" />} */}
        {/* !(isJoinCycleLoading || isLeaveCycleLoading) &&  */isCurrentUserJoinedToCycle && user && (user.id !== cycle!.creatorId) ? (
          <Button 
          disabled={(isJoinCycleLoading || isLeaveCycleLoading || isFetchingParticipants!==0)}
          onClick={handleLeaveCycleClick} variant="button border-primary text-primary fs-6" className="w-75">
            {t('leaveCycleLabel')}
          </Button>
        ) : (
          // showJoinButtonCycle() && (
            <Button 
            disabled={(isJoinCycleLoading || isLeaveCycleLoading || isFetchingParticipants!==0)}
            onClick={handleJoinCycleClick} className="w-75 text-white">
              {t('joinCycleLabel')}
            </Button>
          // )
        )}
        {(user?.id === cycle!.creatorId) && (<Button  variant="button border-warning text-warning fs-6 disabled" className="w-75">
            {t('MyCycle')}
          </Button>) }
      </div>
      {showParticipants && (<p className={`${styles.title} mt-3 fs-6 text-center text-gray my-2`}>
        {`${t('Participants')}: ${countParticipants||'...'}`}
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
