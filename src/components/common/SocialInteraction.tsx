import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill, BsEye, BsEyeFill } from 'react-icons/bs';
import classnames from 'classnames';
import { FiShare2, FiStar } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';
import { useAtom } from 'jotai';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Cycle, User, Work } from '@prisma/client';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { useUsers } from '../../useUsers';
import globalModalsAtom from '../../atoms/globalModals';
// import Notification from '../ui/Notification';

import { WEBAPP_URL } from '../../constants';
import { CycleDetail } from '../../types/cycle';
import { PostDetail } from '../../types/post';
import { WorkDetail } from '../../types/work';
import { MySocialInfo, isCycle, isWork, Session } from '../../types';
import styles from './SocialInteraction.module.css';

interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'like' | 'readOrWatched';
  doCreate: boolean;
}

interface Props {
  entity: CycleDetail | PostDetail | WorkDetail | User;
  parent?: CycleDetail | WorkDetail | null;
  // mySocialInfo: MySocialInfo;
  showCounts?: boolean;
  showShare?: boolean;
  showButtonLabels?: boolean;
}

const SocialInteraction: FunctionComponent<Props> = ({
  entity,
  parent /* ,  mySocialInfo */,
  showShare = false,
  showCounts = false,
  showButtonLabels = true,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];

  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [mySocialInfo, setMySocialInfo] = useState<MySocialInfo>();

  const [optimistLike, setOptimistLike] = useState<boolean | null>();
  const [optimistFav, setOptimistFav] = useState<boolean | null>();
  const [optimistReadOrWatched, setOptimistReadOrWatched] = useState<boolean | null>();

  const [optimistLikeCount, setOptimistLikeCount] = useState<number>(0);
  const [optimistFavCount, setOptimistFavCount] = useState<number>(0);
  const [optimistReadOrWatchedCount, setOptimistReadOrWatchedCount] = useState<number>(0);
  const queryClient = useQueryClient();

  const [idSession, setIdSession] = useState<string>('');
  const { /* isLoading, isError, error, */ data: user } = useUsers((session as unknown as Session).user.id.toString());
  // const [user, setuser] = useState<UserDetail>();

  useEffect(() => {
    /* const s = session as unknown as Session;
    if (s) setIdSession(s.user.id.toString()); */
    // if (datauser) setuser(() => datauser);
    if (user && entity) {
      if (isWork(entity)) {
        // if (entity.id === 125) debugger;
        let idx = user.readOrWatchedWorks.findIndex((i: Work) => i.id === entity.id);
        const readOrWatchedByMe = idx !== -1;
        setOptimistReadOrWatched(readOrWatchedByMe);
        setOptimistReadOrWatchedCount(entity.readOrWatcheds.length);

        idx = user.likedWorks.findIndex((i: Work) => i.id === entity.id);
        const likedByMe = idx !== -1;
        setOptimistLike(likedByMe);
        setOptimistLikeCount(entity.likes.length);

        idx = user.favWorks.findIndex((i: Work) => i.id === entity.id);
        const favoritedByMe = idx !== -1;
        setOptimistFav(favoritedByMe);
        setOptimistFavCount(entity.favs.length);

        setMySocialInfo({ likedByMe, favoritedByMe, readOrWatchedByMe });
      } else if (isCycle(entity)) {
        setOptimistReadOrWatchedCount(0);

        let idx = user.likedCycles.findIndex((i: Cycle) => i.id === entity.id);
        const likedByMe = idx !== -1;
        setOptimistLike(likedByMe);
        setOptimistLikeCount(entity.likes.length);

        idx = user.favCycles.findIndex((i: Cycle) => i.id === entity.id);
        const favoritedByMe = idx !== -1;
        setOptimistFav(favoritedByMe);
        setOptimistFavCount(entity.favs.length);

        setMySocialInfo({ likedByMe, favoritedByMe });
        setOptimistReadOrWatchedCount(0);
      }
    }
  }, [user, entity]);

  /* useEffect(() => {
    if (entity && isWork(entity) && user) {
      // if (entity.id === 125) debugger;
      setOptimistReadOrWatchedCount(entity.readOrWatcheds.length);

      let idx = entity.likes.findIndex((i) => i.id === user!.id);
      const likedByMe = idx !== -1;
      setOptimistLike(likedByMe);
      setOptimistLikeCount(entity.likes.length);

      idx = entity.favs.findIndex((i) => i.id === user!.id);
      const favoritedByMe = idx !== -1;
      setOptimistFav(favoritedByMe);
      setOptimistFavCount(entity.favs.length);

      // idx = entity.readOrWatcheds.findIndex((i) => i.id === user!.id);
      // const readOrWatchedByMe = idx !== -1;
      // setOptimistReadOrWatched(readOrWatchedByMe);
      // setMySocialInfo({ likedByMe, favoritedByMe, readOrWatchedByMe });
      setOptimistReadOrWatchedCount(entity.readOrWatcheds.length);
    } else if (entity && isCycle(entity) && user) {
      setOptimistReadOrWatchedCount(0);

      let idx = entity.likes.findIndex((i) => i.id === user!.id);
      const likedByMe = idx !== -1;
      setOptimistLike(likedByMe);
      setOptimistLikeCount(entity.likes.length);

      idx = entity.favs.findIndex((i) => i.id === user!.id);
      const favoritedByMe = idx !== -1;
      setOptimistFav(favoritedByMe);
      setOptimistFavCount(entity.favs.length);

      setMySocialInfo({ likedByMe, favoritedByMe });
      setOptimistReadOrWatchedCount(0);
    }
  }, [entity, user]);
 */
  /* useEffect(() => {
    debugger;
    if (datauser) {
      setuser(() => datauser);

      const idx = datauser.readOrWatchedWorks.findIndex((i) => i.id === entity.id);
      const readOrWatchedByMe = idx !== -1;
      setOptimistReadOrWatched(readOrWatchedByMe);
      setMySocialInfo({
        ...mySocialInfo,
        readOrWatchedByMe,
      });
    }
  }, [datauser]);
 */
  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const likeInc = () => {
    if (!optimistLike) {
      return 1;
    }
    return optimistLikeCount ? -1 : 0;
  };

  const favInc = () => {
    if (!optimistFav) {
      return 1;
    }
    return optimistFavCount ? -1 : 0;
  };

  const readOrWatchedInc = () => {
    if (!optimistReadOrWatched) {
      return 1;
    }
    return optimistReadOrWatchedCount ? -1 : 0;
  };

  const shareUrl = `${WEBAPP_URL}${router.asPath}`;
  const shareTextDynamicPart = (() => {
    if (parent != null && isCycle(parent)) {
      return t('postCycleShare');
    }
    if (parent != null && isWork(parent)) {
      return t('postWorkShare');
    }
    if (isCycle(entity)) {
      return t('cycleShare');
    }
    if (isWork(entity)) {
      return t('workShare');
    }

    throw new Error('Invalid entity or parent');
  })();
  const title = () => {
    if ('title' in entity) return entity.title;
    return entity.name; // an user;
  };

  const shareText = `${shareTextDynamicPart} "${title()}" ${t('complementShare')}`;

  const { mutate: execSocialInteraction, isSuccess: isSocialInteractionSuccess } = useMutation(
    async ({ socialInteraction, doCreate }: SocialInteractionClientPayload) => {
      const entityEndpoint = (() => {
        if (parent != null) {
          return 'post';
        }
        if (isCycle(entity)) {
          return 'cycle';
        }
        if (isWork(entity)) {
          return 'work';
        }

        throw new Error('Unknown entity');
      })();

      if (session) {
        const res = await (
          await fetch(`/api/${entityEndpoint}/${entity.id}/${socialInteraction}`, {
            method: doCreate ? 'POST' : 'DELETE',
          })
        ).json();
        return res;
      }
      openSignInModal();
      return null;
    },
    {
      onMutate: (payload) => {
        if (payload.socialInteraction === 'like') {
          const ol = optimistLike;
          setOptimistLike(!optimistLike);
          const olc = optimistLikeCount;
          setOptimistLikeCount(optimistLikeCount + likeInc());

          if (isWork(entity)) {
            let likedWorks;
            if (ol) {
              likedWorks = user?.likedWorks.filter((i: Work) => i.id !== entity.id);
            } else {
              user?.likedWorks.push(entity);
              likedWorks = user?.likedWorks;
            }
            queryClient.setQueryData(['USERS', user!.id], { ...user, likedWorks });
          } else if (isCycle(entity)) {
            let likedCycles;
            if (ol) {
              likedCycles = user?.likedCycles.filter((i: Cycle) => i.id !== entity.id);
            } else {
              user?.likedCycles.push(entity);
              likedCycles = user?.likedCycles;
            }
            queryClient.setQueryData(['USERS', user!.id], { ...user, likedCycles });
          }
          return { optimistLike: ol, optimistLikeCount: olc };
        }
        if (isWork(entity) && payload.socialInteraction === 'readOrWatched') {
          const ol = optimistReadOrWatched;
          setOptimistReadOrWatched(!optimistReadOrWatched);
          const olc = optimistReadOrWatchedCount;
          setOptimistReadOrWatchedCount(optimistReadOrWatchedCount! + readOrWatchedInc());

          let readOrWatchedWorks;
          if (ol) {
            readOrWatchedWorks = user?.readOrWatchedWorks.filter((i: Cycle) => i.id !== entity.id);
          } else {
            user?.readOrWatchedWorks.push(entity);
            readOrWatchedWorks = user?.readOrWatchedWorks;
          }
          queryClient.setQueryData(['USERS', `${user!.id}`], { ...user, readOrWatchedWorks });
          return { optimistreadOrWatched: ol, optimistreadOrWatchedCount: olc };
        }
        if (payload.socialInteraction === 'fav') {
          const opfc = optimistFavCount;
          const opf = optimistFav;
          setOptimistFav(!optimistFav);
          setOptimistFavCount(optimistFavCount + favInc());
          let favWorks;
          if (isWork(entity)) {
            if (opf) favWorks = user?.favWorks.filter((i: Cycle) => i.id !== entity.id);
            else {
              user?.favWorks.push(entity);
              favWorks = user?.favWorks;
            }
            queryClient.setQueryData(['USERS', `${user!.id}`], { ...user, favWorks });
          }
          return { optimistFav: opf, optimistFavCount: opfc };
        }
        // const opf = optimistFav;
        // const opfc = optimistFavCount;
        // setOptimistFav(!optimistFav);
        // setOptimistFavCount(optimistFavCount + favInc());
        return {};
      },
      onSuccess: (data, variables) => {
        if (data.status !== 'OK') {
          if (variables.socialInteraction === 'like') {
            setOptimistLike(mySocialInfo!.likedByMe!);
            if ('likes' in entity) setOptimistLikeCount(entity.likes.length);
          } else if (isWork(entity) && variables.socialInteraction === 'readOrWatched') {
            setOptimistReadOrWatched(mySocialInfo!.readOrWatchedByMe!);
            setOptimistReadOrWatchedCount((entity as WorkDetail).readOrWatcheds.length);
          }
          setOptimistFav(mySocialInfo!.likedByMe!);
          if ('favs' in entity) setOptimistFavCount(entity.favs.length);
        }
        queryClient.invalidateQueries(['USERS', `${user!.id}`]);
      },
    },
  );

  const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'fav', doCreate: mySocialInfo ? !mySocialInfo!.favoritedByMe : true });
  };

  const handleLikeClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'like', doCreate: mySocialInfo ? !mySocialInfo!.likedByMe : true });
  };

  const handleReadOrWatchedClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({
      socialInteraction: 'readOrWatched',
      doCreate: mySocialInfo ? !mySocialInfo!.readOrWatchedByMe : true,
    });
  };

  useEffect(() => {
    // if (!isSocialInteractionSuccess) {
    //   if (optimistLikeCount && optimistLikeCount > entity.likes.length)
    //     setOptimistLikeCount(entity.likes.length - 1);
    //   if (optimistLikeCount && optimistLikeCount < entity.likes.length)
    //     setOptimistLikeCount(entity.likes.length + 1);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocialInteractionSuccess, optimistLike]);

  useEffect(() => {
    // if (!isSocialInteractionSuccess) {
    //   if (optimistFavCount && optimistFavCount > entity.favs.length)
    //     setOptimistFavCount(entity.favs.length - 1);
    //   if (optimistFavCount && optimistFavCount < entity.favs.length)
    //     setOptimistFavCount(entity.favs.length + 1);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocialInteractionSuccess, optimistFav]);

  // useEffect(() => {
  //   if (isSocialInteractionSuccess) {
  //     router.replace(router.asPath); // refresh page
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSocialInteractionSuccess]);
  const popoverShares = (
    <Popover id="popover-basic">
      <Popover.Content>
        <TwitterShareButton url={shareUrl} title={shareText} via="eleurekaclub">
          <TwitterIcon size={32} round />
          {` ${t('wayShare')} Twitter`}
        </TwitterShareButton>
        <br />
        <FacebookShareButton url={shareUrl} quote={shareText}>
          <FacebookIcon size={32} round />
          {` ${t('wayShare')} Facebook`}
        </FacebookShareButton>
        <br />
        <WhatsappShareButton url={shareUrl} title={`${shareText} ${t('whatsappComplement')}`}>
          <WhatsappIcon size={32} round />
          {` ${t('wayShare')} Whatsapp`}
        </WhatsappShareButton>
      </Popover.Content>
    </Popover>
  );
  return (
    (session && (
      <div className={styles.container}>
        {isWork(entity) && (
          <button
            className={styles.socialBtn}
            title={t('Read / watched')}
            onClick={handleReadOrWatchedClick}
            type="button"
          >
            {optimistReadOrWatched ? <BsEyeFill className={styles.active} /> : <BsEye />}
            {showCounts && optimistReadOrWatchedCount}
            {showButtonLabels && (
              <span className={classnames(...[styles.info, ...[optimistReadOrWatched ? styles.active : '']])}>
                {t('Read / watched')}
              </span>
            )}
          </button>
        )}
        <button className={styles.socialBtn} title={t('I learned')} onClick={handleLikeClick} type="button">
          {optimistLike /* mySocialInfo.likedByMe */ ? <GiBrain className={styles.active} /> : <GiBrain />}
          {showCounts && optimistLikeCount}
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[optimistLike ? styles.active : '']])}>
              {t('I learned')}!
            </span>
          )}
        </button>

        {/* {isWork(entity) && (
          <button className={styles.socialBtn} title={t('Rating Eureka')} type="button">
            <FiStar className={styles.active} />
            {optimistReadOrWatchedCount! ? (optimistLikeCount / optimistReadOrWatchedCount!) * 100 : 0}%
            {showButtonLabels && (
              <span className={classnames(...[styles.info, styles.active])}>{t('Rating Eureka')}*</span>
            )}
          </button>
        )} */}
        <button className={styles.socialBtn} title={t('Save for later')} onClick={handleFavClick} type="button">
          {optimistFav /* mySocialInfo.favoritedByMe */ ? <BsBookmarkFill className={styles.active} /> : <BsBookmark />}
          {/* {showCounts && optimistFavCount} */}
          <br />
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[optimistFav ? styles.active : '']])}>
              {t('Save for later')}
            </span>
          )}
        </button>

        {showShare && (
          <OverlayTrigger trigger="click" placement="right" overlay={popoverShares}>
            <Button variant="link" className={styles.socialBtn}>
              <FiShare2 className={styles.active} />
              <br />
              {showButtonLabels && <span className={classnames(styles.info, styles.active)}>{t('Share')}</span>}
            </Button>
          </OverlayTrigger>
        )}

        {/* {showShare && (
          <Dropdown>
            <Dropdown.Toggle id="langSwitch" className={styles['toggle-share']}>
              <FiShare2 className={styles.actions} />
              <br />
              <span className={classnames(...[styles.info, ...[optimistFav ? styles.active : '']])}>{` `}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles['icon-share']}>
              <Dropdown.Item>
                <TwitterShareButton url={shareUrl} title={shareText} via="eleurekaclub">
                  <TwitterIcon size={32} round />
                  {`${t('wayShare')} Twitter`}
                </TwitterShareButton>
              </Dropdown.Item>
              <Dropdown.Item>
                <FacebookShareButton url={shareUrl} quote={shareText}>
                  <FacebookIcon size={32} round />
                  {`${t('wayShare')} Facebook`}
                </FacebookShareButton>
              </Dropdown.Item>
              <Dropdown.Item>
                <WhatsappShareButton url={shareUrl} title={`${shareText} ${t('whatsappComplement')}`}>
                  <WhatsappIcon size={32} round />
                  {`${t('wayShare')} Whatsapp`}
                </WhatsappShareButton>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )} */}
      </div>
    )) ||
    null
  );
};

export default SocialInteraction;
