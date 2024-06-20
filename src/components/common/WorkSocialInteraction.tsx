import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { BiImageAdd } from 'react-icons/bi';
// import { FaRegSmileBeam } from 'react-icons/fa';
import classnames from 'classnames';
import { FiShare2, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
// import Rating from 'react-rating';
import Rating from '@/src/components/common/Rating';

import { OverlayTrigger, Popover, Button} from 'react-bootstrap';

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Work } from '@prisma/client';
import { useMosaicContext } from '@/src/useMosaicContext';

import { WEBAPP_URL } from '@/src/constants';
import { PostDetail } from '@/src/types/post';
import { WorkSumary } from '@/src/types/work';
import {
  MySocialInfo,
  isWork,
  isPost,
  isPostMosaicItem,
  isWorkMosaicItem,
  isCycleMosaicItem,
} from '../../types';
import styles from './SocialInteraction.module.css';
// import { useNotificationContext } from '@/src/useNotificationProvider';
import SignInForm from '../forms/SignInForm';
import _ from 'lodash';
import { CycleSumary } from '@/src/types/cycle';
import useUserSumary from '@/src/useUserSumary';
import { useModalContext } from '@/src/hooks/useModal';
import Spinner from '@/components/common/Spinner';
interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'rating';
  doCreate: boolean;
  ratingQty?: number;
}

interface Props {
  entity: WorkSumary;
  parent?: CycleSumary | null;
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

const WorkSocialInteraction: FunctionComponent<Props> = ({
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
  const { t,lang } = useTranslation('common');
  const router = useRouter();
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const { data: session, status } = useSession();
  const idSession = session ? session.user.id : null;

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
  } = useUserSumary(idSession!, { enabled: !!idSession! });
  //const { notifier } = useNotificationContext();

  useEffect(() => {
    if (isSuccessUser && idSession && !user) {
      queryClient.invalidateQueries(['USER', `${idSession}`]);
    }
  }, [user, idSession, isSuccessUser]);


  useEffect(() => {
    let ratingByMe = false;
    if (session && entity) {
      const favoritedByMe = entity.currentUserIsFav;
      ratingByMe = !!entity.currentUserRating;
      setMySocialInfo({ favoritedByMe, ratingByMe });
      setQty(entity.ratingAVG || 0);
      
    }
  }, [entity, session]);

  const openSignInModal = () => {
    setQty(0);
    show(<SignInForm />);
  };

  const shareUrl = `${WEBAPP_URL}/work/${entity.id}`;
  const shareTextDynamicPart = `${t('workShare')} ${'title' in entity ? `"${entity.title}"` : ''}`;
  const shareText = `${shareTextDynamicPart}  ${t('complementShare')}`;

  const {
    mutate: execSocialInteraction,
    isSuccess,
    isLoading: loadingSocialInteraction,
  } = useMutation(
    async ({ socialInteraction, doCreate, ratingQty }: SocialInteractionClientPayload) => {
      const entityEndpoint = 'work';
      if (session) {
        //[user that does action] has saved the [title of book/movie/documentary/cycle] for later. Check it out.
        let translationKey = 'userHasRating';
        // let notificationContextURL = `/${entityEndpoint}/${entity.id}`;
        if (socialInteraction == 'fav') {
          translationKey = 'userHasSaveForLater';
        }

        // const notificationMessage = `${translationKey}!|!${JSON.stringify({
        //   userName: user?.name,
        //   entity: entityEndpoint.replace(/\w/, (c) => c.toUpperCase()),
        //   entityTitle: entity.title,
        // })}`;

        // const notificationToUsers = user?.followedBy.map((f) => f.id);
        const res = await fetch(`/api/${entityEndpoint}/${entity.id}/${socialInteraction}?lang=${lang}`, {
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

          const entityFavKey = 'favWorks';

          // let favInUser = user[entityFavKey] as { id: number }[];

          setMySocialInfo(p=>({...p, favoritedByMe:payload.doCreate}));

          if (!payload.doCreate) {
            // favInUser = favInUser.filter((i: { id: number }) => i.id !== entity.id);
          } else {
            // favInUser?.push(entity as any);
          }
          queryClient.setQueryData(['WORK', `${entity.id}`], { ...entity });
          // queryClient.setQueryData(['USER', `${session.user.id}`], { ...user, [entityFavKey]: favInUser });

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
    execSocialInteraction({ socialInteraction: 'fav', doCreate: !entity.currentUserIsFav });
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
    return <span className={styles.ratingsCount}>{`${entity.ratingCount??0}`}</span>;
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
          {/* optimistFav */ entity.currentUserIsFav ? <BsBookmarkFill style={{fontSize: "1.3em",verticalAlign:"bottom"}} className={styles.active} /> : <BsBookmark style={{fontSize: "1.3em",verticalAlign:"bottom"}} />}
          <br />
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[entity.currentUserIsFav ? styles.active : '']])}>
              {t('Save for later')}
            </span>
          )}
        </Button>
      );
  };

  const renderCreateEureka = () => {
    if (!entity || isLoadingSession) return '...';
    if (showCreateEureka)
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
          {/*isLoadingCreateEureka  && <div className='d-flex align-items-center' ><Spinner  /></div> */}
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
        return !entity.currentUserRating ? <span className={styles.ratingLabelInfo}>{t('Rate it')}:</span> : '';
    }
    return '';
  };
  if (isLoadingSession || isLoadingUser) return <Spinner  />;
  return (
    <section className={`${className} d-flex flex-row`}>
        {renderCreateEureka()}

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
                title={t('clearRating')}
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
            <Spinner  />
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
        {/* <div className={`ms-1`}>
        {
              isPost(entity) && entity?.reactions[0] 
               ? <span role="img" className="m-1" style={{verticalAlign:"sub"}} aria-label="emoji-ico" dangerouslySetInnerHTML={{__html: `${entity?.reactions[0].emoji}`}} />
               : <></>
        }
        </div> */}
        <div className="ms-auto">
          {showSaveForLater && <div className={`ms-1`}>{renderSaveForLater()}</div>}
        </div>
      </div>
    </section>
  );
};
export default WorkSocialInteraction;
