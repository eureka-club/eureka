import { Cycle, Work, Comment, Post } from '@prisma/client';

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaRegComments } from 'react-icons/fa';
import { BsJustifyLeft } from 'react-icons/bs';
import { MdReply } from 'react-icons/md';

import { useSession } from 'next-auth/client';
// import SocialInteraction from '../common/SocialInteraction';
import { CommentMosaicItem } from '../../types/comment';
// import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import { isCycle, isWork, isPost, isComment, Session } from '../../types';
// import { CycleMosaicItem } from '../../types/cycle';
// import { WorkMosaicItem } from '../../types/work';
// import { useUsers } from '../../useUsers';

import Avatar from '../common/UserAvatar';
import CommentsList from '../common/CommentsList';

interface Props {
  comment: CommentMosaicItem;
  commentParent: Cycle | Work | Comment | Post;
  detailed?: boolean;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  style?: { [k: string]: string };
  cacheKey?: string[];
  showTrash?: boolean;
  showComments?: boolean;
}

const MosaicItem: FunctionComponent<Props> = ({
  comment,
  commentParent,
  detailed = false,
  showButtonLabels,
  showShare,
  showSocialInteraction = true,
  style,
  cacheKey,
  showTrash,
  showComments = true,
}) => {
  // const commentLinkHref = ((): string | null => {
  //   if (isCycle(commentParent)) {
  //     return `/comment/${commentParent.id}`;
  //   }
  //   if (isCycle(commentParent)) {
  //     return `/cycle/${commentParent.id}/post/${post.id}`;
  //   }
  //   if (isWork(commentParent)) {
  //     return `/work/${commentParent.id}/post/${post.id}`;
  //   }

  //   return null;
  // })();

  // const { data: creator } = useUsers(comment.creatorId.toString());
  const { contentText, id } = comment;
  const { t } = useTranslation('common');
  const getTitle = (): string => {
    if (isWork(commentParent)) return (commentParent as Work).title;
    if (isCycle(commentParent)) return (commentParent as Cycle).title;
    if (isComment(commentParent)) return `Comment: ${commentParent.id}`;
    return '';
  };

  const comentLinkHref = ((): string | null => {
    if (!commentParent) return null;
    if (isPost(commentParent)) {
      // return `/post/${commentParent.id}`;
    }
    if (isCycle(commentParent)) {
      return `/cycle/${commentParent.id}`;
    }
    if (isWork(commentParent)) {
      return `/work/${commentParent.id}`;
    }
    return null;
  })();

  const [session] = useSession() as [Session | null | undefined, boolean];

  if (detailed)
    return (
      <Card className={`${styles.post} ${styles.commentHorizontally}`}>
        <Card.Header className={styles.cardHeader}>
          {commentParent && (
            <h2 className={styles.commentParentTitle}>
              {comentLinkHref != null ? (
                <Link href={comentLinkHref}>
                  <a>
                    <BsJustifyLeft /> <span>{getTitle()}</span>
                  </a>
                </Link>
              ) : (
                <h2 className={styles.commentParentTitle}>
                  <BsJustifyLeft /> <span>{getTitle()}</span>
                </h2>
              )}
            </h2>
          )}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={5} xs={5}>
              <div className={styles.dangerouslySetInnerHTML} dangerouslySetInnerHTML={{ __html: contentText }} />
            </Col>
          </Row>
          <Row className={styles.bottomRight}>
            <Col md={3}>
              <Avatar user={comment.creator} size="xs" />
            </Col>
            <Col md={9} className={styles.commentsInfoContainer}>
              <div className={styles.commentsInfo}>
                <FaRegComments /> <span>{comment.comments.length} Comments</span>
              </div>
            </Col>
          </Row>
          {showComments && <CommentsList entity={comment} parent={commentParent} cacheKey={cacheKey} />}
        </Card.Body>
        <Card.Footer className={styles.footer}>
          {showComments && <Button variant="default">View more comments</Button>}
        </Card.Footer>
      </Card>
    );

  return (
    <Card className={`mt-3 ${styles.container}`}>
      {/* <Card.Header>Created by: {creator.name}</Card.Header> */}

      <Row>
        <Col xs={2} md={1} className="pr-1">
          <Avatar user={comment.creator} size="xs" showName={false} />
        </Col>
        <Col xs={10} md={11} className="pl-1">
          <div className={styles.dangerouslySetInnerHTML} dangerouslySetInnerHTML={{ __html: contentText }} />
          <Button variant="default" onClick={() => console.log(comment)} className={styles.replyButton}>
            <MdReply />
          </Button>
        </Col>
      </Row>
      {/* 
      <InputGroup className="mt-2">
        
        {creator && <Avatar user={creator} size="xs" showName={false} />}
        
        
          <div className={styles.dangerouslySetInnerHTML} dangerouslySetInnerHTML={{ __html: contentText }} />
          <Button onClick={() => console.log(comment)}>Reply</Button>
        
      </InputGroup> */}
    </Card>
  );
};

export default MosaicItem;
