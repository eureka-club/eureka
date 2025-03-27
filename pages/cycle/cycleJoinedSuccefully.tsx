import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import { Alert } from '@mui/material';

const CreateCyclePage: NextPage = () => {
  const { t } = useTranslation('createCycleForm');

  return (
    <SimpleLayout title={t('createCycle')}>
      <Alert color="info">User joined successfully.</Alert>
    </SimpleLayout>
  );
};

export default CreateCyclePage;
