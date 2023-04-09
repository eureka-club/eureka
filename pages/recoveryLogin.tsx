import React from 'react';
import { Session } from '@/src/types';
import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import RecoveryLoginForm from '../src/components/forms/RecoveryLoginForm';

interface Props{
  session:Session;
}
const RecoveryLoginPage: NextPage<Props> = () => {
   const { t } = useTranslation('PasswordRecovery');

  return (
    <SimpleLayout title={t('PasswordRecovery')} showNavBar={false} showFooter={false}>
         <RecoveryLoginForm />
          {/**/}
    </SimpleLayout>
  );
};



export default RecoveryLoginPage;
