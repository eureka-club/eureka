import { Cycle, Work } from '@prisma/client';
// import classNames from 'classnames';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Row, Col, Card, Badge,Button } from 'react-bootstrap';
import { FaRegComments, FaRegCompass } from 'react-icons/fa';
import dayjs from 'dayjs';
import { DATE_FORMAT_SHORT } from '../../constants';
import SocialInteraction from '../common/SocialInteraction';
import { PostMosaicItem } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import { isCycle, isWork } from '../../types';
// import { CycleMosaicItem } from '../../types/cycle';
// import { WorkMosaicItem } from '../../types/work';
import CommentsList from '../common/CommentsList';
import Avatar from '../common/UserAvatar';
import UnclampText from '../UnclampText';
import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import ActionsBar from '@/src/components/common/ActionsBar'
import {useAtom} from 'jotai'
import globalModals from '@/src/atoms/globalModals'
import editOnSmallerScreens from '@/src/atoms/editOnSmallerScreens'
import usePost from '@/src/usePost'
import {useQueryClient} from 'react-query'

interface Props {
  postId: number|string;
  display?: 'v' | 'h';
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  showdetail?: boolean;
  style?: { [k: string]: string };
  cacheKey: string[];
  showTrash?: boolean;
  showComments?: boolean;
  className?: string;
}

const MosaicItem: FunctionComponent<Props> = ({
  postId,
  display = 'v',
  showSocialInteraction = true,
  showdetail = true,
  cacheKey,
  showComments = false,
  className,
  // showButtonLabels,
  // showShare,
  // style,
  // showTrash,
}) => {
  const [gmAtom,setGmAtom] = useAtom(globalModals);
  const { t } = useTranslation('common');
  const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  const [k,setK] = useState<[string,string]>();
  // const [post,setPost] = useState<PostMosaicItem>();
  const [postParent,setPostParent] = useState<CycleMosaicItem|WorkMosaicItem>();

  //const postFromCache = queryClient.getQueryData<PostMosaicItem>(['POST',postId.toString()]);
  // const pp = queryClient.getQueryData<CycleMosaicItem|WorkMosaicItem>(cacheKey);
  
  const {data:post} = usePost(+postId,{
    enabled:!!postId
  })

   useEffect(()=>{
     if(post){
      if (post.works && post.works.length > 0) setPostParent(post.works[0] as WorkMosaicItem);
      else if (post.cycles && post.cycles.length > 0) setPostParent(post.cycles[0] as CycleMosaicItem);
     }
   },[post])


   if(!post)return <></>

  const parentLinkHref = ((): string | null => {
    if (postParent) {
      if (isCycle(postParent)) {
        return `/cycle/${postParent.id}`;
      }
      if (isWork(postParent)) {
        return `/work/${postParent.id}`;
      }
    }
    return null;
  })();
  const postLinkHref = ((): string => {
    if (postParent) {
      if (isCycle(postParent)) {
        return `/cycle/${postParent.id}/post/${post.id}`;
      }
      if (isWork(postParent)) {
        return `/work/${postParent.id}/post/${post.id}`;
      }
    }
    return `/post/${post.id}`;
  })();

  // const [creator] = useState(post.creator as User);
  const { /* title, localImages, id, */ type } = post;
  // const [newCommentInput, setNewCommentInput] = useState<string>();
  

  // const getDirectParent = () => {
  //   if (post.works && post.works.length) return post.works[0];
  //   return parent;
  // };
  const onEditPost = async (e:React.MouseEvent<HTMLButtonElement>) => {
    setGmAtom(res=>({...res,editPostModalOpened:true, editPostId:post.id, cacheKey}))
  }

   const onEditSmallScreen = async (e:React.MouseEvent<HTMLButtonElement>) => {
        setGmAtom(res=>({...res, editPostId:post.id}))
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: true } });
  }


  const renderVerticalMosaic = (props: { showDetailedInfo: boolean,specifyDataCy?:boolean }) => {
    const { showDetailedInfo, specifyDataCy=true } = props;

    const renderParentTitle = () => {
      let res = '';
      if (postParent) {
        const pptt = postParent.title.slice(0, 26);
        if (pptt.length + 3 < postParent.title.length) res = `${pptt}...`;
        else res = postParent.title;
      }
      return <span>{res}</span>;
    };
    return (
      <Card className={`mosaic ${styles.container} ${className}`} data-cy={specifyDataCy ? `mosaic-item-post-${post.id}`:''}>
        {postParent && (
          <h2 className="m-0 p-1 fs-6 text-info" data-cy="parent-title">
            <FaRegCompass className="text-info" />
            {` `}
            {parentLinkHref != null ? (
              <Link href={parentLinkHref}>
                <a className="text-info">
                  <span>{renderParentTitle()} </span>
                </a>
              </Link>
            ) : (
              <h2 className="m-0 p-1 fs-6 text-secondary">{renderParentTitle()}</h2>
            )}
          </h2>
        )}
        <div className={`${styles.imageContainer} ${styles.detailedImageContainer}`}>
          {parentLinkHref != null ? (
            <Link href={postLinkHref}>
              <a>
                <LocalImageComponent
                  className={styles.postImage}
                  filePath={post.localImages[0]?.storedFile}
                  alt={post.title}
                />
                <div className={styles.gradient} />
              </a>
            </Link>
          ) : (
            <>
              <LocalImageComponent
                className={styles.postImage}
                filePath={post.localImages[0]?.storedFile}
                alt={post.title}
              />
              <div className={styles.gradient} />
            </>
          )}
          <div className={`w-100 text-start ${styles.postDetail}`}>
            {post && showdetail && (
              <>
                <Avatar userId={post.creator.id} size="xs" />
                {` - `}
                <span className="fs-6">{dayjs(post.createdAt).format(DATE_FORMAT_SHORT)}</span>
              </>
            )}
          </div>
          <Badge bg="success" className={`fw-normal fs-6 text-white px-2 rounded-pill ${styles.type}`}>
            {t(type || 'post')}
          </Badge>
        </div>
        {showDetailedInfo && (
          <div className={`d-flex align-items-center justify-content-center ${styles.detailedInfo}`}>
            <h6 className="text-center mb-0 d-flex" data-cy="post-title">
              <Link href={postLinkHref}>
                <a className="text-primary">{post.title}</a>
              </Link>              
            </h6>
            {/* <div className="mb-5">
              <UnclampText isHTML text={post.contentText} clampHeight="5rem" showButtomMore={false} />
            </div> */}
          </div>
        )}
        {showSocialInteraction && post && (
          <Card.Footer className={`d-flex ${styles.footer}`}>
            <div className={` ${styles.commentsInfo}`}>
              <FaRegComments className="ms-1" />{' '}
              <span className="ms-1">
                {post.comments.length} {`${t('Replies')}`}
              </span>
            </div>

            <SocialInteraction
              cacheKey={cacheKey || ['POST',post.id.toString()]}
              showButtonLabels={false}
              showCounts={false}
              entity={post}
              parent={postParent}
              showRating={false}
              showTrash={false}
              className="ms-auto"
            />
          </Card.Footer>
        )}
      </Card>
    );
  };

  const renderHorizontalMosaic = (props: number[] = [3, 9]) => {
    // const [mdl = 3, mdr] = props;
    return (
      <section data-cy={`mosaic-item-post-${post.id}`}>
        <Row>
          <Col className='d-flex justify-content-center d-lg-block' xs={12} md={12} xl={4}>
            {renderVerticalMosaic({ showDetailedInfo: false, specifyDataCy:false })}
          </Col>
          <Col xs={12} md={12} xl={8}>
            <div className={styles.detailedInfo}>
              <h6 className="d-flex" data-cy="post-title">
                <Link href={postLinkHref}>
                  <a className="cursor-pointer text-secondary">
                    {post.title}
                  </a>
                </Link>
                <ActionsBar creatorId={post.creatorId} actions={{
                    edit:onEditPost,
                    editOnSmallScreen:onEditSmallScreen,
                  }}
                />
              </h6>
              <div className="d-none d-md-block mb-3">
                {(post.contentText.length < 500) ?
                <p>{post.contentText}</p> :                 
                <UnclampText isHTML showButtomMore text={post.contentText} clampHeight="15rem" />
                }
              </div>
              <div className="d-block d-md-none mb-3">
                {(post.contentText.length < 250) ?
                <p>{post.contentText}</p> :                 
                <UnclampText isHTML showButtomMore text={post.contentText} clampHeight="8rem" />
                }
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={12}>
            {showComments && <CommentsList entity={post} parent={postParent!} cacheKey={['POST',`${post.id}`]} />}
          </Col>
        </Row>
      </section>
    );
  };

  if (display === 'h') {
    return (
      <div className="mb-3">
        <section className={`d-none d-md-block p-2 border-gray-light ${styles.postHorizontally} ${className}`}>
          {renderHorizontalMosaic([4, 8])}
        </section>
        <section className={`p-2 d-sm-block d-md-none ${styles.postHorizontally} ${className}`}>
          {renderHorizontalMosaic([3, 9])}
        </section>
      </div>
    );
  }

  // if (display === 'h') {
  //   return (
  //     <Card className={`${styles.post} ${styles.postHorizontally}`}>
  //       <Row style={{ paddingTop: '1em' }}>
  //         <Col>
  //           {parent && (
  //             <h2 className={styles.parentTitle}>
  //               {parentLinkHref != null ? (
  //                 <Link href={parentLinkHref}>
  //                   <a>
  //                     <FaRegCompass /> <span>{getDirectParent()!.title}</span>
  //                   </a>
  //                 </Link>
  //               ) : (
  //                 <h2 className={styles.parentTitle}>
  //                   <FaRegCompass /> <span>{getDirectParent()!.title}</span>
  //                 </h2>
  //               )}
  //             </h2>
  //           )}
  //         </Col>
  //         <Col>
  //           <div style={{ textAlign: 'right', marginRight: '10px' }}>
  //             <span className={styles.type}>{t('post')}</span>
  //           </div>
  //         </Col>
  //       </Row>
  //       <Row>
  //         <Col md={5} xs={5}>
  //           <div className={styles.imageContainerHorizontally}>
  //             {parentLinkHref != null ? (
  //               <Link href={parentLinkHref}>
  //                 <a>
  //                   <LocalImageComponent
  //                     className={styles.postImage}
  //                     filePath={post.localImages[0]?.storedFile}
  //                     alt={post.title}
  //                   />

  //                 </a>
  //               </Link>
  //             ) : (
  //               <>
  //                 <LocalImageComponent
  //                   className={styles.postImage}
  //                   filePath={post.localImages[0]?.storedFile}
  //                   alt={post.title}
  //                 />

  //               </>
  //             )}
  //             <div className={styles.postDetail}>
  //               {post && (
  //                 <>
  //                   <Avatar user={post.creator} />
  //                   {` `}
  //                   {new Date(post.createdAt).toLocaleDateString()}
  //                 </>
  //               )}
  //             </div>
  //           </div>

  //         </Col>
  //         <Col md={7} xs={7} style={{ position: 'relative' }}>
  //           <Row>
  //             <Col md={12}>
  //               <h2 className={styles.mosaicTitle}>{post.title}</h2>
  //             </Col>
  //             <Col md={12} className="d-none d-lg-block">
  //               <div className="mb-5">
  //                 <UnclampText text={post.contentText} clampHeight="5rem" />
  //               </div>
  //             </Col>
  //           </Row>
  //           <Row className={styles.bottomRight}>
  //             <Col md={9}>
  //               <div className={styles.commentsInfo}>
  //                 <FaRegComments /> <span>{post.comments.length} Comments</span>
  //               </div>
  //             </Col>
  //             <Col md={3}>
  //               <SocialInteraction
  //                 cacheKey={cacheKey || undefined}
  //                 showButtonLabels={false}
  //                 showCounts={false}
  //                 showShare={false}
  //                 entity={post}
  //                 parent={parent}
  //                 showRating={false}
  //                 showTrash={false}
  //               />
  //             </Col>
  //           </Row>
  //         </Col>
  //       </Row>
  //       <Card.Footer className={styles.footer}>

  //         {showComments && <CommentsList entity={post} parent={parent} cacheKey={cacheKey} />}

  //       </Card.Footer>
  //     </Card>
  //   );
  // }
  return <>{renderVerticalMosaic({ showDetailedInfo: true })}</>;
};

export default MosaicItem;
