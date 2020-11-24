import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_PROPS } from '../../constants';
import { LocalImageDbObject } from '../../models/LocalImage';
import { CreatorDbObject } from '../../models/User';
import { WorkDbObject } from '../../models/Work';
import { CycleDetail, MosaicItem } from '../../types';
import DetailLayout from '../../components/layouts/DetailLayout';
import CycleDetailComponent from '../../components/CycleDetail';
import Mosaic from '../../components/Mosaic';
import { fetchCycleDetail, fetchCycleWorks } from '../../repositories/Cycle';
import { fetchCyclePosts } from '../../repositories/Post';

interface Props {
  cycle: CycleDetail;
  cycleContent: (WorkDbObject & LocalImageDbObject)[];
  cyclePosts: (MosaicItem & CreatorDbObject)[];
}

const PostDetailPage: FunctionComponent<Props> = ({ cycle, cycleContent }) => {
  return (
    <DetailLayout title={cycle['cycle.title']}>
      <CycleDetailComponent cycle={cycle} cycleContent={cycleContent} />
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
