import { Cycle, Work } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaRegComments, FaRegCompass } from 'react-icons/fa';

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
}

const MosaicItem: FunctionComponent<Props> = ({
  post,
  postParent,
  display = 'v',
  showSocialInteraction = true,
  cacheKey,
  showComments = false,

  // showButtonLabels,
  // showShare,
  // style,
  // showTrash,
}) => {
  const postLinkHref = ((): string | null => {
    if (postParent == null) {
      return `/post/${post.id}`;
    }
    if (isCycle(postParent)) {
      return `/cycle/${postParent.id}/post/${post.id}`;
    }
    if (isWork(postParent)) {
      return `/work/${postParent.id}/post/${post.id}`;
    }

    return null;
  })();
  // const [creator] = useState(post.creator as User);
  const { /* title, localImages, id, */ type } = post;
  // const [newCommentInput, setNewCommentInput] = useState<string>();
  const { t } = useTranslation('common');

  const getDirectParent = () => {
    if (post.works && post.works.length) return post.works[0];
    return postParent;
  };

  const renderVerticalMosaic = (props: { showDetailedInfo: boolean }) => {
    const { showDetailedInfo } = props;
    return (
      <Card className={classNames(styles.container)}>
        {postParent && (
          <h2 className={styles.postParentTitle}>
            {postLinkHref != null ? (
              <Link href={postLinkHref}>
                <a>
                  <FaRegCompass /> <span>{postParent.title}</span>
                </a>
              </Link>
            ) : (
              <h2 className={styles.postParentTitle}>
                <FaRegCompass /> <span>{postParent.title}</span>
              </h2>
            )}
          </h2>
        )}
        <div className={`${styles.imageContainer} ${styles.detailedImageContainer}`}>
          {postLinkHref != null ? (
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
          <div className={styles.postDetail}>
            {post && (
              <>
                <Avatar user={post.creator} size="xs" />
                {` `}
                {new Date(post.createdAt).toLocaleDateString()}
              </>
            )}
          </div>
          <span className={styles.type}>{t(type || 'post')}</span>
        </div>
        {showDetailedInfo && (
          <div className={styles.detailedInfo}>
            <h5>{post.title}</h5>(
            <div className="mb-5">
              <div className={styles.dangerouslySetInnerHTML} dangerouslySetInnerHTML={{ __html: post.contentText }} />
              {/* <UnclampText text={post.contentText} clampHeight="5rem" showButtomMore={false} /> */}
            </div>
            )
          </div>
        )}
        {showSocialInteraction && post && (
          <Card.Footer className={`d-flex ${styles.footer}`}>
            <div className={` ${styles.commentsInfo}`}>
              <FaRegComments className="ml-1" /> <span className="ml-1">{post.comments.length} Comments</span>
            </div>

            <SocialInteraction
              cacheKey={cacheKey || undefined}
              showButtonLabels={false}
              showCounts={false}
              showShare={false}
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

  if (display === 'h') {
    return (
      <section className={`p-2 ${styles.postHorizontally}`}>
        <Row>
          <Col xs={12} md={4}>
            {renderVerticalMosaic({ showDetailedInfo: false })}
          </Col>
          <Col xs={12} md={8}>
            <div className={styles.detailedInfo}>
              <h5 className={styles.postTitle}>{post.title}</h5>
              <div className="mb-5">
                <div
                  className={styles.dangerouslySetInnerHTML}
                  dangerouslySetInnerHTML={{ __html: post.contentText }}
                />
                {/* <UnclampText text={post.contentText} clampHeight="5rem" showButtomMore={false} /> */}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={12}>
            {showComments && <CommentsList entity={post} parent={postParent} cacheKey={cacheKey} />}
          </Col>
        </Row>
      </section>
    );
  }

  // if (display === 'h') {
  //   return (
  //     <Card className={`${styles.post} ${styles.postHorizontally}`}>
  //       <Row style={{ paddingTop: '1em' }}>
  //         <Col>
  //           {postParent && (
  //             <h2 className={styles.postParentTitle}>
  //               {postLinkHref != null ? (
  //                 <Link href={postLinkHref}>
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
  //             {postLinkHref != null ? (
  //               <Link href={postLinkHref}>
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
