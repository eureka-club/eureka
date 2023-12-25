import Link from 'next/link'
import { getDictionary, t } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { NextPage } from 'next';
import Layout from '@/src/components/layout/Layout';

interface Props {
  params:{lang:Locale,id:string},
  // csrfToken: string | null
}
const EmailVerifyPage:NextPage<Props> = async function ({ params: { lang } }) {
  const {emailVerify,common} = await getDictionary(lang);
  
  return (
    <Layout dict={{emailVerify,common}}>
      <p>{t(emailVerify,'text')}</p>
      <Link href="/">
      {/* <a className="btn btn-primary text-white"> */}
        {t(common,'goToHomepage')}
      {/* </a> */}
      </Link>
    </Layout>
  );
}
export default EmailVerifyPage;
// export const getServerSideProps: GetServerSideProps = async function getServerSideProps(ctx) {
//   const session = await getSession(ctx);
//   if (session != null) {
//     return { redirect: { destination: '/', permanent: false } };
//   }
//   const csrfToken = await getCsrfToken(ctx);
//   return {
//     props: { csrfToken },
//   };
// };
