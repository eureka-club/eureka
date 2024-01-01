"use client"

import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { BiImageAdd } from 'react-icons/bi';
import classnames from 'classnames';
import { FiShare2, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Rating from '@/src/components/common/Rating';
import { OverlayTrigger, Popover, Button, Spinner } from 'react-bootstrap';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Cycle } from '@prisma/client';
import { useMosaicContext } from '@/src/hooks/useMosaicContext';
import useUser from '@/src/hooks/useUser';
import { WEBAPP_URL } from '@/src/constants';
import { CycleMosaicItem } from '@/src/types/cycle';
import {
  MySocialInfo,
  isCycle,
  isWork,
  isPost,
  isPostMosaicItem,
  isWorkMosaicItem,
  isCycleMosaicItem,
} from '@/src/types';
import styles from './SocialInteraction.module.css';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '@/src/components/forms/SignInForm';
import _ from 'lodash';
import { t } from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';
import { useRouter } from 'next/navigation';
import useCycle from '@/src/hooks/useCycle';
interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'rating';
  doCreate: boolean;
  ratingQty?: number;
}

interface Props {
  cycleId:number;
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

const CycleSocialInteraction: FunctionComponent<Props> = ({
  cycleId,
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
  const router = useRouter();
  const {data:cycle}= useCycle(cycleId);
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const { data: session, status } = useSession();
  const idSession = session ? session.user.id : null;
  const {dict}=useDictContext()
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
      queryClient.invalidateQueries({queryKey:['USER', `${idSession}`]});
    }
  }, [user, idSession, isSuccessUser]);

  const [currentUserIsFav, setcurrentUserIsFav] = useState(false);

  useEffect(() => {
    let ratingByMe = false;
    if (session && cycle && cycle?.favs) {
      const favoritedByMe = cycle?.favs.findIndex((f) => f.id == session.user.id) > -1;
      setcurrentUserIsFav(() => favoritedByMe);

      ratingByMe = !!cycle?.currentUserRating;
      setMySocialInfo({ favoritedByMe, ratingByMe });
      setQty(cycle?.ratingAVG || 0);
       
    }
  }, [cycle, session]);

  const openSignInModal = () => {
    setQty(0);
    show(<SignInForm/>);
  };

  const shareUrl = `${WEBAPP_URL}/cycle/${cycleId}`
  const shareTextDynamicPart = `${t(dict,'cycleShare')} ${cycle && 'title' in cycle ? `"${cycle?.title}"` : ''}`;

  const shareText = `${shareTextDynamicPart}  ${t(dict,'complementShare')}`;
  const {
    mutate: execSocialInteraction,
    isSuccess,
    isPending: loadingSocialInteraction,
  } = useMutation(
    {
      mutationFn:async ({ socialInteraction, doCreate, ratingQty }: SocialInteractionClientPayload) => {
        if (session) {
          //[user that does action] has saved the [title of book/movie/documentary/cycle] for later. Check it out.
          let translationKey = 'userHasRating';
          // let notificationContextURL = `/${entityEndpoint}/${cycle?.id}`;
          if (socialInteraction == 'fav') {
            translationKey = 'userHasSaveForLater';
          }
  
          // const notificationMessage = `${translationKey}!|!${JSON.stringify({
          //   userName: user?.name,
          //   entity: entityEndpoint.replace(/\w/, (c) => c.toUpperCase()),
          //   entityTitle: cycle?.title,
          // })}`;
  
          // const notificationToUsers = user?.followedBy.map((f) => f.id);
          const res = await fetch(`/api/cycle/${cycle?.id}/${socialInteraction}`, {
            method: doCreate ? 'POST' : 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              qty: ratingQty,
              doCreate,
            }),
          });
          return res.json();
        }
        openSignInModal();
        return null;
      },
      onMutate: async (payload) => {
        if (session && user && payload.socialInteraction === 'fav') {
          await queryClient.cancelQueries({queryKey:['USER', `${session.user.id}`]});
          await queryClient.cancelQueries({queryKey:[cacheKey]});
          await queryClient.cancelQueries({queryKey:['CYCLE',`${cycle?.id}`]});

          const prevUser = queryClient.getQueryData(['USER', `${session.user.id}`]);
          const prevEntity = queryClient.getQueryData([cacheKey]);

          setcurrentUserIsFav((p) => !p);

          // if (!payload.doCreate) {
          //   favInUser = favInUser.filter((i: { id: number }) => i.id !== cycle?.id);
          //   favs = cycle?.favs.filter((i) => i.id != session.user.id);
          // } else {
          //   favInUser?.push(entity as any);
          //   favs.push({ id: +session.user.id });
          // }
          // queryClient.setQueryData(['USER', `${session.user.id}`], { ...user, [entityFavKey]: favInUser });
          queryClient.setQueryData(['CYCLE', `${cycle?.id}`], { ...cycle });
          queryClient.setQueryData(['USER', `${session.user.id}`], { ...user });

          return { prevUser, prevEntity };
        }
      },
      onSettled: (_, error, __, context) => {
        if (error && context) {
          if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
          if ('prevEntity' in context) queryClient.setQueryData([cacheKey], context?.prevEntity);
        }
        queryClient.invalidateQueries({queryKey:['USER', `${session?.user.id}`]});
        queryClient.invalidateQueries({queryKey:['CYCLE', `${cycle?.id}`]});
        queryClient.invalidateQueries({queryKey:[cacheKey]});
      },
    },
  );

  const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'fav', doCreate: !currentUserIsFav });
  };

  
  // execSocialInteraction({ socialInteraction: 'reaction', doCreate: mySocialInfo ? !mySocialInfo!.favoritedByMe : true });
  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) {
      openSignInModal();
      return null;
    }
    if (canNavigate()) {
      router.push(`/cycle/${cycleId}?tabKey=eurekas`);
    }
  };

  const canNavigate = () => {
    return !(!cycle || isLoadingSession);
  };

  const popoverShares = (
    <Popover id="popover-basic" style={{ width: 'zpx' }}>
      <Popover.Body>
        <div className="mb-2">
          <TwitterShareButton windowWidth={800} windowHeight={600} url={shareUrl} title={shareText} via="eleurekaclub">
            <TwitterIcon size={30} round />
            {` ${t(dict,'wayShare')} Twitter`}
          </TwitterShareButton>
        </div>
        <div className="mb-2">
          <FacebookShareButton windowWidth={800} windowHeight={600} url={shareUrl} quote={shareText}>
            <FacebookIcon size={30} round />
            {` ${t(dict,'wayShare')} Facebook`}
          </FacebookShareButton>
        </div>
        <WhatsappShareButton
          windowWidth={800}
          windowHeight={600}
          url={shareUrl}
          title={`${shareText} ${t(dict,'whatsappComplement')}`}
        >
          <WhatsappIcon size={30} round />
          {` ${t(dict,'wayShare')} Whatsapp`}
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
    if (cycle) {
      if (isWorkMosaicItem(cycle) || isCycleMosaicItem(cycle))
        if (cycle?.currentUserRating)
          return <GiBrain className="text-secondary" /*  style={{ color: 'var(--eureka-blue)' }} */ />;
    }
    return <GiBrain className="text-primary" /* style={{ color: 'var(--eureka-green)' }} */ />;
  };

  const getRatingsCount = () => {
    let count = cycle?._count.ratings;
    return <span className={styles.ratingsCount}>{`${count}`}</span>;
  };

  const renderSaveForLater = () => {
    if (!cycle || isLoadingSession) return '...';
    if (cycle)
      return (
        <Button
          variant="link"
          className={`${styles.buttonSI} p-0 text-primary`}
          title={t(dict,'Save for later')}
          onClick={handleFavClick}
          disabled={loadingSocialInteraction}
        >
          {/* optimistFav */ currentUserIsFav ? <BsBookmarkFill style={{fontSize: "1.3em",verticalAlign:"bottom"}} className={styles.active} /> : <BsBookmark style={{fontSize: "1.3em",verticalAlign:"bottom"}} />}
          <br />
          {showButtonLabels && (
            <span className={classnames(...[styles.info, ...[currentUserIsFav ? styles.active : '']])}>
              {t(dict,'Save for later')}
            </span>
          )}
        </Button>
      );
  };

  const renderCreateEureka = () => {
    if (!cycle || isLoadingSession) return '...';
    if (showCreateEureka)
      return (
        <>
          <Button
            variant="link"
            className={`${styles.buttonSI} p-0 text-primary`}
            title={t(dict,'Create eureka')}
            onClick={handleCreateEurekaClick}
            disabled={loadingSocialInteraction}
          >
            <div className={`d-flex flex-row`}>
              <BiImageAdd className={styles.active} />
              <span className="d-flex align-items-center text-primary" style={{ fontSize: '0.8em' }}>
                {t(dict,'Create eureka')}
              </span>
            </div>
          </Button>
          {/*isLoadingCreateEureka  && <div className='d-flex align-items-center' ><Spinner   animation="grow" variant="info" size="sm" /></div> */}
        </>
      );
  };

  const getInitialRating = () => {
    return cycle?.ratingAVG;
  };
  const getRatingLabelInfo = () => {
    return !cycle?.currentUserRating ? <span className={styles.ratingLabelInfo}>{t(dict,'Rate it')}:</span> : '';
  };
  if (isLoadingSession || isLoadingUser) return <Spinner animation="grow" variant="info" size="sm" />;
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
                title={t(dict,'clearRating')}
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
      <div className="ms-auto d-flex justify-content-end">

        {ss && (
            <OverlayTrigger trigger="focus" placement="top" overlay={popoverShares}>
              <Button
                // style={{ fontSize: '.9em' }}
                title={t(dict,'Share')}
                variant="link"
                className={`p-0 text-primary`}
                disabled={loadingSocialInteraction}
              >
               <FiShare2 style={{fontSize: "1.3em",verticalAlign:"bottom"}} />
                <br />
                {showButtonLabels && <span className={classnames(styles.info, styles.active)}>{t(dict,'Share')}</span>}
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
export default CycleSocialInteraction;
