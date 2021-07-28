import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
import { GiBrain, GiStarsStack } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill, BsEye } from 'react-icons/bs';
import classnames from 'classnames';
import { FiShare2 } from 'react-icons/fi';
import { useMutation } from 'react-query';
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
import { User } from '@prisma/client';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
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
  entity: CycleDetail | PostDetail | WorkDetail;
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

  useEffect(() => {
    if (entity && isWork(entity) && session) {
      setOptimistReadOrWatchedCount(entity.readOrWatcheds.length);
      const s = session as unknown as Session;

      let idx = entity.likes.findIndex((i) => i.id === s.user!.id);
      const likedByMe = idx !== -1;
      setOptimistLike(likedByMe);
      setOptimistLikeCount(entity.likes.length);

      idx = entity.favs.findIndex((i) => i.id === s.user!.id);
      const favoritedByMe = idx !== -1;
      setOptimistFav(favoritedByMe);
      setOptimistFavCount(entity.favs.length);

      idx = entity.readOrWatcheds.findIndex((i) => i.id === s.user!.id);
      const readOrWatchedByMe = idx !== -1;
      setOptimistReadOrWatched(readOrWatchedByMe);
      setMySocialInfo({ likedByMe, favoritedByMe, readOrWatchedByMe });
      setOptimistReadOrWatchedCount(entity.readOrWatcheds.length);
    }
  }, [entity, session]);

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
  const shareText = `${shareTextDynamicPart} "${entity.title}" ${t('complementShare')}`;

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
          return { optimistLike: ol, optimistLikeCount: olc };
        }
        if (isWork(entity) && payload.socialInteraction === 'readOrWatched') {
          const ol = optimistReadOrWatched;
          setOptimistReadOrWatched(!optimistReadOrWatched);
          const olc = optimistReadOrWatchedCount;
          setOptimistReadOrWatchedCount(optimistReadOrWatchedCount! + readOrWatchedInc());
          return { optimistreadOrWatched: ol, optimistreadOrWatchedCount: olc };
        }
        const opf = optimistFav;
        const opfc = optimistFavCount;
        setOptimistFav(!optimistFav);
        setOptimistFavCount(optimistFavCount + favInc());
        return { optimistFav: opf, optimistFavCount: opfc };
      },
      onSuccess: (data, variables) => {
        if (data.status !== 'OK') {
          if (variables.socialInteraction === 'like') {
            setOptimistLike(mySocialInfo!.likedByMe!);
            setOptimistLikeCount(entity.likes.length);
          } else if (isWork(entity) && variables.socialInteraction === 'readOrWatched') {
            setOptimistReadOrWatched(mySocialInfo!.readOrWatchedByMe!);
            setOptimistReadOrWatchedCount((entity as WorkDetail).readOrWatcheds.length);
          }
          setOptimistFav(mySocialInfo!.likedByMe!);
          setOptimistFavCount(entity.favs.length);
        }
      },
    },
  );

  const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'fav', doCreate: !mySocialInfo!.favoritedByMe });
  };

  const handleLikeClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'like', doCreate: !mySocialInfo!.likedByMe });
  };

  const handleReadOrWatchedClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'readOrWatched', doCreate: !mySocialInfo!.readOrWatchedByMe });
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
          <button className={styles.socialBtn} onClick={handleReadOrWatchedClick} type="button">
            {optimistReadOrWatched ? <BsEye className={styles.active} /> : <BsEye />}
            {showCounts && optimistReadOrWatchedCount}
            {showButtonLabels && (
              <span className={classnames(...[styles.info, ...[optimistReadOrWatched ? styles.active : '']])}>
                {t('Read / watched')}
              </span>
            )}
          </button>
        )}
        <button className={styles.socialBtn} onClick={handleLikeClick} type="button">
          {optimistLike /* mySocialInfo.likedByMe */ ? <GiBrain className={styles.active} /> : <GiBrain />}
          {showCounts && optimistLikeCount}
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[optimistLike ? styles.active : '']])}>
              {t('I learned')}!
            </span>
          )}
        </button>

        {isWork(entity) /* || isCycle(entity) */ && (
          <button className={styles.socialBtn} type="button">
            <GiStarsStack className={styles.active} />
            {optimistReadOrWatchedCount! ? optimistLikeCount / optimistReadOrWatchedCount! : 0}%
            {showButtonLabels && (
              <span className={classnames(...[styles.info, styles.active])}>{t('Rating Eureka')}*</span>
            )}
          </button>
        )}
        <button className={styles.socialBtn} onClick={handleFavClick} type="button">
          {optimistFav /* mySocialInfo.favoritedByMe */ ? <BsBookmarkFill className={styles.active} /> : <BsBookmark />}
          {showCounts && optimistFavCount}
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
