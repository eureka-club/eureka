import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import CreateCycleForm from '../../src/components/forms/CreateCycleForm';

const CreateCyclePage: NextPage = () => {
  const { t } = useTranslation('createCycleForm');

  return (
    <SimpleLayout title={t('createCycle')}>
      <CreateCycleForm className="mb-5" />
    </SimpleLayout>
  );
};

export default CreateCyclePage;
