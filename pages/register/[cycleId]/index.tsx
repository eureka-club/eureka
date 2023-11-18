import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import SignUpJoinToCycleForm from '@/src/components/forms/SignUpJoinToCycleForm ';



const RegisterJoinToCyclePage: NextPage = () => {
  const { t } = useTranslation('signUpForm'); 
  
  return (
    <SimpleLayout title={t('Sign up')} showNavBar={false} showFooter={false}>
      <SignUpJoinToCycleForm noModal  />
    </SimpleLayout>
  );
};


export default RegisterJoinToCyclePage;
