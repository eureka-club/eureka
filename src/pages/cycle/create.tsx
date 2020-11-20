import { NextPage } from 'next';

import SimpleLayout from '../../components/layouts/SimpleLayout';

interface Props {}

const IndexPage: NextPage<Props> = () => {
  return (
    <SimpleLayout title="Create cycle">
      <h1>Create Cycle</h1>
    </SimpleLayout>
  );
};

export default IndexPage;
