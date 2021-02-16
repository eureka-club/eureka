import { flatten, zip } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';

import { CycleMosaicItem } from '../src/types/cycle';
import { WorkMosaicItem } from '../src/types/work';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { findAll as findAllCycles } from '../src/facades/cycle';
import { findAll as findAllWorks } from '../src/facades/work';
import Mosaic from '../src/components/Mosaic';

interface Props {
  homepageMosaicData: (CycleMosaicItem | WorkMosaicItem)[];
}

const IndexPage: NextPage<Props> = ({ homepageMosaicData }) => {
  return (
    <SimpleLayout title="Welcome">
      <Mosaic stack={homepageMosaicData} />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const cycles = await findAllCycles();
  const works = await findAllWorks();
  const interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);

  return {
    props: {
      homepageMosaicData: interleavedResults,
    },
  };
};

export default IndexPage;
