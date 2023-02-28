import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { BiImageAdd } from 'react-icons/bi';
import { FaRegSmileBeam } from 'react-icons/fa';
import classnames from 'classnames';
import { FiShare2, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
// import Rating from 'react-rating';

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
} from '../../types';
import styles from './SocialInteraction.module.css';
import { useNotificationContext } from '@/src/useNotificationProvider';
import { useModalContext } from '@/src/useModal';
import SignInForm from '../forms/SignInForm';
import _ from 'lodash';
import PostReactionsDetail from './PostReactionsDetail';

import usePostEmojiPicker from './hooks/usePostEmojiPicker';
import PostReactionsActions from './PostReactionsActions';
import Link from 'next/link';
interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'rating';
  doCreate: boolean;
  ratingQty?: number;
}

interface Props {
  post: PostMosaicItem;
  parent?: Cycle | Work | null;
  showCounts?: boolean;
  showButtonLabels?: boolean;
  cacheKey: [string,string];
  showCreateEureka?: boolean;
  showReaction?: boolean;
  showSaveForLater?: boolean;
  showTrash?: boolean;
  className?: string;
  showTitle?:boolean;
}

const SocialInteraction: FunctionComponent<Props> = ({
  post,
  parent,
  showCounts = false,
  showButtonLabels = true,
  cacheKey,
  showCreateEureka = true,
  showReaction = true,
  showSaveForLater = false,
  showTrash = false,
  showTitle = true,
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
  const { EmojiPicker, setShowEmojisPicker } = usePostEmojiPicker({post,cacheKey});

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
    if (session && post && post.favs) {
      const favoritedByMe = post.favs.findIndex((f) => f.id == session.user.id) > -1;
      setcurrentUserIsFav(() => favoritedByMe);
      setMySocialInfo({ favoritedByMe });
    }
  }, [post, session]);

  const openSignInModal = () => {
    setQty(0);
    show(<SignInForm />);
  };

  const shareUrl = (() => {
    if (post) {
      const parentIsWork = post.works ? post.works.length > 0 : false;
      const parentIsCycle = !parentIsWork && post.cycles && post.cycles.length;
      if (parentIsWork) return `${WEBAPP_URL}/work/${post.works[0].id}/post/${post.id}`;
      if (parentIsCycle) return `${WEBAPP_URL}/cycle/${post.cycles[0].id}/post/${post.id}`;
    }
    return `${WEBAPP_URL}/${router.asPath}`;
  })();

  const shareTextDynamicPart = (() => {
    if (post) {
      const p = post.works ? post.works[0] : null || post.cycles ? post.cycles[0] : null;
      const about = post.works[0] ? 'postWorkShare' : 'postCycleShare';
      return `${t(about)} "${p ? p.title : ''}"`;
    }
    return 'post not found';
  })();

  const shareText = `${shareTextDynamicPart}  ${t('complementShare')}`;
  const {
    mutate: execSocialInteraction,
    isSuccess,
    isLoading: loadingSocialInteraction,
  } = useMutation(
    async ({ socialInteraction, doCreate, ratingQty }: SocialInteractionClientPayload) => {
      if (session) {
        //[user that does action] has saved the [title of book/movie/documentary/cycle] for later. Check it out.
        let translationKey = 'userHasRating';
        let notificationContextURL = `/post/${post.id}`;
        if (socialInteraction == 'fav') {
          translationKey = 'userHasSaveForLater';
        }

        const notificationMessage = `${translationKey}!|!${JSON.stringify({
          userName: user?.name,
          post: 'Post',
          entityTitle: post.title,
        })}`;

        const notificationToUsers = user?.followedBy.map((f) => f.id);
        const res = await fetch(`/api/post/${post.id}/${socialInteraction}`, {
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

          let favPosts = user.favPosts as { id: number }[];
          let favs = post.favs;

          setcurrentUserIsFav(() => payload.doCreate);

          if (!payload.doCreate) {
            favPosts = favPosts.filter((i: { id: number }) => i.id !== post.id);
            favs = post.favs.filter((i) => i.id != session.user.id);
          } else {
            favPosts?.push(post as any);
            favs.push({ id: +session.user.id });
          }
          queryClient.setQueryData(['WORK', `${post.id}`], { ...post, favs });
          queryClient.setQueryData(['USER', `${session.user.id}`], { ...user, favPosts });

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

  
  const parentLinkHref = ((): string | null => {
    if (post.works.length) {
      return `/work/${post.works[0].id}`;
    }
    else if (post.cycles[0]) {
      return `/cycle/${post.cycles[0].id}`;
    }
    return null;
  })();

  const getParentTitle = () => {
    let res = '';
    if (post.works.length) {
      res = post.works[0].title
    }
    else if(post.cycles.length){
      res = post.cycles[0].title
    }
    return res;
  };
 
  const renderParentTitle = () => {
    const chars = 7
    let res = '';
    let full =''
    if (post.works.length) {
      full = post.works[0].title
      res = full.slice(0, chars);
    }
    else if(post.cycles.length){
      full = post.cycles[0].title
      res = full.slice(0, chars);
    }
    if (res.length + 3 < full.length) res = `${res}...`;
    else res = full;
    return res; 
  };

  const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'fav', doCreate: !currentUserIsFav });
  };

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

  if (isLoadingSession || isLoadingUser) return <Spinner animation="grow" variant="info" size="sm" />;
  return (
    <section className={`${className}`}>
      <div className="d-flex justify-content-between align-items-center">
        {
          showTitle 
            ? <div className="flex-grow-1"><h2 className="m-0 p-1 fs-6 text-info" data-cy="parent-title">
            {` `}
            {parentLinkHref != null ? (
              <Link href={parentLinkHref}>
                <a title={getParentTitle()} className="text-info">
                  <span>{renderParentTitle()} </span>
                </a>
              </Link>
            ) : (
              <h2 className="m-0 p-1 fs-6 text-secondary">{renderParentTitle()}</h2>
            )}
          </h2>
          </div>: <></>
        }
        
        <div className='ms-auto'>
            <PostReactionsDetail cacheKey={cacheKey} post={post as PostMosaicItem}/>
        </div>
        <div className={`ms-1`}>
            <PostReactionsActions cacheKey={cacheKey} post={post as PostMosaicItem}/>
        </div>
        {ss && (
          <div className="">
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
          </div>
        )}
        {showSaveForLater && <div className={`ms-1`}>{renderSaveForLater()}</div>}

      </div>
    </section>
  );
};
export default SocialInteraction;
