import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import DetailLayout from '../../components/layouts/DetailLayout';
import CycleDetail from '../../components/CycleDetail';
import { CycleObject, MosaicItem } from '../../types';
import { mosaicItems } from '../index';

interface Props {
  cycle: CycleObject;
}

const CycleDetailPage: FunctionComponent<Props> = ({ cycle }) => {
  return (
    <DetailLayout title={cycle.title}>
      <Row>
        <Col md={{ offset: 1, span: 11 }}>
          <CycleDetail cycle={cycle} />
        </Col>
      </Row>
    </DetailLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  if (id == null) {
    return { notFound: true }; // err 404
  }

  const cycle = mosaicItems.find((item: MosaicItem): boolean => item.kind === 'cycle' && item.id === id);
  if (cycle == null) {
    return { notFound: true };
  }

  return {
    props: { cycle },
  };
};

export default CycleDetailPage;
