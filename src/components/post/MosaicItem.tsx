import { Cycle, Work } from '@prisma/client';
// import classNames from 'classnames';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
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

interface Props {
  post: PostMosaicItem;
  postParent?: Cycle | Work;
  display?: 'v' | 'h';

  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  style?: { [k: string]: string };
  cacheKey?: string[];
  showTrash?: boolean;
  showComments?: boolean;
  className?: string;
}

const MosaicItem: FunctionComponent<Props> = ({
  post,
  postParent,
  display = 'v',
  showSocialInteraction = true,
  cacheKey,
  showComments = false,
  className,
  // showButtonLabels,
  // showShare,
  // style,
  // showTrash,
}) => {
  const postParentLinkHref = ((): string | null => {
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
  const { t } = useTranslation('common');

  // const getDirectParent = () => {
  //   if (post.works && post.works.length) return post.works[0];
  //   return postParent;
  // };

  const renderVerticalMosaic = (props: { showDetailedInfo: boolean }) => {
    const { showDetailedInfo } = props;

    const renderParentTitle = () => {
      let res = '';
      if (postParent) {
        const pptt = postParent.title.slice(0, 31);
        if (pptt.length + 3 < postParent.title.length) res = `${pptt}...`;
        else res = postParent.title;
      }
      return <span>{res}</span>;
    };
    return (
      <Card className={`${styles.container} ${className}`}>
        {postParent && (
          <h2 className="m-0 p-1 fs-6 text-info">
            <FaRegCompass className="text-info" />
            {` `}
            {postParentLinkHref != null ? (
              <Link href={postParentLinkHref}>
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
          {postParentLinkHref != null ? (
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
          <div className={`w-100 text-left ${styles.postDetail}`}>
            {post && (
              <>
                <Avatar user={post.creator} size="xs" />
                {` - `}
                <span className="fs-6">{dayjs(post.createdAt).format(DATE_FORMAT_SHORT)}</span>
              </>
            )}
          </div>
          <Badge variant="success" className={`fw-normal fs-6 text-white rounded-pill ${styles.type}`}>
            {t(type || 'post')}
          </Badge>
        </div>
        {showDetailedInfo && (
          <div className={`d-flex align-items-center justify-content-center ${styles.detailedInfo}`}>
            <h6 className="text-center mb-0">
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
              <FaRegComments className="ml-1" />{' '}
              <span className="ml-1">
                {post.comments.length} {`${t('Replies')}`}
              </span>
            </div>

            <SocialInteraction
              cacheKey={cacheKey || undefined}
              showButtonLabels={false}
              showCounts={false}
              entity={post}
              parent={postParent}
              showRating={false}
              showTrash={false}
              className="ml-auto"
            />
          </Card.Footer>
        )}
      </Card>
    );
  };

  const renderHorizontalMosaic = (props: number[] = [3, 9]) => {
    const [mdl = 3, mdr] = props;
    return (
      <>
        <Row>
          <Col xs={12} md={mdl}>
            {renderVerticalMosaic({ showDetailedInfo: false })}
          </Col>
          <Col xs={12} md={mdr}>
            <div className={styles.detailedInfo}>
              <h6 className="">
                <Link href={postLinkHref}>
                  <a style={{ cursor: 'pointer' }} className="text-secondary text-decoration-underline">
                    {post.title}
                  </a>
                </Link>
              </h6>
              <div className="mb-5">
                {/* <div className="fs-6" dangerouslySetInnerHTML={{ __html: post.contentText }} /> */}
                <UnclampText isHTML showButtomMore text={post.contentText} clampHeight="10rem" />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={12}>
            {showComments && <CommentsList entity={post} parent={postParent} cacheKey={cacheKey} />}
          </Col>
        </Row>
      </>
    );
  };

  if (display === 'h') {
    return (
      <div className="d-flex justify-content-center mb-3">
        <section className={`w-75 d-none d-md-block p-2 border-gray-light ${styles.postHorizontally} ${className}`}>
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
  //           {postParent && (
  //             <h2 className={styles.postParentTitle}>
  //               {postParentLinkHref != null ? (
  //                 <Link href={postParentLinkHref}>
  //                   <a>
  //                     <FaRegCompass /> <span>{getDirectParent()!.title}</span>
  //                   </a>
  //                 </Link>
  //               ) : (
  //                 <h2 className={styles.postParentTitle}>
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
  //             {postParentLinkHref != null ? (
  //               <Link href={postParentLinkHref}>
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
  //                 parent={postParent}
  //                 showRating={false}
  //                 showTrash={false}
  //               />
  //             </Col>
  //           </Row>
  //         </Col>
  //       </Row>
  //       <Card.Footer className={styles.footer}>

  //         {showComments && <CommentsList entity={post} parent={postParent} cacheKey={cacheKey} />}

  //       </Card.Footer>
  //     </Card>
  //   );
  // }
  return <>{renderVerticalMosaic({ showDetailedInfo: true })}</>;
};

export default MosaicItem;
