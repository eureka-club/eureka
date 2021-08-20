import classNames from 'classnames';
import dayjs from 'dayjs';
import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';

import {
  Spinner,
  Button,
  ButtonProps,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Form,
} from 'react-bootstrap';

import Link from 'next/link';

import { Work } from '@prisma/client';

import { BsPlusCircleFill, BsCheck } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

import { truncate } from 'lodash';
import globalModalsAtom from '../../atoms/globalModals';

import { Session } from '../../types';
import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { CycleDetail } from '../../types/cycle';
import { PostDetail, PostMosaicItem } from '../../types/post';
import { WorkDetail, WorkMosaicItem } from '../../types/work';

import HyvorComments from '../common/HyvorComments';
import UserAvatar from '../common/UserAvatar';
import ImageFileSelect from '../forms/controls/ImageFileSelect';
import TagsInputTypeAhead from '../forms/controls/TagsInputTypeAhead';
import stylesImageFileSelect from '../forms/CreatePostForm.module.css';
import useTopics from '../../useTopics';

import detailPagesAtom from '../../atoms/detailPages';
import styles from './CycleDetailDiscussion.module.css';

import globalSearchEngineAtom from '../../atoms/searchEngine';

interface Props {
  cycle: CycleDetail;
}

const CycleDetailDiscussion: FunctionComponent<Props> = ({ cycle }) => {
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  const hyvorId = `${WEBAPP_URL}cycle/${cycle.id}`;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: topics } = useTopics();
  const [items, setItems] = useState<string[]>([]);

  const getWorksOpt = () => {
    return cycle.works.map((w) => {
      return <option key={w.id}>{w.title}</option>;
    });
  };

  const [isCreateEureka, setIsCreateEureka] = useState<boolean>(false);
  const [isCreateComment, setIsCreateComment] = useState<boolean>(false);
  const [isCreateRelatedWork, setIsCreateRelatedWork] = useState<boolean>(false);

  const handleCreateEurekaClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsCreateRelatedWork(false);
    setIsCreateComment(false);
    setIsCreateEureka(true);
    // setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
  };
  const handleCreateCommentClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsCreateRelatedWork(false);
    setIsCreateComment(true);
    setIsCreateEureka(false);
    // setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: true } });
  };
  const handleCreateRelatedWorkClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsCreateRelatedWork(true);
    setIsCreateComment(false);
    setIsCreateEureka(false);
    // setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: true } });
  };

  return (
    <>
      {cycle && (
        <div className={styles.container}>
          {' '}
          <Row className={styles.discussionContainer}>
            <Col xs={12} md={1}>
              {cycle.creator && <UserAvatar user={cycle.creator} />}
            </Col>
            <Col xs={12} md={11}>
              <Form>
                <Form.Group controlId="discussionItem">
                  <Form.Control as="select" className={styles.discussionItem}>
                    <option>{t('Cycle itself')}</option>
                    {getWorksOpt()}
                  </Form.Control>
                </Form.Group>
              </Form>
              <ButtonGroup as={Row} className={styles.optButtons} size="lg">
                <Button
                  onClick={handleCreateEurekaClick}
                  as={Col}
                  xs={12}
                  md={4}
                  className={`${styles.optButton} ${styles.eurekaBtn} ${isCreateEureka && styles.optButtonActive}`}
                >
                  <BsPlusCircleFill className={styles.optButtonIcon} />
                  Create an Eureka
                </Button>
                <Button
                  onClick={handleCreateCommentClick}
                  as={Col}
                  xs={12}
                  md={4}
                  className={`${styles.optButton} ${styles.commentBtn} ${isCreateComment && styles.optButtonActive}`}
                >
                  <BsPlusCircleFill className={styles.optButtonIcon} /> Add a quick comment
                </Button>
                <Button
                  onClick={handleCreateRelatedWorkClick}
                  as={Col}
                  xs={12}
                  md={4}
                  className={`${styles.optButton} ${styles.relatedWorkBtn} ${
                    isCreateRelatedWork && styles.optButtonActive
                  }`}
                >
                  <BsPlusCircleFill className={styles.optButtonIcon} /> Suggest a related work
                </Button>
              </ButtonGroup>
              {isCreateEureka && (
                <div className="mt-3">
                  <Form>
                    <Form.Group controlId="postTitle">
                      <Form.Control type="text" maxLength={80} required placeholder="Title" />
                    </Form.Group>

                    <Form.Group>
                      <Form.Control as="textarea" rows={3} required placeholder="Text" />
                    </Form.Group>

                    <ImageFileSelect acceptedFileTypes="image/*" file={imageFile} setFile={setImageFile} required>
                      {(imagePreview) => (
                        <Form.Group>
                          {/* <Form.Label>*{t('imageFieldLabel')}</Form.Label> */}
                          <div className={stylesImageFileSelect.imageControl}>
                            {imageFile != null && imagePreview ? (
                              <span className={stylesImageFileSelect.imageName}>{imageFile?.name}</span>
                            ) : (
                              t('Image')
                            )}
                            {imagePreview && <img src={imagePreview} className="float-right" alt="Work cover" />}
                          </div>
                        </Form.Group>
                      )}
                    </ImageFileSelect>
                    <Row>
                      <Col xs={ 12} md={8}>
                        <Form.Group controlId="topics">
                          {/* <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel> */}
                          <TagsInputTypeAhead
                            style={{ background: 'white' }}
                            data={topics}
                            items={items}
                            setItems={setItems}
                            labelKey={(res: { code: string }) => t(`topics:${res.code}`)}
                            max={3}
                            placeholder={`${t('Type to add tag')}...`}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={ 4}>
                        <ButtonGroup size="sm">
                          <Button variant="secondary">
                            <ImCancelCircle />
                          </Button>
                          <Button>
                            <BsCheck />
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
              {isCreateComment && <div>comments</div>}
              {isCreateRelatedWork && <div>related works</div>}
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default CycleDetailDiscussion;
