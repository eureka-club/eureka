import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useQuery } from 'react-query';

import DetailLayout from '../components/layouts/DetailLayout';
import SimpleLayout from '../components/layouts/SimpleLayout';
import Mosaic from '../components/Mosaic';
import PostDetailComponent from '../components/PostDetail';
import { PostFullDetail, PostDetail } from '../models/Post';
import { isPostObject, MosaicItem } from '../types';
import { fetchIndexMosaic } from '../repositories/Post';
import xhrFetcher from '../lib/xhrFetcher';
import styles from './index.module.css';

const renderDetailedMosaicItem = (item: MosaicItem) => {
  if (isPostObject(item)) {
    return <PostDetailComponent post={item} />;
  }

  return '';
};

interface Props {
  posts: PostDetail[];
}

const IndexPage: NextPage<Props> = ({ posts }) => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedMosaicItem, setSelectedMosaicItem] = useState<MosaicItem>();
  const { data } = useQuery<{ post: PostFullDetail }>(`/api/post/${id}`, xhrFetcher, {
    enabled: id != null,
  });

  useEffect(() => {
    if (id != null) {
      const searchRes = posts.find((item: MosaicItem): boolean => item['post.id'] === id);
      if (searchRes != null) {
        setSelectedMosaicItem(searchRes);
      }
    } else {
      setSelectedMosaicItem(undefined);
    }
  }, [id, posts]);

  useEffect(() => {
    if (data != null) {
      setSelectedMosaicItem(data.post);
    }
  }, [data]);

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
        animation={false}
        show={selectedMosaicItem != null}
        onHide={handleModalClose}
        dialogClassName={styles.responsiveModal}
        backdropClassName={styles.lightOverlay}
        contentClassName={styles.borderlessModal}
      >
        <Modal.Body>
          {selectedMosaicItem != null && (
            <DetailLayout title={selectedMosaicItem['work.title']}>
              {renderDetailedMosaicItem(selectedMosaicItem)}
            </DetailLayout>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await fetchIndexMosaic();

  return {
    props: {
      posts,
    },
  };
};

export default IndexPage;
