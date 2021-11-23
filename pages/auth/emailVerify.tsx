import { getCsrfToken } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { GetServerSideProps } from 'next';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import Link from 'next/link'
interface Props {
  csrfToken: string | null;
}
export default function EmailVerify(/* props: Props */) {
  const { t } = useTranslation('emailVerify');

  return (
    <SimpleLayout title={t('title')}>
      <p>{t('text')}</p>
      <Link href="/">
      <a className="btn btn-primary">
        {t('common:goToHomepage')}
      </a>
      </Link>
    </SimpleLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
};
