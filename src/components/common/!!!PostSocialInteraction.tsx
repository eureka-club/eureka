import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { BiImageAdd } from 'react-icons/bi';
import classnames from 'classnames';
import { FiShare2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { OverlayTrigger, Popover, Button, Spinner } from 'react-bootstrap';

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
import { PostDetail, PostSumary } from '@/src/types/post';
import {
  MySocialInfo,
  isCycle,
  isWork,
  isWorkMosaicItem,
  isCycleMosaicItem,
} from '../../types';
import styles from './SocialInteraction.module.css';
// import { useNotificationContext } from '@/src/useNotificationProvider';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../forms/SignInForm';
import _ from 'lodash';
import { CycleSumary } from '@/src/types/cycle';
import { WorkSumary } from '@/src/types/work';
import usePostSumary from '@/src/usePostSumary';
interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'rating';
  doCreate: boolean;
  ratingQty?: number;
}

interface Props {
  postId: number;
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

const PostSocialInteraction: FunctionComponent<Props> = ({
  postId,
  showCounts = false,
  showButtonLabels = true,
  cacheKey = '',
  showCreateEureka = true,
  showReaction = true,
  showSaveForLater = false,
  showTrash = false,
  className,
}) => {
  const { t,lang } = useTranslation('common');
  const router = useRouter();
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const { data: session, status } = useSession();
  const idSession = session ? session.user.id : null;
  const{data:post}=usePostSumary(postId);
  const isLoadingSession = status === 'loading';
  const [qty, setQty] = useState<number>(0);
  const { show } = useModalContext();

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
  //const { notifier } = useNotificationContext();

  useEffect(() => {
    if (isSuccessUser && idSession && !user) {
      queryClient.invalidateQueries(['USER', `${idSession}`]);
    }
  }, [user, idSession, isSuccessUser]);

  const [currentUserIsFav, setcurrentUserIsFav] = useState(false);

  useEffect(() => {
    let ratingByMe = false;
    if (session && post && post?.favs) {
      const favoritedByMe = post?.favs.findIndex((f) => f.id == session.user.id) > -1;
      setcurrentUserIsFav(() => favoritedByMe);

      setMySocialInfo({ favoritedByMe });
    }
  }, [post, session]);

  const openSignInModal = () => {
    setQty(0);
    show(<SignInForm />);
  };

  const shareUrl = (() => {
      const parentIsWork = post?.works ? post?.works.length > 0 : false;
      const parentIsCycle = !parentIsWork && post?.cycles && post?.cycles.length;
      if (parentIsWork) return `${WEBAPP_URL}/work/${post?.works[0].id}/post/${post?.id}`;
      if (parentIsCycle) return `${WEBAPP_URL}/cycle/${post?.cycles[0].id}/post/${post?.id}`;
    return `${WEBAPP_URL}/${router.asPath}`;
  })();

  const shareTextDynamicPart = (() => {
    const p = post?.works ? post?.works[0] : null || post?.cycles ? post?.cycles[0] : null;
    const about = post?.works[0] ? 'postWorkShare' : 'postCycleShare';
    return `${t(about)} "${p ? p.title : ''}"`;
  })();

  const shareText = `${shareTextDynamicPart}  ${t('complementShare')}`;
  const {
    mutate: execSocialInteraction,
    isSuccess,
    isLoading: loadingSocialInteraction,
  } = useMutation(
    async ({ socialInteraction, doCreate, ratingQty }: SocialInteractionClientPayload) => {
      const entityEndpoint = 'post';
      if (session) {
        //[user that does action] has saved the [title of book/movie/documentary/cycle] for later. Check it out.
        let translationKey = 'userHasRating';
        // let notificationContextURL = `/${entityEndpoint}/${post?.id}`;
        if (socialInteraction == 'fav') {
          translationKey = 'userHasSaveForLater';
        }

        // const notificationMessage = `${translationKey}!|!${JSON.stringify({
        //   userName: user?.name,
        //   post: entityEndpoint.replace(/\w/, (c) => c.toUpperCase()),
        //   entityTitle: post?.title,
        // })}`;

        // const notificationToUsers = user?.followedBy.map((f) => f.id);
        const res = await fetch(`/api/${entityEndpoint}/${post?.id}/${socialInteraction}?lang=${lang}`, {
          method: doCreate ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qty: ratingQty,
            doCreate,
            // ...(doCreate && {
            //   notificationMessage,
            //   notificationContextURL,
            //   notificationToUsers,
            // }),
          }),
        });
        // if (notifier && notificationToUsers)
        //   notifier.notify({
        //     toUsers: notificationToUsers,
        //     data: { message: notificationMessage },
        //   });
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

          const entityFavKey = 'favPosts';

          let favInUser = user[entityFavKey] as { id: number }[];
          // let favs = post?.favs;

          setcurrentUserIsFav(() => payload.doCreate);

          if (!payload.doCreate) {
            favInUser = favInUser.filter((i: { id: number }) => i.id !== post?.id);
            // favs = post?.favs.filter((i) => i.id != session.user.id);
          } else {
            favInUser?.push(post as any);
            // favs.push({ id: +session.user.id });
          }
          queryClient.setQueryData(['WORK', `${post?.id}`], { ...post });
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

  
  // // execSocialInteraction({ socialInteraction: 'reaction', doCreate: mySocialInfo ? !mySocialInfo!.favoritedByMe : true });
  // const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   if (!session) {
  //     openSignInModal();
  //     return null;
  //   }
  //   if (canNavigate()) {
  //     /*setIsLoadingCreateEureka(true)
  //       setTimeout(()=>{setIsLoadingCreateEureka(false)},2500)*/
  //     if (isWorkMosaicItem(post)) router.push({ pathname: `/work/${post?.id}`, query: { tabKey: 'posts' } });
  //     if (isCycleMosaicItem(post)) router.push({ pathname: `/cycle/${post?.id}`, query: { tabKey: 'eurekas' } });
  //   }
  // };

  const canNavigate = () => {
    return !(!post || isLoadingSession);
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
    if (post) {
      if (isWorkMosaicItem(post) || isCycleMosaicItem(post))
        if (post?.currentUserRating)
          return <GiBrain className="text-secondary" /*  style={{ color: 'var(--eureka-blue)' }} */ />;
    }
    return <GiBrain className="text-primary" /* style={{ color: 'var(--eureka-green)' }} */ />;
  };

  // const getRatingsCount = () => {
  //   let count = 0;
  //   if (isWorkMosaicItem(post)) {
  //     count = post?._count.ratings;
  //   } else if (isCycleMosaicItem(post)) count = post?._count.ratings;

  //   return <span className={styles.ratingsCount}>{`${count}`}</span>;
  // };

  const renderSaveForLater = () => {
    if (!post || isLoadingSession) return '...';
    if (post)
      return (
        <Button
          variant="link"
          className={`${styles.buttonSI} p-0 text-primary`}
          title={t('Save for later')}
          onClick={handleFavClick}
          disabled={loadingSocialInteraction}
        >
          {/* optimistFav */ currentUserIsFav ? <BsBookmarkFill style={{fontSize: "1.3em",verticalAlign:"bottom"}} className={styles.active} /> : <BsBookmark style={{fontSize: "1.3em",verticalAlign:"bottom"}} />}
          <br />
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[currentUserIsFav ? styles.active : '']])}>
              {t('Save for later')}
            </span>
          )}
        </Button>
      );
  };


  const getInitialRating = () => {
    if (post) {
      if (isCycleMosaicItem(post) || isWorkMosaicItem(post)) {
        return post?.ratingAVG;
      }
    }
  };
  const getRatingLabelInfo = () => {
    if (post) {
      if (isCycleMosaicItem(post) || isWorkMosaicItem(post))
        return !post?.currentUserRating ? <span className={styles.ratingLabelInfo}>{t('Rate it')}:</span> : '';
    }
    return '';
  };
  if (isLoadingSession || isLoadingUser) return <Spinner animation="grow" variant="info" size="sm" />;
  return (
    <section className={`${className} d-flex flex-row`}>
        {loadingSocialInteraction && (
          <div className="mt-1 ms-1 me-2">
            {' '}
            <Spinner className={styles.ratingSpinner} size="sm" animation="grow" variant="info" />
          </div>
        )}
      <div className="ms-auto d-flex justify-content-end">

        {ss && (
            <OverlayTrigger trigger="focus" placement="top" overlay={popoverShares}>
              <Button
                // style={{ fontSize: '.9em' }}
                title={t('Share')}
                variant="link"
                className={`p-0 text-primary`}
                disabled={loadingSocialInteraction}
              >
               <FiShare2 style={{fontSize: "1.3em",verticalAlign:"bottom"}} />
                <br />
                {showButtonLabels && <span className={classnames(styles.info, styles.active)}>{t('Share')}</span>}
              </Button>
            </OverlayTrigger>
        )}
        <div className="ms-auto">
          {showSaveForLater && <div className={`ms-1`}>{renderSaveForLater()}</div>}
        </div>
      </div>
    </section>
  );
};
export default PostSocialInteraction;
