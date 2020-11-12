import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';

import DetailLayout from '../components/layouts/DetailLayout';
import SimpleLayout from '../components/layouts/SimpleLayout';
import Mosaic from '../components/Mosaic';
import PostDetail from '../components/PostDetail';
import { PostDbObject } from '../models/Post';
import { TABLE_NAME as LOCAL_IMAGE_TABLE_NAME } from '../models/LocalImage';
import { TABLE_NAME as USER_TABLE_NAME } from '../models/User';
import { TABLE_NAME as WORK_TABLE_NAME } from '../models/Work';
import { isPostObject, MosaicItem } from '../types';
import { findAll } from '../repositories/Post';
import styles from './index.module.css';

const renderDetailedMosaicItem = (item: MosaicItem) => {
  if (isPostObject(item)) {
    return <PostDetail post={item} />;
  }

  return '';
};

interface Props {
  posts: PostDbObject[];
}

const IndexPage: NextPage<Props> = ({ posts }) => {
  const [selectedMosaicItem, setSelectedMosaicItem] = useState<MosaicItem>();
  const router = useRouter();
  const {
    query: { id },
  } = router;

  useEffect(() => {
    if (id != null) {
      const searchRes = posts.find((item: MosaicItem): boolean => item['post.id'] === id);
      if (searchRes != null) {
        setSelectedMosaicItem(searchRes);
      }
    } else {
      setSelectedMosaicItem(undefined);
    }
  }, [id]);

  const handleModalClose = () => {
    setSelectedMosaicItem(undefined);
    router.push('/');
  };

  return (
    <>
      <SimpleLayout title="Welcome">
        <Mosaic stock={posts} />
      </SimpleLayout>

      <Modal
        show={selectedMosaicItem != null}
        onHide={handleModalClose}
        dialogClassName={styles.responsiveModal}
        backdropClassName={styles.lightOverlay}
        contentClassName={styles.borderlessModal}
      >
        <Modal.Body>
          {selectedMosaicItem != null && (
            <DetailLayout title={selectedMosaicItem['work.title']}>
              <Row>
                <Col md={{ offset: 1, span: 11 }}>{renderDetailedMosaicItem(selectedMosaicItem)}</Col>
              </Row>
            </DetailLayout>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await findAll([{ table: USER_TABLE_NAME, alias: 'creator' }, LOCAL_IMAGE_TABLE_NAME, WORK_TABLE_NAME], {
    'post.created_at': 'DESC',
  });

  return {
    props: {
      posts,
    },
  };
};

export default IndexPage;
