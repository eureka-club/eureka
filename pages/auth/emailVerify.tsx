import { getCsrfToken, getSession } from 'next-auth/react';
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
      <Link legacyBehavior  href="/">
      <a className="btn btn-primary text-white">
        {t('common:goToHomepage')}
      </a>
      </Link>
    </SimpleLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }
  const csrfToken = await getCsrfToken(ctx);
  return {
    props: { csrfToken },
  };
};
