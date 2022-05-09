import {NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TermsAndPolicy from '@/src/components/TermsAndPolicy';
//import { useRouter } from 'next/router';


const policyPage: NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {t } = useTranslation('termsAndPolicy');
  //const router = useRouter();
  //const {show} = router.query ;


  return (
    <SimpleLayout title={t('termsAndPolicy')}>
          <TermsAndPolicy/>
    </SimpleLayout>
  );
};


export default policyPage;
