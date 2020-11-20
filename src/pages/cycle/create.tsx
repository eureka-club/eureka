import { NextPage } from 'next';

import SimpleLayout from '../../components/layouts/SimpleLayout';
import CreateCycleForm from '../../components/forms/CreateCycleForm';

interface Props {}

const IndexPage: NextPage<Props> = () => {
  return (
    <SimpleLayout title="Create cycle">
      <CreateCycleForm className="mb-5" />
    </SimpleLayout>
  );
};

export default IndexPage;
