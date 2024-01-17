import { NextPage, GetServerSideProps } from 'next';

import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import SignUpJoinToCycleSimpleForm from '@/src/components/forms/SignUpJoinToCycleSimpleForm';
import { getSession } from 'next-auth/react';
import { getDictionary, t } from '@/src/get-dictionary';
import { Locale, i18n } from 'i18n-config';

interface Props {
  session: any;
  dict:any
}

const RegisterJoinToCyclePage: NextPage<Props> = ({ dict }) => {

  
  return (
    <SimpleLayout title={t(dict,'Sign up')} showNavBar={false} showFooter={false}>
      <SignUpJoinToCycleSimpleForm noModal/>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const dictionary=await getDictionary(ctx.locale as Locale ?? i18n.defaultLocale);
  const dict={...dictionary['emailVerify'],...dictionary['common']};

  return {
    props: { session,dict },
  };
};

export default RegisterJoinToCyclePage;
