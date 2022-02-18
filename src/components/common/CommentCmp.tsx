// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { useSession } from 'next-auth/client';
import { Row, Col, Card} from 'react-bootstrap';

import CommentTextBox from './CommentTextBox'
import CommentActionsBar from './CommentActionsBar';
import {
  CommentMosaicItem,
} from '@/src/types/comment';
import { Session } from '@/src/types';
import {v4} from 'uuid';
// import { useAtom } from 'jotai';
// import globalModalsAtom from '../../atoms/globalModals';

// import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import Avatar from './UserAvatar';
import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import { PostMosaicItem } from '@/src/types/post';

interface Props {
  comment: CommentMosaicItem;
  parent: CycleMosaicItem | WorkMosaicItem | PostMosaicItem | CommentMosaicItem;
  showCounts?: boolean;
  showShare?: boolean;
  showButtonLabels?: boolean;
  cacheKey?: string[];
  showTrash?: boolean;
  showRating?: boolean;
}

const CommentCmp: FunctionComponent<Props> = ({ comment, cacheKey, parent }) => {
  const { t } = useTranslation('common');
  // const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
 
  return (
    <>
      {
        /* !isLoading &&  */ comment && (
          <Card key={comment.id} className="mt-1 bg-white border-0">
            <Row className='d-flex justify-content-center' >
              <Col xs={2} md={1} className="d-flex justify-content-end p-1">
                <Avatar user={comment.creator} size="xs" showName={false} />
              </Col>
              <Col xs={10} md={11} className="d-flex flex-column">
                <CommentTextBox comment={ comment} />
                {/* {renderCommentActions()} */}<CommentActionsBar key={ v4()} entity={ comment} parent={parent} cacheKey={cacheKey||['COMMENT',`${comment.id}`]}/>
                {comment &&
                  comment.comments &&
                  comment.comments.map((commentChild) => (
                    <Row key={v4()} className="mb-2">
                      <Col md={1} xs={2} className="d-flex justify-content-end p-1">
                        <Avatar user={commentChild.creator} size="xs" showName={false} />
                      </Col>
                      <Col md={11} xs={10} className="d-flex flex-column">
                      <CommentTextBox comment={ commentChild} />    
                        {/* {renderCommentActions(commentChild)}                     */}
                        <CommentActionsBar key={ v4()} entity={commentChild as CommentMosaicItem} parent={parent} cacheKey={cacheKey||['COMMENT',`${comment.id}`]}/>
                      </Col>
                    </Row>
                  ))}
                {/* {getIsLoading() ? <Spinner animation="grow" variant="info" size="sm" /> : ''} */}
              </Col>
            </Row>
          </Card>
        )
      }
    </>
  );
};

export default CommentCmp;
