import React from 'react';
import { Session } from '@/src/types';
import { GetServerSideProps, NextPage } from 'next';

import SimpleLayout from '../src/components/layouts/SimpleLayout';
import RecoveryLoginForm from '../src/components/forms/RecoveryLoginForm';
import { getDictionary, t } from '@/src/get-dictionary';
import { Locale, i18n } from 'i18n-config';

interface Props{
  session:Session;
  dict:any
}
const RecoveryLoginPage: NextPage<Props> = ({dict}) => {

  return (
    <SimpleLayout title={t(dict,'PasswordRecovery')} showNavBar={false} showFooter={false}>
         <RecoveryLoginForm />
          {/**/}
    </SimpleLayout>
  );
};
 export const getServerSideProps:GetServerSideProps = async (ctx)=>{
  const dictionary=await getDictionary(ctx.locale as Locale ?? i18n.defaultLocale);
  const dict={...dictionary['common'],...dictionary['PasswordRecovery']};
  return {
    props:{
      dict,
    }
  }
 }


export default RecoveryLoginPage;
