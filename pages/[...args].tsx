import { NextPage } from 'next';
import React from 'react';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import useTranslation from 'next-translate/useTranslation';
//import {Alert} from 'react-bootstrap'
import { Alert } from '@mui/material';

const Error: NextPage = () => {
  const { t } = useTranslation('common');
  return (
    <SimpleLayout title={t('Bad Request')}>
      <Alert variant="filled" severity="error">
        {t('Bad Request')}
      </Alert>
    </SimpleLayout>
  );
};
export default Error;
