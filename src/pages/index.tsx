import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';

import { DATE_FORMAT_PROPS } from '../constants';
import SimpleLayout from '../components/layouts/SimpleLayout';
import Mosaic from '../components/Mosaic';
import { PostDetail } from '../types';
import { fetchIndexMosaic } from '../repositories/Post';

interface Props {
  posts: PostDetail[];
}

const IndexPage: NextPage<Props> = ({ posts }) => {
  return (
    <SimpleLayout title="Welcome">
      <Mosaic stack={posts} />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await fetchIndexMosaic();
  const serializablePosts = posts.map((post) => {
    return {
      ...post,
      ...(post['cycle.start_date'] != null && {
        'cycle.start_date': dayjs(post['cycle.start_date']).format(DATE_FORMAT_PROPS),
      }),
      ...(post['cycle.end_date'] != null && {
        'cycle.end_date': dayjs(post['cycle.start_date']).format(DATE_FORMAT_PROPS),
      }),
    };
  });

  return {
    props: {
      posts: serializablePosts,
    },
  };
};

export default IndexPage;
