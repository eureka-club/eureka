import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_PROPS } from '../../src/constants';
import { LocalImageDbObject } from '../../src/models/LocalImage';
import { CreatorDbObject } from '../../src/models/User';
import { WorkDbObject } from '../../src/models/Work';
import { CycleDetail, CyclePoster, MosaicItem } from '../../src/types';
import DetailLayout from '../../src/components/layouts/DetailLayout';
import CycleDetailComponent from '../../src/components/CycleDetail';
import Mosaic from '../../src/components/Mosaic';
import { fetchCycleDetail, fetchCycleWorks } from '../../src/repositories/Cycle';
import { fetchCyclePosts } from '../../src/repositories/Post';

interface Props {
  cycle: CycleDetail;
  cycleContent: (WorkDbObject & LocalImageDbObject)[];
  cyclePosts: (MosaicItem & CreatorDbObject)[];
}

const PostDetailPage: FunctionComponent<Props> = ({ cycle, cycleContent, cyclePosts }) => {
  const cyclePosters = cyclePosts.reduce<CyclePoster[]>((memo, post: MosaicItem & CreatorDbObject) => {
    const alreadyAddedPoster = memo.find((poster) => poster.name === post['creator.name']);
    if (alreadyAddedPoster == null) {
      memo.push({ name: post['creator.name'], image: post['creator.image'] });
    }

    return memo;
  }, []);

  return (
    <DetailLayout title={cycle['cycle.title']}>
      <CycleDetailComponent cycle={cycle} cycleContent={cycleContent} cyclePosters={cyclePosters} />
      <Mosaic stack={cyclePosts} />
    </DetailLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  if (id == null || typeof id !== 'string') {
    return { notFound: true }; // err 404
  }

  const cycle: CycleDetail = await fetchCycleDetail(id);
  if (cycle == null) {
    return { notFound: true };
  }
  const cycleForProps = {
    ...cycle,
    'cycle.start_date': dayjs(cycle['cycle.start_date']).format(DATE_FORMAT_PROPS),
    'cycle.end_date': dayjs(cycle['cycle.end_date']).format(DATE_FORMAT_PROPS),
  };

  const cycleContent = await fetchCycleWorks(id);
  const cyclePosts = await fetchCyclePosts(id);

  return {
    props: {
      cycle: cycleForProps,
      cycleContent,
      cyclePosts,
    },
  };
};

export default PostDetailPage;
