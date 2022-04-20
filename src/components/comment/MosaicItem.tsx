import { Cycle, Work, Comment, Post } from '@prisma/client';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent,useEffect,useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaRegComments, FaRegCompass } from 'react-icons/fa';

import { MdReply } from 'react-icons/md';
import dayjs from 'dayjs';

import { DATE_FORMAT_SHORT } from '../../constants';
// import { useSession } from 'next-auth/react';
// import SocialInteraction from '../common/SocialInteraction';
import { CommentMosaicItem } from '../../types/comment';
import CommentActionsBar from '../common/CommentActionsBar';
// import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import CommentTextBox from '@/src/components/common/CommentTextBox';
// import UnclampText from '../UnclampText';
import { isCycle, isPost, isWork, /*isPost, isComment  , Session */ } from '../../types';
// import { CycleMosaicItem } from '../../types/cycle';
// import { WorkMosaicItem } from '../../types/work';

import Avatar from '../common/UserAvatar';
import CommentsList from '../common/CommentsList';
import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import { PostMosaicItem } from '@/src/types/post';
import useComment from '@/src/useComment'
import CyclesMosaic from '../work/CyclesMosaic';
interface Props {
  commentId: number;
  // parent: CycleMosaicItem | WorkMosaicItem | PostMosaicItem | CommentMosaicItem;
  detailed?: boolean; 
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  style?: { [k: string]: string };
  cacheKey: string[];
  showTrash?: boolean;
  showComments?: boolean;
  className?: string;
}

const MosaicItem: FunctionComponent<Props> = ({
  commentId,
  // parent,
  detailed = false,
  cacheKey,
  showComments = true,
  className,
  // showButtonLabels,
  // showShare,
  // showSocialInteraction = true,
  // style,
  // showTrash,
}) => {
  // const commentLinkHref = ((): string | null => {
  //   if (isCycle(parent)) {
  //     return `/comment/${parent.id}`;
  //   }
  //   if (isCycle(parent)) {
  //     return `/cycle/${parent.id}/post/${post.id}`;
  //   }
  //   if (isWork(parent)) {
  //     return `/work/${parent.id}/post/${post.id}`;
  //   }

  //   return null;
  // })();
  const { t } = useTranslation('common');
  const [parent,setParent] = useState<CycleMosaicItem|WorkMosaicItem|PostMosaicItem|CommentMosaicItem>()
  const {data:comment} = useComment(commentId,{
    enabled:!!commentId
  })
  useEffect(()=>{
    if(comment){
      // if(comment.commentId)setParent(comment.comment)
      if(comment.post)setParent(comment.post as unknown as PostMosaicItem)
      else if(comment.work)setParent(comment.work as unknown as WorkMosaicItem)
      else if(comment.cycle)setParent(comment.cycle as unknown as CycleMosaicItem)
    }
  },[comment])
  if(!comment)
    return <></>

 
  const getTitle = (): string => {
    if(parent){
      if (isCycle(parent)) return (parent as Cycle).title;
      else if (isWork(parent)) return (parent as Work).title;
      else if (isPost(parent)) return (parent as Post).title;

    }
    // if (isComment(parent)) return `Comment: ${parent.id}`;
    return '';
  };

  const comentLinkHref = ((): string | null => {
    if (!parent) return null;
    // if (isPost(parent)) {
    //   // return `/post/${parent.id}`;
    if (comment.work) {
      return `/work/${parent.id}`;
    }
    // }
    else if (comment.cycle) {
      return `/cycle/${parent.id}`;
    }
    return null;
  })();
  // const [session] = useSession() as [Session | null | undefined, boolean];
  const renderCardDetailed = () => {
    return (
        <Card className={` ${styles.commentHorizontally}`} data-cy={`mosaic-item-comment-${comment.id}`}>
          <Card.Header as={Row} className={styles.cardHeader}>
            <Col xs={12} md={6}>
              {parent && (
                <h2 className="fs-6" data-cy="parent-title">
                  {comentLinkHref != null ? (
                    <>
                      <FaRegCompass className="text-info" />{' '}
                      <Link href={comentLinkHref}>
                        <a className="text-info">
                          <span>{getTitle()}</span>
                        </a>
                      </Link>
                    </>
                  ) : (
                    <h2 className="fs-6" data-cy="parent-title">
                      <FaRegCompass className="text-primary" /> <span>{getTitle()}</span>
                    </h2>
                  )}
                </h2>
              )}
            </Col>
            <Col xs={12} md={6}> 
              <div className="text-end">
                <Avatar width={28} height={28} userId={comment.creator.id} size="xs" />
                {` - `}
                <span className="fs-6">{dayjs(comment.createdAt).format(DATE_FORMAT_SHORT)}</span>
              </div>
              <div className="text-end fs-6">
                <FaRegComments className="text-primary" />{' '}
                <span>
                  {comment.comments.length} {t('Replies')}{' '}
                </span>
              </div>
            </Col>
          </Card.Header>
          <Card.Body className="pt-0 pb-2">
            <Row>
              <Col>
                <aside className="pt-3 mb-0">
                  <CommentTextBox comment={ comment} />
                </aside>
              </Col>
            </Row>
            {/* {showComments && <CommentsList entity={comment} parent={parent} cacheKey={cacheKey || ['COMMENT',`${comment.id}`]} />} */}
          </Card.Body>          
        </Card>
    );
  };
  if (detailed)
    return (
      <div className={` ${className}`}>
        <section className="d-none d-md-block">{renderCardDetailed()}</section>
        <section className="d-sm-block d-md-none mb-3">{renderCardDetailed()}</section>
      </div>
    );

  const renderCard = () => {
    return (
      <Card className={`mt-3 ${styles.container} ${className}`} data-cy={`mosaic-item-comment-${comment.id}`}>
        <Row>
          <Col xs={2} md={1} className="pe-1">
            <Avatar width={28} height={28} userId={comment.creator.id} showName={false} />
          </Col>
          <Col xs={10} md={11} className="ps-1">
            <div className={styles.dangerouslySetInnerHTML} dangerouslySetInnerHTML={{ __html: comment.contentText }} />
            <Button variant="default" className={styles.replyButton}>
              <MdReply />
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };

  return <>{renderCard()}</>;
};

export default MosaicItem;
