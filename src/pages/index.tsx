import { NextPage } from 'next';

import Mosaic from '../components/Mosaic';
import SimpleLayout from '../components/layouts/SimpleLayout';

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout title="Welcome">
      <Mosaic />
    </SimpleLayout>
  );
};

export default IndexPage;
