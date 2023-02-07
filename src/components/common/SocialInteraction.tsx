import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { GiBrain } from 'react-icons/gi';
import { VscReactions } from 'react-icons/vsc';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { BiImageAdd } from 'react-icons/bi';
import { FaRegSmileBeam } from 'react-icons/fa';
import classnames from 'classnames';
import { FiShare2, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
// import Rating from 'react-rating';
import useEmojiPicker from './useEmojiPicker';
import Rating from '@/src/components/common/Rating';

import { OverlayTrigger, Popover, Button, Spinner, Modal } from 'react-bootstrap';

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Cycle, Work } from '@prisma/client';
import { useMosaicContext } from '@/src/useMosaicContext';

import useUser from '@/src/useUser';
import { WEBAPP_URL } from '@/src/constants';
import { CycleMosaicItem } from '@/src/types/cycle';
import { PostMosaicItem } from '@/src/types/post';
import { WorkMosaicItem } from '@/src/types/work';
import {
  MySocialInfo,
  isCycle,
  isWork,
  isPost,
  isPostMosaicItem,
  isWorkMosaicItem,
  isCycleMosaicItem,
} from '../../types';
import styles from './SocialInteraction.module.css';
import { useNotificationContext } from '@/src/useNotificationProvider';
import { useModalContext } from '@/src/useModal';
import SignInForm from '../forms/SignInForm';
import _ from 'lodash';
interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'rating';
  doCreate: boolean;
  ratingQty?: number;
}

interface Props {
  entity: CycleMosaicItem | PostMosaicItem | WorkMosaicItem /* | UserMosaicItem */;
  parent?: Cycle | Work | null;
  showCounts?: boolean;
  showButtonLabels?: boolean;
  cacheKey: string[];
  showCreateEureka?: boolean;
  showReaction?: boolean;
  showSaveForLater?: boolean;
  showTrash?: boolean;
  showRating?: boolean;
  className?: string;
}

const SocialInteraction: FunctionComponent<Props> = ({
  entity,
  parent,
  showCounts = false,
  showButtonLabels = true,
  cacheKey = '',
  showCreateEureka = true,
  showReaction = true,
  showSaveForLater = false,
  showTrash = false,
  showRating = true,
  className,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const { data: session, status } = useSession();
  const idSession = session ? session.user.id : null;

  const isLoadingSession = status === 'loading';
  const [qty, setQty] = useState<number>(0);
  const { show } = useModalContext();
  const { EmojiPicker, setShowEmojisPicker } = useEmojiPicker();

  const [mySocialInfo, setMySocialInfo] = useState<MySocialInfo>();

  // const [optimistLike, setOptimistLike] = useState<boolean | null>();
  const { showShare: ss } = useMosaicContext();

  const [showShare, setShowShare] = useState<boolean>(false);
  const [isLoadingCreateEureka, setIsLoadingCreateEureka] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const {
    isFetching: isFetchingUser,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError,
    /* error, */ data: user,
  } = useUser(idSession!, { enabled: !!idSession! });
  const { notifier } = useNotificationContext();

  useEffect(() => {
    if (isSuccessUser && idSession && !user) {
      queryClient.invalidateQueries(['USER', `${idSession}`]);
    }
  }, [user, idSession, isSuccessUser]);

  const [currentUserIsFav, setcurrentUserIsFav] = useState(false);

  useEffect(() => {
    let ratingByMe = false;
    if (session && entity && entity.favs) {
      const favoritedByMe = entity.favs.findIndex((f) => f.id == session.user.id) > -1;
      setcurrentUserIsFav(() => favoritedByMe);

      if (isWork(entity)) {
        ratingByMe = !!entity.currentUserRating;
        setMySocialInfo({ favoritedByMe, ratingByMe });
        setQty(entity.ratingAVG || 0);
      } else if (isCycle(entity)) {
        ratingByMe = !!entity.currentUserRating;
        setMySocialInfo({ favoritedByMe, ratingByMe });
        setQty(entity.ratingAVG || 0);
      } else if (isPostMosaicItem(entity)) {
        setMySocialInfo({ favoritedByMe });
      }
    }
  }, [entity, session]);

  const openSignInModal = () => {
    setQty(0);
    show(<SignInForm />);
  };

  const shareUrl = (() => {
    if (isPost(entity)) {
      const post = entity as PostMosaicItem;
      const parentIsWork = post.works ? post.works.length > 0 : false;
      const parentIsCycle = !parentIsWork && post.cycles && post.cycles.length;
      if (parentIsWork) return `${WEBAPP_URL}/work/${post.works[0].id}/post/${post.id}`;
      if (parentIsCycle) return `${WEBAPP_URL}/cycle/${post.cycles[0].id}/post/${post.id}`;
    }
    if (isWork(entity)) return `${WEBAPP_URL}/work/${entity.id}`;
    if (isCycle(entity)) return `${WEBAPP_URL}/cycle/${entity.id}`;
    return `${WEBAPP_URL}/${router.asPath}`;
  })();

  const shareTextDynamicPart = (() => {
    if (parent != null && isCycle(parent)) {
      return `${t('postCycleShare')} "${parent.title}"`;
    }
    if (isCycle(entity)) {
      return `${t('cycleShare')} ${'title' in entity ? `"${entity.title}"` : ''}`;
    }
    if (isWork(entity)) {
      return `${t('workShare')} ${'title' in entity ? `"${entity.title}"` : ''}`;
    }
    if (isPostMosaicItem(entity)) {
      const post = entity as PostMosaicItem;
      const p = post.works ? post.works[0] : null || post.cycles ? post.cycles[0] : null;
      const about = post.works[0] ? 'postWorkShare' : 'postCycleShare';
      return `${t(about)} "${p ? p.title : ''}"`;
    }
    return 'entity not found';
  })();

  const shareText = `${shareTextDynamicPart}  ${t('complementShare')}`;
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
        //[user that does action] has saved the [title of book/movie/documentary/cycle] for later. Check it out.
        let translationKey = 'userHasRating';
        let notificationContextURL = `/${entityEndpoint}/${entity.id}`;
        if (socialInteraction == 'fav') {
          translationKey = 'userHasSaveForLater';
        }

        const notificationMessage = `${translationKey}!|!${JSON.stringify({
          userName: user?.name,
          entity: entityEndpoint.replace(/\w/, (c) => c.toUpperCase()),
          entityTitle: entity.title,
        })}`;

        const notificationToUsers = user?.followedBy.map((f) => f.id);
        const res = await fetch(`/api/${entityEndpoint}/${entity.id}/${socialInteraction}`, {
          method: doCreate ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qty: ratingQty,
            doCreate,
            ...(doCreate && {
              notificationMessage,
              notificationContextURL,
              notificationToUsers,
            }),
          }),
        });
        if (notifier && notificationToUsers)
          notifier.notify({
            toUsers: notificationToUsers,
            data: { message: notificationMessage },
          });
        return res.json();
      }
      openSignInModal();
      return null;
    },
    {
      onMutate: async (payload) => {
        if (session && user && payload.socialInteraction === 'fav') {
          await queryClient.cancelQueries(['USER', `${session.user.id}`]);
          await queryClient.cancelQueries(cacheKey);

          const prevUser = queryClient.getQueryData(['USER', `${session.user.id}`]);
          const prevEntity = queryClient.getQueryData(cacheKey);

          const entityFavKey = isWork(entity) ? 'favWorks' : isCycle(entity) ? 'favCycles' : 'favPosts';

          let favInUser = user[entityFavKey] as { id: number }[];
          let favs = entity.favs;

          setcurrentUserIsFav(() => payload.doCreate);

          if (!payload.doCreate) {
            favInUser = favInUser.filter((i: { id: number }) => i.id !== entity.id);
            favs = entity.favs.filter((i) => i.id != session.user.id);
          } else {
            favInUser?.push(entity as any);
            favs.push({ id: +session.user.id });
          }
          queryClient.setQueryData(['WORK', `${entity.id}`], { ...entity, favs });
          queryClient.setQueryData(['USER', `${session.user.id}`], { ...user, [entityFavKey]: favInUser });

          return { prevUser, prevEntity };
        }
      },
      onSettled: (_, error, __, context) => {
        if (error && context) {
          if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
          if ('prevEntity' in context) queryClient.setQueryData(cacheKey, context?.prevEntity);
        }
        queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
        queryClient.invalidateQueries(cacheKey);
      },
    },
  );

  const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'fav', doCreate: !currentUserIsFav });
  };

  const handleReactionClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    setShowEmojisPicker((r) => !r);
  };
  // execSocialInteraction({ socialInteraction: 'reaction', doCreate: mySocialInfo ? !mySocialInfo!.favoritedByMe : true });
  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) {
      openSignInModal();
      return null;
    }
    if (canNavigate()) {
      /*setIsLoadingCreateEureka(true)
        setTimeout(()=>{setIsLoadingCreateEureka(false)},2500)*/
      if (isWorkMosaicItem(entity)) router.push({ pathname: `/work/${entity.id}`, query: { tabKey: 'posts' } });
      if (isCycleMosaicItem(entity)) router.push({ pathname: `/cycle/${entity.id}`, query: { tabKey: 'eurekas' } });
    }
  };

  const canNavigate = () => {
    return !(!entity || isLoadingSession);
  };

  const popoverShares = (
    <Popover id="popover-basic" style={{ width: 'zpx' }}>
      <Popover.Body>
        <div className="mb-2">
          <TwitterShareButton windowWidth={800} windowHeight={600} url={shareUrl} title={shareText} via="eleurekaclub">
            <TwitterIcon size={30} round />
            {` ${t('wayShare')} Twitter`}
          </TwitterShareButton>
        </div>
        <div className="mb-2">
          <FacebookShareButton windowWidth={800} windowHeight={600} url={shareUrl} quote={shareText}>
            <FacebookIcon size={30} round />
            {` ${t('wayShare')} Facebook`}
          </FacebookShareButton>
        </div>
        <WhatsappShareButton
          windowWidth={800}
          windowHeight={600}
          url={shareUrl}
          title={`${shareText} ${t('whatsappComplement')}`}
        >
          <WhatsappIcon size={30} round />
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
      doCreate: value ? true : false,
    });
  };

  const getFullSymbol = () => {
    if (entity) {
      if (isWorkMosaicItem(entity) || isCycleMosaicItem(entity))
        if (entity.currentUserRating)
          return <GiBrain className="text-secondary" /*  style={{ color: 'var(--eureka-blue)' }} */ />;
    }
    return <GiBrain className="text-primary" /* style={{ color: 'var(--eureka-green)' }} */ />;
  };

  const getRatingsCount = () => {
    let count = 0;
    if (isWorkMosaicItem(entity)) {
      count = entity._count.ratings;
    } else if (isCycleMosaicItem(entity)) count = entity._count.ratings;

    return <span className={styles.ratingsCount}>{`${count}`}</span>;
  };

  const renderSaveForLater = () => {
    if (!entity || isLoadingSession) return '...';
    if (entity)
      return (
        <Button
          variant="link"
          className={`${styles.buttonSI} p-0 text-primary`}
          title={t('Save for later')}
          onClick={handleFavClick}
          disabled={loadingSocialInteraction}
        >
          {/* optimistFav */ currentUserIsFav ? <BsBookmarkFill className={styles.active} /> : <BsBookmark />}
          <br />
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[currentUserIsFav ? styles.active : '']])}>
              {t('Save for later')}
            </span>
          )}
        </Button>
      );
  };

  const renderEmojiPicker = () => {
    return <EmojiPicker entity={entity} onSaved={console.log} />;
  };

  const renderAddReaction = () => {
    if (!entity || isLoadingSession) return '...';
    if (entity)
      return (
        <div>
          <div style={{ position: 'relative' }}>{renderEmojiPicker()}</div>
          <Button
            variant="link"
            className={`${styles.buttonSI} p-0 text-primary`}
            title={t('Add reaction')}
            onClick={handleReactionClick}
            disabled={loadingSocialInteraction}
          >
            <VscReactions className={styles.active} />
            <br />
            {showButtonLabels && (
              <span className={classnames(...[styles.info, ...[currentUserIsFav ? styles.active : '']])}>
                {t('Add reaction')}
              </span>
            )}
          </Button>
        </div>
      );
  };

  const renderCreateEureka = () => {
    if (!entity || isLoadingSession) return '...';
    if (showCreateEureka && (isWork(entity) || isCycle(entity)))
      return (
        <>
          <Button
            variant="link"
            className={`${styles.buttonSI} p-0 text-primary`}
            title={t('Create eureka')}
            onClick={handleCreateEurekaClick}
            disabled={loadingSocialInteraction}
          >
            <div className={`d-flex flex-row`}>
              <BiImageAdd className={styles.active} />
              <span className="d-flex align-items-center text-primary" style={{ fontSize: '0.8em' }}>
                {t('Create eureka')}
              </span>
            </div>
          </Button>
          {/*isLoadingCreateEureka  && <div className='d-flex align-items-center' ><Spinner   animation="grow" variant="info" size="sm" /></div> */}
        </>
      );
  };

  const getInitialRating = () => {
    if (entity) {
      if (isCycleMosaicItem(entity) || isWorkMosaicItem(entity)) {
        return entity.ratingAVG;
      }
    }
  };
  const getRatingLabelInfo = () => {
    if (entity) {
      if (isCycleMosaicItem(entity) || isWorkMosaicItem(entity))
        return !entity.currentUserRating ? <span className={styles.ratingLabelInfo}>{t('Rate it')}</span> : '';
    }
    return '';
  };
  if (isLoadingSession || isLoadingUser) return <Spinner animation="grow" variant="info" size="sm" />;
  return (
    <section className={`${className}`}>
      <div className="d-flex justify-content-between">
        {showRating && (
          <div className="ps-1">
            {showRating && getRatingLabelInfo()}
            {` `}
            {showRating && (
              <>
                {/* @ts-ignore*/}
                {/* <Rating
                initialRating={getInitialRating()}
                onClick={handlerChangeRating}
                className={styles.rating}
                stop={5}
                emptySymbol={<GiBrain className="fs-6 text-info" />}
                fullSymbol={getFullSymbol()}
                readonly={loadingSocialInteraction}
              />  */}
                <Rating qty={qty} onChange={handlerChangeRating} stop={5} readonly={loadingSocialInteraction} />
              </>
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
          </div>
        )}

        {loadingSocialInteraction && (
          <div className="mt-1 ms-1 me-2">
            {' '}
            <Spinner className={styles.ratingSpinner} size="sm" animation="grow" variant="info" />
          </div>
        )}
        {renderCreateEureka()}
        {ss && (
          <div className="ms-auto">
            <OverlayTrigger trigger="focus" placement="top" overlay={popoverShares}>
              <Button
                // style={{ fontSize: '.9em' }}
                title={t('Share')}
                variant="link"
                className={`${styles.buttonSI} fs-6 p-0 text-primary`}
                disabled={loadingSocialInteraction}
              >
                <FiShare2 />
                <br />
                {showButtonLabels && <span className={classnames(styles.info, styles.active)}>{t('Share')}</span>}
              </Button>
            </OverlayTrigger>
          </div>
        )}
        {/*<div className={`ms-1`}>
            {renderAddReaction()}       
        </div>*/}
        {showSaveForLater && <div className={`ms-1`}>{renderSaveForLater()}</div>}
      </div>
    </section>
  );
};
export default SocialInteraction;
