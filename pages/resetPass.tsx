import React from 'react';
import { Session } from '@/src/types';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import ResetPassForm from '../src/components/forms/ResetPassForm';

interface Props{
  session:Session;
}
const ResetPassPage: NextPage<Props> = () => {
   const { t } = useTranslation('PasswordRecovery');

  return (
    <SimpleLayout title={t('resetPassword1')} showNavBar={false}>
         <ResetPassForm />
    </SimpleLayout>
  );
};



export default ResetPassPage;
