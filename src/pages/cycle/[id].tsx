import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import DetailLayout from '../../components/layouts/DetailLayout';
import CycleDetailComponent from '../../components/CycleDetail';
import { CycleDetail } from '../../types';
import { fetchCycleDetail, fetchCycleWorks } from '../../repositories/Cycle';

interface Props {
  cycle: CycleDetail;
  cycleContent: Record<string, string>[];
}

const PostDetailPage: FunctionComponent<Props> = ({ cycle, cycleContent }) => {
  return (
    <DetailLayout title={cycle['cycle.title']}>
      <CycleDetailComponent cycle={cycle} cycleContent={cycleContent} />
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
    'cycle.start_date': dayjs(cycle['cycle.start_date']).format('YYYY-MM-DD'),
    'cycle.end_date': dayjs(cycle['cycle.end_date']).format('YYYY-MM-DD'),
  };

  const cycleContent = await fetchCycleWorks(id);

  return {
    props: {
      cycle: cycleForProps,
      cycleContent,
    },
  };
};

export default PostDetailPage;
