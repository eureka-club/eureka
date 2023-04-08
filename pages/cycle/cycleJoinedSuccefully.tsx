import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';

import { Alert } from 'react-bootstrap';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';

const CreateCyclePage: NextPage = () => {
  const { t } = useTranslation('createCycleForm');

  return (
    <SimpleLayout title={t('createCycle')}>
      <Alert variant="info">User joined successfully.</Alert>
    </SimpleLayout>
  );
};

export default CreateCyclePage;
