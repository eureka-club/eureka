import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import classNames from 'classnames';
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
}
const MosaicItem: FunctionComponent<Props> = ({
  cycle,
  showButtonLabels = false,
  showShare,
  detailed = false,
  showSocialInteraction = true,
  cacheKey = undefined,
  showTrash = false,
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
    if (user) {
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
    // isSuccess: isJoinCycleSuccess,
  } = useMutation(
    async () => {
      await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
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
    <Card className={classNames(styles.container, isActive ? 'isActive' : '')} border={isActive ? 'success' : ''}>
      <div className={`${styles.imageContainer} ${detailed && styles.detailedImageContainer}`}>
        <Link href={`/cycle/${id}`}>
          <a>
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>

        {isActive && <CgMediaLive className={styles.isActiveCircle} />}
        <span className={styles.type}>{t('cycle')}</span>
      </div>
      {detailed && (
        <div className={styles.detailedInfo}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.date}>
            {sd.format(DATE_FORMAT_SHORT)}
            &mdash; {ed.format(DATE_FORMAT_SHORT)}
          </div>

          <div className={styles.joinButtonContainer}>
            {(isJoinCycleLoading || isLeaveCycleLoading) && <Spinner animation="border" size="sm" />}
            {!(isJoinCycleLoading || isLeaveCycleLoading) && isCurrentUserJoinedToCycle && user ? (
              <Button onClick={handleLeaveCycleClick} variant="link">
                {t('leaveCycleLabel')}
              </Button>
            ) : (
              !(isJoinCycleLoading || isLeaveCycleLoading) &&
              !isCurrentUserJoinedToCycle && <Button onClick={handleJoinCycleClick}>{t('joinCycleLabel')}</Button>
            )}
          </div>

          <div className={styles.participantsInfo}>{`${participants} ${t('participants')}`}</div>
        </div>
      )}
      {showSocialInteraction && (
        <Card.Footer className={styles.footer}>
          {cycle && (
            <SocialInteraction
              cacheKey={cacheKey}
              showButtonLabels={showButtonLabels}
              showCounts
              showShare={showShare}
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
