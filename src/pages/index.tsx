import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';

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
    if (post['cycle.id'] != null) {
      return {
        ...post,
        ...{
          'cycle.start_date': dayjs(post['cycle.start_date']).format('YYYY-MM-DD'),
          'cycle.end_date': dayjs(post['cycle.end_date']).format('YYYY-MM-DD'),
        },
      };
    }

    return post;
  });

  return {
    props: {
      posts: serializablePosts,
    },
  };
};

export default IndexPage;
