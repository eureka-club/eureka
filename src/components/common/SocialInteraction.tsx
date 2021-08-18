import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill, BsEye, BsEyeFill } from 'react-icons/bs';
import classnames from 'classnames';
import { FiShare2, FiStar, FiTrash2 } from 'react-icons/fi';
import { IoMdStarOutline, IoMdStar, IoMdStarHalf } from 'react-icons/io';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';
import { useAtom } from 'jotai';
import Rating from 'react-rating';
import { Container, OverlayTrigger, Popover, Button } from 'react-bootstrap';

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Cycle, User, Work, Post, RatingOnCycle, RatingOnWork } from '@prisma/client';

import { useUsers } from '../../useUsers';
import globalModalsAtom from '../../atoms/globalModals';
// import Notification from '../ui/Notification';

import { WEBAPP_URL } from '../../constants';
import { CycleDetail } from '../../types/cycle';
import { PostDetail } from '../../types/post';
import { WorkDetail } from '../../types/work';
import { MySocialInfo, isCycle, isWork, Session, isPost } from '../../types';
import styles from './SocialInteraction.module.css';

interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'rating';
  doCreate: boolean;
  ratingQty?: number;
}

interface Props {
  entity: CycleDetail | PostDetail | WorkDetail | User;
  parent?: CycleDetail | WorkDetail | null;
  // mySocialInfo: MySocialInfo;
  showCounts?: boolean;
  showShare?: boolean;
  showButtonLabels?: boolean;
  cacheKey?: string[];
  showTrash?: boolean;
}

const SocialInteraction: FunctionComponent<Props> = ({
  entity,
  parent /* ,  mySocialInfo */,
  showShare = false,
  showCounts = false,
  showButtonLabels = true,
  cacheKey = '',
  showTrash = false,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const [qty, setQty] = useState<number>(0);

  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [mySocialInfo, setMySocialInfo] = useState<MySocialInfo>();

  // const [optimistLike, setOptimistLike] = useState<boolean | null>();
  const [optimistFav, setOptimistFav] = useState<boolean | null>();
  // const [optimistReadOrWatched, setOptimistReadOrWatched] = useState<boolean | null>();

  // const [optimistLikeCount, setOptimistLikeCount] = useState<number>(0);
  const [optimistFavCount, setOptimistFavCount] = useState<number>(0);
  // const [optimistReadOrWatchedCount, setOptimistReadOrWatchedCount] = useState<number>(0);
  const queryClient = useQueryClient();

  const [idSession, setIdSession] = useState<string>('');
  const { /* isLoading, isError, error, */ data: user } = useUsers(idSession);
  // const [user, setuser] = useState<UserDetail>();

  const calculateQty = () => {
    if (entity && (isWork(entity) || isCycle(entity))) {
      let qtySum = 0;
      entity.ratings.forEach((rating) => {
        qtySum += rating.qty;
      });
      qtySum /= entity.ratings.length;
      setQty(() => qtySum);
    }
  };

  useEffect(() => {
    const s = session as unknown as Session;
    if (s) setIdSession(s.user.id.toString());
    // if (datauser) setuser(() => datauser);

    calculateQty();

    let ratingByMe = false;
    if (user && entity) {
      if (isWork(entity)) {
        // if (entity.id === 125) debugger;
        // let idx = user.readOrWatchedWorks.findIndex((i: Work) => i.id === entity.id);
        // const readOrWatchedByMe = idx !== -1;
        // setOptimistReadOrWatched(readOrWatchedByMe);
        // setOptimistReadOrWatchedCount(entity.readOrWatcheds.length);

        let idx = user.favWorks.findIndex((i: Work) => i.id === entity.id);
        const favoritedByMe = idx !== -1;
        setOptimistFav(favoritedByMe);
        setOptimistFavCount(entity.favs.length);

        idx = user.ratingWorks.findIndex((i: { workId: number; qty: number }) => i.workId === entity.id);
        if (idx !== -1) {
          ratingByMe = true;
        }

        setMySocialInfo({ favoritedByMe, ratingByMe });
      } else if (isCycle(entity)) {
        // setOptimistReadOrWatchedCount(0);

        // let idx = user.likedCycles.findIndex((i: Cycle) => i.id === entity.id);
        // const likedByMe = idx !== -1;
        // setOptimistLike(likedByMe);
        // setOptimistLikeCount(entity.likes.length);

        let idx = user.favCycles.findIndex((i: Cycle) => i.id === entity.id);
        const favoritedByMe = idx !== -1;
        setOptimistFav(favoritedByMe);
        setOptimistFavCount(entity.favs.length);

        idx = user.ratingCycles.findIndex((i: { cycleId: number; qty: number }) => i.cycleId === entity.id);
        if (idx !== -1) {
          ratingByMe = true;
        }

        setMySocialInfo({ favoritedByMe, ratingByMe });
      } else if (isPost(entity)) {
        // setOptimistReadOrWatchedCount(0);

        const idx = user.favPosts.findIndex((i: Post) => i.id === entity.id);
        const favoritedByMe = idx !== -1;
        setOptimistFav(favoritedByMe);
        setOptimistFavCount(entity.favs.length);

        setMySocialInfo({ favoritedByMe });
      }
    }
  }, [user, entity, session]);

  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  // const likeInc = () => {
  //   if (!optimistLike) {
  //     return 1;
  //   }
  //   return optimistLikeCount ? -1 : 0;
  // };

  const favInc = () => {
    if (!optimistFav) {
      return 1;
    }
    return optimistFavCount ? -1 : 0;
  };

  // const readOrWatchedInc = () => {
  //   if (!optimistReadOrWatched) {
  //     return 1;
  //   }
  //   return optimistReadOrWatchedCount ? -1 : 0;
  // };

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
    async ({ socialInteraction, doCreate, ratingQty }: SocialInteractionClientPayload) => {
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
        const res = await fetch(`/api/${entityEndpoint}/${entity.id}/${socialInteraction}`, {
          method: doCreate ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qty: ratingQty,
          }),
        });
        return res.json();
      }
      // calculateQty();
      openSignInModal();
      return null;
    },
    {
      onMutate: (payload) => {
        // if (payload.socialInteraction === 'like') {
        //   const ol = optimistLike;
        //   setOptimistLike(!optimistLike);
        //   const olc = optimistLikeCount;
        //   setOptimistLikeCount(optimistLikeCount + likeInc());

        //   if (isWork(entity)) {
        //     let likedWorks;
        //     if (ol) {
        //       likedWorks = user?.likedWorks.filter((i: Work) => i.id !== entity.id);
        //     } else {
        //       user?.likedWorks.push(entity);
        //       likedWorks = user?.likedWorks;
        //     }
        //     queryClient.setQueryData(['USERS', `${idSession}`], { ...user, likedWorks });
        //   } else if (isCycle(entity)) {
        //     let likedCycles;
        //     if (ol) {
        //       likedCycles = user?.likedCycles.filter((i: Cycle) => i.id !== entity.id);
        //     } else {
        //       user?.likedCycles.push(entity);
        //       likedCycles = user?.likedCycles;
        //     }
        //     queryClient.setQueryData(['USERS', `${idSession}`], { ...user, likedCycles });
        //   }
        //   return { optimistLike: ol, optimistLikeCount: olc };
        // }
        // if (isWork(entity) && payload.socialInteraction === 'readOrWatched') {
        //   const ol = optimistReadOrWatched;
        //   setOptimistReadOrWatched(!optimistReadOrWatched);
        //   const olc = optimistReadOrWatchedCount;
        //   setOptimistReadOrWatchedCount(optimistReadOrWatchedCount! + readOrWatchedInc());

        //   let readOrWatchedWorks;
        //   if (ol) {
        //     readOrWatchedWorks = user?.readOrWatchedWorks.filter((i: Cycle) => i.id !== entity.id);
        //   } else {
        //     user?.readOrWatchedWorks.push(entity);
        //     readOrWatchedWorks = user?.readOrWatchedWorks;
        //   }
        //   queryClient.setQueryData(['USERS', `${idSession}`], { ...user, readOrWatchedWorks });
        //   return { optimistreadOrWatched: ol, optimistreadOrWatchedCount: olc };
        // }
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
            queryClient.setQueryData(['USERS', `${idSession}`], { ...user, favWorks });
          } else if (isCycle(entity)) {
            let favCycles;
            if (opf) favCycles = user?.favCycles.filter((i: Cycle) => i.id !== entity.id);
            else {
              user?.favCycles.push(entity);
              favCycles = user?.favCycles;
            }
            queryClient.setQueryData(['USERS', `${idSession}`], { ...user, favCycles });
          } else if (isPost(entity)) {
            let favPosts;
            if (opf) favPosts = user?.favPosts.filter((i: Cycle) => i.id !== entity.id);
            else {
              user?.favPosts.push(entity);
              favPosts = user?.favPosts;
            }
            queryClient.setQueryData(['USERS', `${idSession}`], { ...user, favPosts });
          }
          return { optimistFav: opf, optimistFavCount: opfc };
        }
        // const opf = optimistFav;
        // const opfc = optimistFavCount;
        // setOptimistFav(!optimistFav);
        // setOptimistFavCount(optimistFavCount + favInc());
        return {};
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['USERS', `${idSession}`]);
        if (!cacheKey) router.replace(router.asPath);
        else if (queryClient.getQueryData(cacheKey)) queryClient.invalidateQueries(cacheKey);
        else router.replace(router.asPath);
      },
    },
  );

  const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'fav', doCreate: mySocialInfo ? !mySocialInfo!.favoritedByMe : true });
  };

  // const handleLikeClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   execSocialInteraction({ socialInteraction: 'like', doCreate: mySocialInfo ? !mySocialInfo!.likedByMe : true });
  // };

  // const handleReadOrWatchedClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   execSocialInteraction({
  //     socialInteraction: 'readOrWatched',
  //     doCreate: mySocialInfo ? !mySocialInfo!.readOrWatchedByMe : true,
  //   });
  // };

  // useEffect(() => {
  //   // if (!isSocialInteractionSuccess) {
  //   //   if (optimistLikeCount && optimistLikeCount > entity.likes.length)
  //   //     setOptimistLikeCount(entity.likes.length - 1);
  //   //   if (optimistLikeCount && optimistLikeCount < entity.likes.length)
  //   //     setOptimistLikeCount(entity.likes.length + 1);
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSocialInteractionSuccess, optimistLike]);

  // useEffect(() => {
  //   // if (!isSocialInteractionSuccess) {
  //   //   if (optimistFavCount && optimistFavCount > entity.favs.length)
  //   //     setOptimistFavCount(entity.favs.length - 1);
  //   //   if (optimistFavCount && optimistFavCount < entity.favs.length)
  //   //     setOptimistFavCount(entity.favs.length + 1);
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSocialInteractionSuccess, optimistFav]);

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

  const clearRating = () => {
    setQty(0);
    execSocialInteraction({
      socialInteraction: 'rating',
      ratingQty: 0,
      doCreate: false,
    });
  };

  const handlerChangeRating = (value: number) => {
    setQty(value);
    execSocialInteraction({
      socialInteraction: 'rating',
      ratingQty: value,
      doCreate: true,
    });
  };

  const getFullSymbol = () => {
    if (session) {
      if (user && mySocialInfo) {
        if (mySocialInfo.ratingByMe) return <GiBrain style={{ color: 'var(--eureka-green)' }} />;
        return <GiBrain style={{ color: 'var(--text-color-secondary)' }} />;
      }
    }
    return <GiBrain style={{ color: 'var(--text-color-secondary)' }} />;
  };

  const getRatingLabelInfo = () => {
    if (!session || (user && mySocialInfo && !mySocialInfo.ratingByMe)) {
      return <div className={styles.ratingLabelInfo}>{t('Rate it')}</div>;
    }
    return undefined;
  };

  return (
    // (session && user && (
    <Container className={styles.container}>
      {getRatingLabelInfo()}
      <div className={styles.buttonsContainer}>
        {showTrash && (
          <button type="button" title="Clear rating" className={styles.clearRating} onClick={clearRating}>
            <FiTrash2 />
          </button>
        )}

        <Rating
          initialRating={qty}
          onChange={handlerChangeRating}
          className={styles.rating}
          stop={5}
          emptySymbol={<GiBrain style={{ color: 'var(--eureka-grey)' }} />}
          fullSymbol={getFullSymbol()}
        />
        <button className={styles.socialBtn} title={t('Save for later')} onClick={handleFavClick} type="button">
          {optimistFav ? <BsBookmarkFill className={styles.active} /> : <BsBookmark />}
          <br />
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[optimistFav ? styles.active : '']])}>
              {t('Save for later')}
            </span>
          )}
        </button>
      </div>
      {/* {isWork(entity) && (
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
          {optimistLike  ? <GiBrain className={styles.active} /> : <GiBrain />}
          {showCounts && optimistLikeCount}
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[optimistLike ? styles.active : '']])}>
              {t('I learned')}!
            </span>
          )}
        </button>
            */}

      {showShare && (
        <OverlayTrigger trigger="click" placement="right" overlay={popoverShares}>
          <Button variant="link" className={styles.socialBtn}>
            <FiShare2 className={styles.active} />
            <br />
            {showButtonLabels && <span className={classnames(styles.info, styles.active)}>{t('Share')}</span>}
          </Button>
        </OverlayTrigger>
      )}
    </Container>
    // )) ||
    // null
  );
};

export default SocialInteraction;
