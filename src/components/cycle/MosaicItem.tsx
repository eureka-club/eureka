import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, MouseEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { Card, Button, Spinner } from 'react-bootstrap';
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

import { useUsers } from '../../useUsers';
import { Session } from '../../types';
import SocialInteraction from '../common/SocialInteraction';

dayjs.extend(utc);
dayjs.extend(timezone);
interface Props {
  // workWithImages: WorkWithImages;
  cycle: CycleMosaicItem;
  showButtonLabels?: boolean;
  showShare?: boolean;
  detailed?: boolean;
  cacheKey?: string[];
  showSocialInteraction?: boolean;
  showTrash?: boolean;
  className?: string;
}
const MosaicItem: FunctionComponent<Props> = ({
  cycle,
  showButtonLabels = false,
  // showShare,
  detailed = false,
  showSocialInteraction = true,
  cacheKey = undefined,
  showTrash = false,
  className,
}) => {
  const { id, title, localImages, startDate, endDate } = cycle;
  const { t } = useTranslation('common');
  const sd = dayjs(startDate).add(1, 'day').tz(dayjs.tz.guess());
  const ed = dayjs(endDate).add(1, 'day').tz(dayjs.tz.guess());
  const isActive = dayjs().isBefore(ed);
  const [session] = useSession() as [Session | null | undefined, boolean];
  const { data: user } = useUsers({ id: (session && (session as unknown as Session).user.id)?.toString() || '' });
  const [isCurrentUserJoinedToCycle, setIsCurrentUserJoinedToCycle] = useState<boolean>(true);
  const [participants, setParticipants] = useState<number>(0);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (cycle) {
      setParticipants(cycle.participants.length);
    }
    if (session && user && user.joinedCycles) {
      if (!user.joinedCycles.length) setIsCurrentUserJoinedToCycle(false);
      else {
        const icujtc = user.joinedCycles.findIndex((c: CycleMosaicItem) => c.id === cycle.id) !== -1;
        setIsCurrentUserJoinedToCycle(icujtc);
      }
    }
  }, [user, cycle]);

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
      const res = await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
      const json = await res.json();
      if ('data' in json) {
        console.log(json.error);
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'success',
            title: t('Join Cycle request notification'),
            message: t(json.data),
          },
        });
      }
    },
    {
      onMutate: () => {
        //   if (user) {
        //     // debugger;
        //     user.joinedCycles.push(cycle);
        //     queryClient.setQueryData(['USERS', user.id.toString()], () => user);
        // setIsCurrentUserJoinedToCycle(true);
        // setParticipants(cycle.participants.length + 1);
        //   }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['USERS', user.id.toString()]);
        queryClient.invalidateQueries(cacheKey);
      },
    },
  );
  const {
    mutate: execLeaveCycle,
    isLoading: isLeaveCycleLoading,
    // isSuccess: isLeaveCycleSuccess,
  } = useMutation(
    async () => {
      await fetch(`/api/cycle/${cycle.id}/join`, { method: 'DELETE' });
    },
    {
      onMutate: () => {
        // if (user) {
        //   const idx = user.joinedCycles.findIndex((c: Cycle) => c.id === cycle.id);
        //   if (idx > -1) {
        //     user.joinedCycles.splice(idx, 1);
        //     queryClient.setQueryData(['USERS', user.id.toString()], () => user);
        // setIsCurrentUserJoinedToCycle(false);
        // setParticipants(cycle.participants.length - 1);
        //   }
        // }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['USERS', user.id.toString()]);
        queryClient.invalidateQueries(cacheKey);
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
      if (user.id === cycle.creatorId) return false;
    }
    return true;
  };

  const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) openSignInModal();
    execJoinCycle();
  };

  const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execLeaveCycle();
  };

  return (
    <Card className={`${isActive ? 'isActive' : ''} ${className}`}>
      <div className={`${styles.imageContainer} ${detailed && styles.detailedImageContainer}`}>
        <Link href={`/cycle/${id}`}>
          <a>
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>

        {isActive && <CgMediaLive className={`text-primary ${styles.isActiveCircle}`} />}
        <span className={styles.type}>{t('cycle')}</span>
      </div>
      {detailed && (
        <div className="text-center p-1">
          <h6 className={`cursor-pointer ${styles.title}`}>
            <Link href={`/cycle/${id}`}>
              <a>{title}</a>
            </Link>{' '}
          </h6>
          <div className={styles.date}>
            {sd.format(DATE_FORMAT_SHORT)}
            &mdash; {ed.format(DATE_FORMAT_SHORT)}
          </div>
        </div>
      )}
      <div className={`pt-1 text-center ${styles.joinButtonContainer}`}>
        {(isJoinCycleLoading || isLeaveCycleLoading) && <Spinner animation="border" size="sm" />}
        {!(isJoinCycleLoading || isLeaveCycleLoading) && isCurrentUserJoinedToCycle && user ? (
          <Button onClick={handleLeaveCycleClick} variant="link" className="w-75">
            {t('leaveCycleLabel')}
          </Button>
        ) : (
          showJoinButtonCycle() && (
            <Button onClick={handleJoinCycleClick} className="w-75">
              {t('joinCycleLabel')}
            </Button>
          )
        )}
      </div>

      <p className="fs-6 text-center text-gray my-2 fw-bold">{`${participants + 1} ${t('participants')}`}</p>
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
