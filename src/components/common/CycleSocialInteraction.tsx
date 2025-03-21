// import { useRouter } from 'next/router';
// import useTranslation from 'next-translate/useTranslation';
// import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
// import { GiBrain } from 'react-icons/gi';
// import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
// import { BiImageAdd } from 'react-icons/bi';
// // import { FaRegSmileBeam } from 'react-icons/fa';
// import classnames from 'classnames';
// import { FiShare2, FiTrash2 } from 'react-icons/fi';
// import { useMutation, useQueryClient } from 'react-query';
// import { useSession } from 'next-auth/react';
// // import Rating from 'react-rating';
// import Rating from '@/src/components/common/Rating';

// import { OverlayTrigger, Popover, Button, Spinner } from 'react-bootstrap';

// import {
//   FacebookIcon,
//   FacebookShareButton,
//   TwitterShareButton,
//   TwitterIcon,
//   WhatsappShareButton,
//   WhatsappIcon,
// } from 'react-share';
// import { useMosaicContext } from '@/src/useMosaicContext';

// import useUser from '@/src/useUser';
// import { WEBAPP_URL } from '@/src/constants';
// import { CycleSumary } from '@/src/types/cycle';
// import {
//   MySocialInfo,
// } from '../../types';
// import styles from './SocialInteraction.module.css';
// // import { useNotificationContext } from '@/src/useNotificationProvider';
// import SignInForm from '../forms/SignInForm';
// import _ from 'lodash';
// import { useModalContext } from '@/src/hooks/useModal';
// interface SocialInteractionClientPayload {
//   socialInteraction: 'fav' | 'rating';
//   doCreate: boolean;
//   ratingQty?: number;
// }

// interface Props {
//   entity: CycleSumary;
//   showCounts?: boolean;
//   showButtonLabels?: boolean;
//   cacheKey: string[];
//   showCreateEureka?: boolean;
//   showReaction?: boolean;
//   showSaveForLater?: boolean;
//   showTrash?: boolean;
//   showRating?: boolean;
//   className?: string;
// }

// const CycleSocialInteraction: FunctionComponent<Props> = ({
//   entity,
//   showCounts = false,
//   showButtonLabels = true,
//   cacheKey = '',
//   showCreateEureka = true,
//   showReaction = true,
//   showSaveForLater = false,
//   showTrash = false,
//   showRating = true,
//   className,
// }) => {
//   const { t,lang } = useTranslation('common');
//   const router = useRouter();
//   // const [session] = useSession() as [Session | null | undefined, boolean];
//   const { data: session, status } = useSession();
//   const idSession = session ? session.user.id : null;

//   const isLoadingSession = status === 'loading';
//   const [qty, setQty] = useState<number>(0);
//   const { show } = useModalContext();

//   const [mySocialInfo, setMySocialInfo] = useState<MySocialInfo>();

//   // const [optimistLike, setOptimistLike] = useState<boolean | null>();
//   const { showShare: ss } = useMosaicContext();

//   const [showShare, setShowShare] = useState<boolean>(false);
//   const [isLoadingCreateEureka, setIsLoadingCreateEureka] = useState<boolean>(false);
//   const queryClient = useQueryClient();
//   const {
//     isFetching: isFetchingUser,
//     isLoading: isLoadingUser,
//     isSuccess: isSuccessUser,
//     isError,
//     /* error, */ data: user,
//   } = useUser(idSession!, { enabled: !!idSession! });
//   //const { notifier } = useNotificationContext();

//   useEffect(() => {
//     if (isSuccessUser && idSession && !user) {
//       queryClient.invalidateQueries(['USER', `${idSession}`]);
//     }
//   }, [user, idSession, isSuccessUser]);

//   const [currentUserIsFav, setcurrentUserIsFav] = useState(false);

//   useEffect(() => {
//     let ratingByMe = false;
//     if (session && entity && entity.favs) {
//       const favoritedByMe = entity.favs.findIndex((f) => f.id == session.user.id) > -1;
//       setcurrentUserIsFav(() => favoritedByMe);
      
//       ratingByMe = !!entity.currentUserRating;
//       setMySocialInfo({ favoritedByMe, ratingByMe });
//       setQty(entity.ratingAVG || 0);
//     }
//   }, [entity, session]);

//   const openSignInModal = () => {
//     setQty(0);
//     show(<SignInForm />);
//   };

//   const shareUrl = `${WEBAPP_URL}/cycle/${entity.id}`;
//   const shareTextDynamicPart = `${t('cycleShare')} ${'title' in entity ? `"${entity.title}"` : ''}`;
//   const shareText = `${shareTextDynamicPart}  ${t('complementShare')}`;

//   const {
//     mutate: execSocialInteraction,
//     isSuccess,
//     isLoading: loadingSocialInteraction,
//   } = useMutation(
//     async ({ socialInteraction, doCreate, ratingQty }: SocialInteractionClientPayload) => {
//       if (session) {
//         let translationKey = 'userHasRating';
//         if (socialInteraction == 'fav') {
//           translationKey = 'userHasSaveForLater';
//         }
//         const res = await fetch(`/api/cycle/${entity.id}/${socialInteraction}?lang=${lang}`, {
//           method: doCreate ? 'POST' : 'DELETE',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             qty: ratingQty,
//             doCreate,
//           }),
//         });
//         return res.json();
//       }
//       openSignInModal();
//       return null;
//     },
//     {
//       onMutate: async (payload) => {
//         if (session && user && payload.socialInteraction === 'fav') {
//           await queryClient.cancelQueries(['USER', `${session.user.id}`]);
//           await queryClient.cancelQueries(cacheKey);

//           const prevUser = queryClient.getQueryData(['USER', `${session.user.id}`]);
//           const prevEntity = queryClient.getQueryData(cacheKey);

//           const entityFavKey = 'favCycles';

//           let favInUser = user[entityFavKey] as { id: number }[];
//           let favs = entity.favs;

//           setcurrentUserIsFav(() => payload.doCreate);

//           if (!payload.doCreate) {
//             favInUser = favInUser.filter((i: { id: number }) => i.id !== entity.id);
//             favs = entity.favs.filter((i) => i.id != session.user.id);
//           } else {
//             favInUser?.push(entity as any);
//             favs.push({ id: +session.user.id });
//           }
//           queryClient.setQueryData(['CYCLE', `${entity.id}`], { ...entity, favs });
//           queryClient.setQueryData(['USER', `${session.user.id}`], { ...user, [entityFavKey]: favInUser });

//           return { prevUser, prevEntity };
//         }
//       },
//       onSettled: (_, error, __, context) => {
//         if (error && context) {
//           if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
//           if ('prevEntity' in context) queryClient.setQueryData(cacheKey, context?.prevEntity);
//         }
//         queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
//         queryClient.invalidateQueries(cacheKey);
//       },
//     },
//   );

//   const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
//     ev.preventDefault();
//     execSocialInteraction({ socialInteraction: 'fav', doCreate: !currentUserIsFav });
//   };

  
//   // execSocialInteraction({ socialInteraction: 'reaction', doCreate: mySocialInfo ? !mySocialInfo!.favoritedByMe : true });
//   const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
//     ev.preventDefault();
//     if (!session) {
//       openSignInModal();
//       return null;
//     }
//     if (canNavigate()) {
//       router.push({ pathname: `/cycle/${entity.id}`, query: { tabKey: 'eurekas' } });
//     }
//   };

//   const canNavigate = () => {
//     return !(!entity || isLoadingSession);
//   };

//   const popoverShares = (
//     <Popover id="popover-basic" style={{ width: 'zpx' }}>
//       <Popover.Body>
//         <div className="mb-2">
//           <TwitterShareButton windowWidth={800} windowHeight={600} url={shareUrl} title={shareText} via="eleurekaclub">
//             <TwitterIcon size={30} round />
//             {` ${t('wayShare')} Twitter`}
//           </TwitterShareButton>
//         </div>
//         <div className="mb-2">
//           <FacebookShareButton windowWidth={800} windowHeight={600} url={shareUrl} quote={shareText}>
//             <FacebookIcon size={30} round />
//             {` ${t('wayShare')} Facebook`}
//           </FacebookShareButton>
//         </div>
//         <WhatsappShareButton
//           windowWidth={800}
//           windowHeight={600}
//           url={shareUrl}
//           title={`${shareText} ${t('whatsappComplement')}`}
//         >
//           <WhatsappIcon size={30} round />
//           {` ${t('wayShare')} Whatsapp`}
//         </WhatsappShareButton>
//       </Popover.Body>
//     </Popover>
//   );

//   const clearRating = () => {
//     setQty(0);
//     execSocialInteraction({
//       socialInteraction: 'rating',
//       ratingQty: 0,
//       doCreate: false,
//     });
//   };

//   const handlerChangeRating = (value: number) => {
//     setQty(value);
//     execSocialInteraction({
//       socialInteraction: 'rating',
//       ratingQty: value,
//       doCreate: value ? true : false,
//     });
//   };

//   const getFullSymbol = () => {
//     if (entity) {
//       if (entity.currentUserRating)
//         return <GiBrain className="text-secondary" /*  style={{ color: 'var(--eureka-blue)' }} */ />;
//     }
//     return <GiBrain className="text-primary" /* style={{ color: 'var(--eureka-green)' }} */ />;
//   };

//   const getRatingsCount = () => {
//     let count = entity.ratings.length;
//     return <span className={styles.ratingsCount}>{`${count}`}</span>;
//   };

//   const renderSaveForLater = () => {
//     if (!entity || isLoadingSession) return '...';
//     if (entity)
//       return (
//         <Button
//           variant="link"
//           className={`${styles.buttonSI} p-0 text-primary`}
//           title={t('Save for later')}
//           onClick={handleFavClick}
//           disabled={loadingSocialInteraction}
//         >
//           {/* optimistFav */ currentUserIsFav ? <BsBookmarkFill style={{fontSize: "1.3em",verticalAlign:"bottom"}} className={styles.active} /> : <BsBookmark style={{fontSize: "1.3em",verticalAlign:"bottom"}} />}
//           <br />
//           {showButtonLabels && (
//             <span className={classnames(...[styles.info, ...[currentUserIsFav ? styles.active : '']])}>
//               {t('Save for later')}
//             </span>
//           )}
//         </Button>
//       );
//   };

//   const renderCreateEureka = () => {
//     if (!entity || isLoadingSession) return '...';
//     if (showCreateEureka)
//       return (
//         <>
//           <Button
//             variant="link"
//             className={`${styles.buttonSI} p-0 text-primary`}
//             title={t('Create eureka')}
//             onClick={handleCreateEurekaClick}
//             disabled={loadingSocialInteraction}
//           >
//             <div className={`d-flex flex-row`}>
//               <BiImageAdd className={styles.active} />
//               <span className="d-flex align-items-center text-primary" style={{ fontSize: '0.8em' }}>
//                 {t('Create eureka')}
//               </span>
//             </div>
//           </Button>
//           {/*isLoadingCreateEureka  && <div className='d-flex align-items-center' ><Spinner   animation="grow" variant="info" size="sm" /></div> */}
//         </>
//       );
//   };

//   const getInitialRating = () => {
//     if (entity) {
//       return entity.ratingAVG;
//     }
//   };
//   const getRatingLabelInfo = () => {
//     if (entity) {
//       return !entity.currentUserRating ? <span className={styles.ratingLabelInfo}>{t('Rate it')}:</span> : '';
//     }
//     return '';
//   };
//   if (isLoadingSession || isLoadingUser) return <Spinner animation="grow" variant="info" size="sm" />;
//   return (
//     <section className={`${className} d-flex flex-row`}>
//       {renderCreateEureka()}

//         {showRating && (
//           <div className="ps-1">
//             {showRating && getRatingLabelInfo()}
//             {` `}
//             {showRating && (
//               <>
//                 {/* @ts-ignore*/}
//                 {/* <Rating
//                 initialRating={getInitialRating()}
//                 onClick={handlerChangeRating}
//                 className={styles.rating}
//                 stop={5}
//                 emptySymbol={<GiBrain className="fs-6 text-info" />}
//                 fullSymbol={getFullSymbol()}
//                 readonly={loadingSocialInteraction}
//               />  */}
//                 <Rating qty={qty} onChange={handlerChangeRating} stop={5} readonly={loadingSocialInteraction} />
//               </>
//             )}{' '}
//             {showRating && !loadingSocialInteraction && getRatingsCount()}{' '}
//             {showTrash && mySocialInfo && mySocialInfo.ratingByMe && (
//               <Button
//                 type="button"
//                 title={t('clearRating')}
//                 className="text-warning p-0"
//                 onClick={clearRating}
//                 variant="link"
//                 disabled={loadingSocialInteraction}
//               >
//                 <FiTrash2 />
//               </Button>
//             )}
//           </div>
//         )}

//         {loadingSocialInteraction && (
//           <div className="mt-1 ms-1 me-2">
//             {' '}
//             <Spinner className={styles.ratingSpinner} size="sm" animation="grow" variant="info" />
//           </div>
//         )}
//       <div className="ms-auto d-flex justify-content-end">

//         {ss && (
//             <OverlayTrigger trigger="focus" placement="top" overlay={popoverShares}>
//               <Button
//                 // style={{ fontSize: '.9em' }}
//                 title={t('Share')}
//                 variant="link"
//                 className={`p-0 text-primary`}
//                 disabled={loadingSocialInteraction}
//               >
//                <FiShare2 style={{fontSize: "1.3em",verticalAlign:"bottom"}} />
//                 <br />
//                 {showButtonLabels && <span className={classnames(styles.info, styles.active)}>{t('Share')}</span>}
//               </Button>
//             </OverlayTrigger>
         
//         )}
//         {/* <div className={`ms-1`}>
//         {
//               isPost(entity) && entity?.reactions[0] 
//                ? <span role="img" className="m-1" style={{verticalAlign:"sub"}} aria-label="emoji-ico" dangerouslySetInnerHTML={{__html: `${entity?.reactions[0].emoji}`}} />
//                : <></>
//         }
//         </div> */}
//         <div className="ms-auto">
//           {showSaveForLater && <div className={`ms-1`}>{renderSaveForLater()}</div>}
//         </div>
//       </div>
//     </section>
//   );
// };
// export default CycleSocialInteraction;
export default {};