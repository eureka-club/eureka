import { NextPage } from 'next';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CreateCycleForm from '../../src/components/forms/CreateCycleForm';

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout title="Create cycle">
      <CreateCycleForm className="mb-5" />
    </SimpleLayout>
  );
};

export default IndexPage;
