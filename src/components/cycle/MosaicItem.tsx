import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, MouseEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
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
import { Session } from '@/src/types';
import SocialInteraction from '../common/SocialInteraction';
import { useCycleContext } from '../../useCycleContext';
import {useNotificationContext} from '@/src/useNotificationProvider'
// import { useMosaicContext } from '../../useMosaicContext';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
interface Props {
  // workWithImages: WorkWithImages;
  // cycle: CycleMosaicItem;
  showButtonLabels?: boolean;
  showShare?: boolean;
  detailed?: boolean;
  cacheKey?: string[];
  showSocialInteraction?: boolean;
  showTrash?: boolean;
  className?: string;
}
const MosaicItem: FunctionComponent<Props> = ({
  showButtonLabels = false,
  // showShare,
  detailed = false,
  showSocialInteraction = true,
  cacheKey = undefined,
  showTrash = false,
  className,
}) => {
  const {notifier} = useNotificationContext();
  const { cycle, linkToCycle = true, currentUserIsParticipant } = useCycleContext();
  const { id, title, localImages, startDate, endDate } = cycle!;
  const { t } = useTranslation('common');
  const sd = dayjs(startDate).add(1, 'day').tz(dayjs.tz.guess());
  const ed = dayjs(endDate).add(1, 'day').tz(dayjs.tz.guess());
  const isActive = dayjs().isBetween(startDate, endDate, null, '[]');
  
  const {data:sd2,status} = useSession();
  const [session, setSession] = useState<Session>(sd2 as Session);
  useEffect(()=>{
    if(sd2)
      setSession(sd2 as Session)
  },[sd2])

  
  const { data: user } = useUser(session?.user.id,{ enabled: !!session?.user.id });
  const [isCurrentUserJoinedToCycle, setIsCurrentUserJoinedToCycle] = useState<boolean>(true);
  const [participants, setParticipants] = useState<number>(0);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const queryClient = useQueryClient();
  const router = useRouter();


  useEffect(() => {
    if (cycle) {
      setParticipants(cycle.participants.length);
      if (currentUserIsParticipant === undefined) {
        if (session && user && user.joinedCycles) {
          if (!user.joinedCycles.length) setIsCurrentUserJoinedToCycle(false);
          else {
            const icujtc = user.joinedCycles.findIndex((c) => c.id === cycle!.id) !== -1;
            setIsCurrentUserJoinedToCycle(icujtc);
          }
        }
      } else setIsCurrentUserJoinedToCycle(!!currentUserIsParticipant);
    }
  }, [user, cycle, currentUserIsParticipant, session]);

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
      const notificationToUsers = (cycle?.participants || []).map(p=>p.id);
      if(cycle?.creatorId) notificationToUsers.push(cycle?.creatorId);

      const res = await fetch(`/api/cycle/${cycle!.id}/join`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationMessage,
          notificationContextURL: router.asPath,
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
      }

    },
    {
      onMutate: () => {
        //   if (user) {
        //     // debugger;
        //     user.joinedCycles.push(cycle);
        //     queryClient.setQueryData(['USER', user.id.toString()], () => user);
        // setIsCurrentUserJoinedToCycle(true);
        // setParticipants(cycle.participants.length + 1);
        //   }
      },
      onSuccess: () => {
        if(user){
          queryClient.invalidateQueries(['USER', user.id.toString()]);
          queryClient.invalidateQueries(cacheKey);

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
      const notificationToUsers = (cycle?.participants || []).filter(p=>p.id!==user?.id).map(p=>p.id);
      if(cycle?.creatorId) notificationToUsers.push(cycle?.creatorId);

      const res = await fetch(`/api/cycle/${cycle!.id}/join`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationMessage,
          notificationContextURL: router.asPath,
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
      onMutate: () => {
        // if (user) {
        //   const idx = user.joinedCycles.findIndex((c: Cycle) => c.id === cycle.id);
        //   if (idx > -1) {
        //     user.joinedCycles.splice(idx, 1);
        //     queryClient.setQueryData(['USER', user.id.toString()], () => user);
        // setIsCurrentUserJoinedToCycle(false);
        // setParticipants(cycle.participants.length - 1);
        //   }
        // }
      },
      onSuccess: () => {
        if(user){
          queryClient.invalidateQueries(['USER', user.id.toString()]);
          queryClient.invalidateQueries(cacheKey);
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

  return (
    <Card className={`mosaic ${isActive ? 'my-1 isActive' : ''} ${className}`} data-cy={`mosaic-item-cycle-${id}`} >
      <div
        className={`${linkToCycle ? 'cursor-pointer' : ''} ${styles.imageContainer} ${
          detailed && styles.detailedImageContainer
        }`}
      >
        {linkToCycle ? (
          <Link href={`/cycle/${id}`}>
            <a>
              <LocalImageComponent className="cursor-pointer" filePath={localImages[0].storedFile} alt={title} />
            </a>
          </Link>
        ) : (
          <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
        )}

        {isActive && <CgMediaLive className={`${styles.isActiveCircle}`} />}
        <Badge bg="primary" className={`fw-normal fs-6 text-black rounded-pill px-2 ${styles.type}`}>
          {getCycleAccesLbl()}
        </Badge>
      </div>
      {detailed && (
        <div className="text-center p-1">
          <h6 className={`cursor-pointer ${styles.title}`}>
            {linkToCycle ? (
              <Link href={`/cycle/${id}`}>
                <a>{title}</a>
              </Link>
            ) : (
              title
            )}{' '}
          </h6>
          <div className={styles.date}>
            {sd.format(DATE_FORMAT_SHORT)}
            &mdash; {ed.format(DATE_FORMAT_SHORT)}
          </div>
        </div>
      )}
      <div className={`pt-1 text-center ${styles.joinButtonContainer}`}>
        {(isJoinCycleLoading || isLeaveCycleLoading) && <Spinner animation="grow" size="sm" />}
        {!(isJoinCycleLoading || isLeaveCycleLoading) && isCurrentUserJoinedToCycle && user ? (
          <Button onClick={handleLeaveCycleClick} variant="button border-primary text-primary fs-6" className="w-75">
            {t('leaveCycleLabel')}
          </Button>
        ) : (
          showJoinButtonCycle() && (
            <Button onClick={handleJoinCycleClick} className="w-75 text-white">
              {t('joinCycleLabel')}
            </Button>
          )
        )}
      </div>

      <p className="fs-6 text-center text-gray my-2">{`${participants + 1} ${t('participants')}`}</p>
      {showSocialInteraction && (
        <Card.Footer className={styles.footer}>
          {cycle && (
            <SocialInteraction
              cacheKey={cacheKey}
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
