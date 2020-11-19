import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import DetailLayout from '../../components/layouts/DetailLayout';
import CycleDetailComponent from '../../components/CycleDetail';
import { CycleFullDetail } from '../../types';
import { fetchCycleDetail } from '../../repositories/Cycle';

interface Props {
  cycle: CycleFullDetail;
}

const PostDetailPage: FunctionComponent<Props> = ({ cycle }) => {
  return (
    <DetailLayout title={cycle['cycle.title']}>
      <CycleDetailComponent cycle={cycle} />
    </DetailLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  if (id == null || typeof id !== 'string') {
    return { notFound: true }; // err 404
  }

  const cycle: CycleFullDetail = await fetchCycleDetail(id);
  if (cycle == null) {
    return { notFound: true };
  }
  const cycleForProps = {
    ...cycle,
    'cycle.start_date': dayjs(cycle['cycle.start_date']).format('YYYY-MM-DD'),
    'cycle.end_date': dayjs(cycle['cycle.end_date']).format('YYYY-MM-DD'),
  };

  return {
    props: {
      cycle: cycleForProps,
    },
  };
};

export default PostDetailPage;
