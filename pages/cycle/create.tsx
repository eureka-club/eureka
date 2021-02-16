import { NextPage } from 'next';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CreateCycleForm from '../../src/components/forms/CreateCycleForm';

const CreateCyclePage: NextPage = () => {
  return (
    <SimpleLayout title="Create cycle">
      <CreateCycleForm className="mb-5" />
    </SimpleLayout>
  );
};

export default CreateCyclePage;
