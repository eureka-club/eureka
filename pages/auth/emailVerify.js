import { getCsrfToken } from 'next-auth/client'
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import useTranslation from 'next-translate/useTranslation';

export default function EmailVerify({ csrfToken }) {
  const { t } = useTranslation('emailVerify');
  
  return (
    <SimpleLayout title={t('title')}> 
      <p>{t('text')}</p>
      <a className="btn btn-primary" href='/'>{t('common:goToHomepage')}</a>
    </SimpleLayout>
  )
}

export async function getServerSideProps(context){
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken }
  }
}

