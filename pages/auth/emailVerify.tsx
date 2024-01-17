import { getCsrfToken, getSession } from 'next-auth/react';

import { GetServerSideProps } from 'next';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import Link from 'next/link'
import { getDictionary, t } from '@/src/get-dictionary';
import { Locale, i18n } from 'i18n-config';
interface Props {
  csrfToken: string | null;
  dict:any
}
export default function EmailVerify({dict}:Props) {

  return (
    <SimpleLayout title={t(dict,'title')}>
      <p>{t(dict,'text')}</p>
      <Link legacyBehavior  href="/">
      <a className="btn btn-primary text-white">
        {t(dict,'goToHomepage')}
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
  const dictionary=await getDictionary(ctx.locale as Locale ?? i18n.defaultLocale);
  const dict={...dictionary['emailVerify'],...dictionary['common']};

  const csrfToken = await getCsrfToken(ctx);
  return {
    props: { csrfToken,dict },
  };
};
