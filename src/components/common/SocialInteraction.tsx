import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import classnames from 'classnames';
import { FiShare2, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';
import { useAtom } from 'jotai';
import Rating from 'react-rating';
import { OverlayTrigger, Popover, Button, Spinner } from 'react-bootstrap';

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Cycle, Work, Post } from '@prisma/client';
import { useMosaicContext } from '../../useMosaicContext';
import globalSearchEngineAtom from '../../atoms/searchEngine';

import useUser from '@/src/useUser';
import globalModalsAtom from '../../atoms/globalModals';
// import Notification from '../ui/Notification';
import { WEBAPP_URL } from '../../constants';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
import { UserMosaicItem } from '../../types/user';
import { MySocialInfo, isCycle, isWork, Session, isPost } from '../../types';
import styles from './SocialInteraction.module.css';
import {useNotificationContext} from '@/src/useNotificationProvider';
interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'rating';
  doCreate: boolean;
  ratingQty?: number;
}

interface Props {
  entity: CycleMosaicItem | PostMosaicItem | WorkMosaicItem /* | UserMosaicItem */;
  parent?: Cycle | Work | null;
  // mySocialInfo: MySocialInfo;
  showCounts?: boolean;
  // showShare?: boolean;
  showButtonLabels?: boolean;
  cacheKey?: string[];
  showTrash?: boolean;
  showRating?: boolean;
  className?: string;
}

const SocialInteraction: FunctionComponent<Props> = ({
  entity,
  parent /* ,  mySocialInfo */,
  // showShare = false,
  showCounts = false,
  showButtonLabels = true,
  cacheKey = '',
  showTrash = false,
  showRating = true,
  className,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const [session, isLoadingSession] = useSession();
  const [qty, setQty] = useState<number>(0);

  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);

  const [mySocialInfo, setMySocialInfo] = useState<MySocialInfo>();

  // const [optimistLike, setOptimistLike] = useState<boolean | null>();
  const [optimistFav, setOptimistFav] = useState<boolean | null>();
  // const [optimistReadOrWatched, setOptimistReadOrWatched] = useState<boolean | null>();

  // const [optimistLikeCount, setOptimistLikeCount] = useState<number>(0);
  const [optimistFavCount, setOptimistFavCount] = useState<number>(0);
  // const [optimistReadOrWatchedCount, setOptimistReadOrWatchedCount] = useState<number>(0);
  const queryClient = useQueryClient();

  const [idSession, setIdSession] = useState<string>('');
  const {
    isFetching: isFetchingUser,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError,
    /* error, */ data: user,
  } = useUser(+idSession,{ enabled: !!+idSession });
  // const [user, setuser] = useState<UserDetail>();
  const [showShare, setShowShare] = useState<boolean>(false);
  const mosaicContext = useMosaicContext();
  const {notifier} = useNotificationContext();
  useEffect(() => {
    if (mosaicContext) {
      setShowShare(mosaicContext.showShare);
    }
  }, [mosaicContext]);

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
    if (s) {
      setIdSession(s.user.id.toString());
    }
  }, [session]);

  useEffect(() => {
    if (isSuccessUser && idSession && !user) {
      queryClient.invalidateQueries(['USER', `${idSession}`]);
    }
  }, [user, idSession, isSuccessUser]);

  useEffect(() => {
    calculateQty();

    let ratingByMe = false;
    if (session && user && user.id && entity) {
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

        idx = user.ratingWorks.findIndex((i) => i.workId === entity.id);
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

        let idx = user.favCycles ? user.favCycles.findIndex((i: Cycle) => i.id === entity.id) : -1;
        const favoritedByMe = idx !== -1;
        setOptimistFav(favoritedByMe);
        setOptimistFavCount(entity.favs.length);

        idx = user.ratingCycles
          ? user.ratingCycles.findIndex((i) => i.cycleId === entity.id)
          : -1;
        if (idx !== -1) {
          ratingByMe = true;
        }

        setMySocialInfo({ favoritedByMe, ratingByMe });
      } else if (isPost(entity)) {
        // setOptimistReadOrWatchedCount(0);

        const idx = user.favPosts ? user.favPosts.findIndex((i: Post) => i.id === entity.id) : -1;
        const favoritedByMe = idx !== -1;
        setOptimistFav(favoritedByMe);
        if (!entity.favs) console.error('missing favs in ', entity);
        else setOptimistFavCount(entity.favs.length);

        setMySocialInfo({ favoritedByMe });
      }
    }
  }, [user, entity, session]);

  const openSignInModal = () => {
    setQty(0);
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
  const shareUrl = (() => {
    if (isPost(entity)) {
      const post = entity as PostMosaicItem;
      const parentIsWork = post.works.length;
      const parentIsCycle = !post.works.length && post.cycles.length;
      if (parentIsWork) return `${WEBAPP_URL}/work/${post.works[0].id}/post/${post.id}`;
      if (parentIsCycle) return `${WEBAPP_URL}/cycle/${post.cycles[0].id}/post/${post.id}`;
    }
    if (isWork(entity)) return `${WEBAPP_URL}/work/${entity.id}`;
    if (isCycle(entity)) return `${WEBAPP_URL}/cycle/${entity.id}`;
    return `${WEBAPP_URL}${router.asPath}`;
  })();

  const shareTextDynamicPart = (() => {
    if (parent != null && isCycle(parent)) {
      return `${t('postCycleShare')} "${parent.title}"`;
    }
    // if (parent != null && isWork(parent)) {
    //   return `${t('postWorkShare')} "${parent.title}"`;
    // }
    if (isCycle(entity)) {
      return t('cycleShare');
    }
    if (isWork(entity)) {
      return t('workShare');
    }
    if (isPost(entity)) {
      const post = entity as PostMosaicItem;
      const p = post.works[0] || post.cycles[0] || null;
      const about = post.works[0] ? 'postWorkShare' : 'postCycleShare';
      return `EUREKA: "${post.title}". \n ${t(about)} "${p ? p.title : ''}"`;
    }

    throw new Error('Invalid entity or parent');
  })();
  const title = () => {
    if (parent != null) {
      if (isWork(parent) || isCycle(parent)) return '';
    }
    if ('title' in entity) return entity.title;
    //return entity.name; // an user;
  };
  const titleStr = title();
  const shareText = `${shareTextDynamicPart} ${titleStr ? `"${titleStr}"` : ''} ${t('complementShare')}`;

  const {
    mutate: execSocialInteraction,
    isSuccess,
    isLoading: loadingSocialInteraction,
  } = useMutation(
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
        const notificationContextURL = router.asPath;
        //[user that does action] has saved the [title of book/movie/documentary/cycle] for later. Check it out.
        
        let translationKey = socialInteraction === 'fav' 
        ? 'userHasSaveForLater'
        : 'userHasRating';

        const notificationMessage = `${translationKey}!|!${JSON.stringify({
          userName: user?.name,
          entity: entityEndpoint.replace(/\w/,c=>c.toUpperCase()),
          entityTitle: entity.title,
        })}`;
        
        const notificationToUsers = user?.followedBy.map(f=>f.id);

        const res = await fetch(`/api/${entityEndpoint}/${entity.id}/${socialInteraction}`, {
          method: doCreate ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qty: ratingQty,
            ... doCreate && {
              notificationMessage,
              notificationContextURL,
              notificationToUsers
            },
          }),
        });
        if(notifier && notificationToUsers)
          notifier.notify({
            toUsers:notificationToUsers,
            data:{message:notificationMessage}
          });
        return res.json();
      }
      // calculateQty();
      openSignInModal();
      return null;
    },
    {
      onMutate: async (payload) => {
        await queryClient.cancelQueries(cacheKey);
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
        //     queryClient.setQueryData(['USER', `${idSession}`], { ...user, likedWorks });
        //   } else if (isCycle(entity)) {
        //     let likedCycles;
        //     if (ol) {
        //       likedCycles = user?.likedCycles.filter((i: Cycle) => i.id !== entity.id);
        //     } else {
        //       user?.likedCycles.push(entity);
        //       likedCycles = user?.likedCycles;
        //     }
        //     queryClient.setQueryData(['USER', `${idSession}`], { ...user, likedCycles });
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
        //   queryClient.setQueryData(['USER', `${idSession}`], { ...user, readOrWatchedWorks });
        //   return { optimistreadOrWatched: ol, optimistreadOrWatchedCount: olc };
        // }
        if (session && payload.socialInteraction === 'fav') {
          const opfc = optimistFavCount;
          const opf = optimistFav;
          setOptimistFav(!optimistFav);
          setOptimistFavCount(optimistFavCount + favInc());
          let favWorks;
          if (isWork(entity)) {
            if (opf) favWorks = user?.favWorks.filter((i) => i.id !== entity.id);
            else {
              user?.favWorks.push(entity);
              favWorks = user?.favWorks;
            }
            queryClient.setQueryData(['USER', `${idSession}`], { ...user, favWorks });
          } else if (isCycle(entity)) {
            let favCycles;
            if (opf) favCycles = user?.favCycles.filter((i: Cycle) => i.id !== entity.id);
            else {
              user?.favCycles.push(entity);
              favCycles = user?.favCycles;
            }
            queryClient.setQueryData(['USER', `${idSession}`], { ...user, favCycles });
          } else if (isPost(entity)) {
            let favPosts;
            if (opf) favPosts = user?.favPosts.filter((i) => i.id !== entity.id);
            else {
              user?.favPosts.push(entity);
              favPosts = user?.favPosts;
            }
            queryClient.setQueryData(['USER', `${idSession}`], { ...user, favPosts });
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
        const ck = globalSearchEngineState ? globalSearchEngineState.cacheKey : cacheKey;
        queryClient.invalidateQueries(['USER', `${idSession}`]);
        if (!ck) router.replace(router.asPath);
        queryClient.invalidateQueries(ck);
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
      <Popover.Body>
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
      </Popover.Body>
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
        if (mySocialInfo.ratingByMe)
          return <GiBrain className="text-secondary" /*  style={{ color: 'var(--eureka-blue)' }} */ />;
      }
    }
    return <GiBrain className="text-primary" /* style={{ color: 'var(--eureka-green)' }} */ />;
  };

  const getRatingsCount = () => {
    let count = 0;
    if (isWork(entity)) count = (entity as WorkMosaicItem).ratings.length;
    else if (isCycle(entity)) count = (entity as CycleMosaicItem).ratings.length;

    // if (!session || (user && mySocialInfo && !mySocialInfo.ratingByMe))
    return <span className={styles.ratingsCount}>{`${count}`}</span>;
    // return <Badge variant="secondary">{`${entity.ratings.length}`}</Badge>;
    // return <Badge variant="info">{`${entity.ratings.length}`}</Badge>;
  };

  const getRatingLabelInfo = () => {
    if (!session || (user && mySocialInfo && !mySocialInfo.ratingByMe)) {
      return <span className={styles.ratingLabelInfo}>{t('Rate it')}</span>;
    }
    return undefined;
  };
  if (isLoadingSession || isLoadingUser) return <Spinner animation="grow" variant="info" size="sm" />;
  return (
    // (session && user && (
    <section className={`${className}`}>
      {/* <Row> */}
      <div className="d-flex">
        {showRating && (
          // <Col xs={10}>
          <div className="ps-1">
            {showRating && getRatingLabelInfo()}
            {` `}
            {showRating && (
              <Rating
                initialRating={qty}
                onClick={handlerChangeRating}
                className={styles.rating}
                stop={5}
                emptySymbol={<GiBrain className="fs-6 text-info" />}
                fullSymbol={getFullSymbol()}
                readonly={loadingSocialInteraction}
              />
            )}{' '}
            {showRating && !loadingSocialInteraction && getRatingsCount()}{' '}
            {showTrash && mySocialInfo && mySocialInfo.ratingByMe && (
              <Button
                type="button"
                title={t('Clear rating')}
                className="text-warning p-0"
                onClick={clearRating}
                variant="link"
                disabled={loadingSocialInteraction}
              >
                <FiTrash2 />
              </Button>
            )}
            {loadingSocialInteraction && (
              <Spinner className={styles.ratingSpinner} size="sm" animation="grow" variant="info" />
            )}
          </div>
        )}
        {showShare && (
          <div className="ms-auto">
            <OverlayTrigger trigger="click" placement="right" overlay={popoverShares}>
              <Button
                // style={{ fontSize: '.9em' }}
                title={t('Share')}
                variant="link"
                className={`${styles.buttonSI} fs-6 p-0 text-primary`}
              >
                <FiShare2 />
                <br />
                {showButtonLabels && <span className={classnames(styles.info, styles.active)}>{t('Share')}</span>}
              </Button>
            </OverlayTrigger>
          </div>
        )}
        {/* <Col xs={showRating ? 2 : 12}> */}
        <div className={`${showShare ? 'ms-1' : 'ms-auto'}`}>
          {!loadingSocialInteraction && (
            <Button
              variant="link"
              className={`${styles.buttonSI} p-0 text-primary`}
              title={t('Save for later')}
              onClick={handleFavClick}
            >
              {optimistFav ? <BsBookmarkFill className={styles.active} /> : <BsBookmark />}
              <br />
              {showButtonLabels && (
                <span className={classnames(...[styles.info, ...[optimistFav ? styles.active : '']])}>
                  {t('Save for later')}
                </span>
              )}
            </Button>
          )}
        </div>
        {/* </Col> */}
        {/* </Row> */}
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
    </section>
    // )) ||
    // null
  );
};

export default SocialInteraction;
