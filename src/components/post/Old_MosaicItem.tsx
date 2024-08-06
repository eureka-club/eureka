import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Card, Badge,Button } from 'react-bootstrap';
import { FaRegCompass } from 'react-icons/fa';
import dayjs from 'dayjs';
import { DATE_FORMAT_SHORT } from '../../constants';
import SocialInteraction from './SocialInteraction';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import { Session } from '../../types';
import Avatar from '../common/UserAvatar';
import { BiEdit} from 'react-icons/bi';
import usePostSumary from '@/src/usePostSumary';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/common/Spinner';
interface Props {
  postId: number|string;
  display?: 'v' | 'h';
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  showdetail?: boolean;
  style?: { [k: string]: string };
  cacheKey?: string[];
  showTrash?: boolean;
  showComments?: boolean;
  linkToPost?: boolean;
  className?: string;
}

const MosaicItem: FunctionComponent<Props> = ({
  postId,
  display = 'v',
  showSocialInteraction = true,
  showdetail = true,
  cacheKey:ck,
  showComments = false,
  linkToPost = true,
  className,
}) => {
  const cacheKey = ck || ['POST',`${postId}`]
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {data:session} = useSession()
  const {data:post} = usePostSumary(+postId,{
    enabled:!!postId
  })

  if(!post)return <></>

  const parentLinkHref = ((): string | null => {
    if (post.works.length) {
      return `/work/${post.works[0].id}`;
    }
    else if (post.cycles[0]) {
      return `/cycle/${post.cycles[0].id}`;
    }
    return null;
  })();
  const postLinkHref = ((): string => {
    if (post.works.length) {
      return `/work/${post.works[0].id}/post/${post.id}`;
    }
    else if (post.cycles.length) {
      return `/cycle/${post.cycles[0].id}/post/${post.id}`;
    }    
    return `/post/${post.id}`;
  })();

  const { /* title, localImages, id, */ type } = post;
 
  const canEditPost = ()=>{
    if(session)
      return post.creator.id == (session as unknown as Session).user.id
    return false;
  }
  const onEditPost = async (e:React.MouseEvent<HTMLButtonElement>) => {
    router.push(`/post/${post.id}/edit`)
  }

  const renderVerticalMosaic = (props: { showDetailedInfo: boolean,specifyDataCy?:boolean,commentSection?:boolean }) => {
    const { showDetailedInfo, specifyDataCy=true,commentSection=false } = props;

    const renderParentTitle = () => {
      let res = '';
      let full =''
      if (post.works.length) {
        full = post.works[0].title
        res = full.slice(0, 26);
      }
      else if(post.cycles.length){
        full = post.cycles[0].title
        res = full.slice(0, 26);
      }
      if (res.length + 3 < full.length) res = `${res}...`;
      else res = full;
      return res;
    };

    const canNavigate = () => {
      return !loading;
    };
    const onImgClick = () => {
      if (canNavigate()) router.push(postLinkHref);
      setLoading(true);
    };  

    const renderLocalImageComponent = () => {
      const img = post?.localImages 
        ? <><LocalImageComponent className={styles.postImage} filePath={post?.localImages[0].storedFile} alt={post?.title} />
            <div className={styles.gradient} /></>
        : undefined;
      if (linkToPost) {
        return (
          <div
            className={`${!loading ? 'cursor-pointer' : ''}`}
            onClick={onImgClick}
            role="presentation"
          >
            <LocalImageComponent
                  className={styles.postImage}
                  filePath={post.localImages[0]?.storedFile}
                  alt={post.title}
                />
                <div className={styles.gradient} />
            {!canNavigate() && <Spinner  />}
            {img}
          </div>
        );
      }
      return img;
    };

    return (
      <Card className={`${commentSection ? 'mosaic-post-comments' : 'mosaic'}  ${className}`} data-cy={specifyDataCy ? `mosaic-item-post-${post.id}`:''}>
        {(
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
        <div className={`${styles.imageContainer}`}>
          {renderLocalImageComponent()}
         
          {post && showdetail && (
          <div className={`w-100 d-flex flex-row align-items-center ${styles.postDetail}`}>
                <Avatar userId={post.creator.id!} name={post?.creator.name!} size="small" />
                <span className='ms-1 me-1'>-</span>
                <span className="fs-6">{dayjs(post.createdAt).format(DATE_FORMAT_SHORT)}</span>
                </div>
            )}


          <Badge bg="success" className={`fw-normal fs-6 text-white px-2 rounded-pill ${styles.type}`}>
            {t(type || 'post')}
          </Badge>
        </div>
        {showDetailedInfo && (
          <div className={`d-flex align-items-center justify-content-center ${styles.detailedInfo}`}>
            <h6 className="text-center d-flex" data-cy="post-title">
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
            {/* <div className={` ${styles.commentsInfo}`}>
              <FaRegComments className="ms-1" />{' '}
              <span className="ms-1">
                {post.comments.length} {`${t('Replies')}`}
              </span>
            </div> */}
            <SocialInteraction 
          post={post}
          cacheKey={cacheKey}
          />
            {/* <SocialInteraction
              cacheKey={cacheKey}
              showButtonLabels={false}
              showCounts={false}
              post={post}
              showRating={false}
              showTrash={false}
              className="ms-auto"
            /> */}
          </Card.Footer>
        )}
        {canEditPost() && <section className="position-absolute top-0 end-0">
          <Button onClick={onEditPost} className="p-0 text-danger" size='sm' variant='link'><BiEdit/></Button>
        </section>}
      </Card>
    );
  };

  const renderHorizontalMosaic = (props: number[] = [3, 9]) => {
    // const [mdl = 3, mdr] = props;
    return (
      <section data-cy={`mosaic-item-post-${post.id}`}>
        <Row>
          <Col className='d-flex justify-content-center d-lg-block' xs={12} md={12} xl={4}>
            {renderVerticalMosaic({ showDetailedInfo: false, specifyDataCy:false, commentSection:true })}
          </Col>
          <Col xs={12} md={12} xl={8}>
            <div className={styles.detailedInfo}>
              <h6 className="d-flex" data-cy="post-title">
                <Link href={postLinkHref}>
                  <a className="cursor-pointer text-secondary">
                    {post.title}
                  </a>
                </Link>
                {/* <ActionsBar creatorId={post.creatorId} actions={{
                    edit:onEditPost,
                    editOnSmallScreen:onEditSmallScreen,
                  }}
                /> */}
              </h6>
              <div className="d-none d-md-block mb-3">
                {(post.contentText.length < 800) ?
                // <p>{post.contentText}</p> :
                  <div dangerouslySetInnerHTML={{ __html: post.contentText }} />   :   
                  <div dangerouslySetInnerHTML={{ __html: post.contentText.slice(0,755)+' ...' }} />
                //  <UnclampText isHTML showButtomMore text={post.contentText} clampHeight="15rem" />
                } 
              </div>
              <div className="d-block d-md-none mb-3">
                {(post.contentText.length < 150) ?
                // <p>{post.contentText}</p> :
                <div dangerouslySetInnerHTML={{ __html: post.contentText }} />  :  
                <div dangerouslySetInnerHTML={{ __html: post.contentText.slice(0,145)+' ...' }} />            
                //  <UnclampText isHTML showButtomMore text={post.contentText} clampHeight="8rem" />
                } 
              </div>
            </div>
          </Col>
        </Row>
        {/* <Row>
          <Col md={12} xs={12}>
            {showComments && <CommentsList entity={post} parent={postParent!} cacheKey={['POST',`${post.id}`]} />}
          </Col>
        </Row> */}
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
