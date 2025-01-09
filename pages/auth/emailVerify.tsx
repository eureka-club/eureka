import { getCsrfToken, getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { GetServerSideProps } from 'next';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import Link from 'next/link';
import { Typography, Box } from '@mui/material';
interface Props {
  csrfToken: string | null;
}
export default function EmailVerify(/* props: Props */) {
  const { t } = useTranslation('emailVerify');

  return (
    <>
      <Box paddingTop={5} paddingLeft={5}>
        <aside className="d-flex  align-items-left aligg-content-left">
          {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
          <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
          <section>
            <div className={`text-secondary ms-3 h4 mb-0 `}>Eureka</div>
            <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>
              {t('navbar:tagline')}
            </p>
          </section>
        </aside>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ maxWidth: { lg: '100dvw', sm: '100', xs: '100dvw' } }}>
          <Typography
            paddingTop={5}
            justifyContent={'center'}
            paddingX={6}
            alignContent={'left'}
            alignItems={'left'}
            textAlign="justify"
            fontSize={25}
          >
            {t('text')}
          </Typography>
        </Box>
      </Box>
      {/*
    <p>{t('text')}</p>
 <Link href="/">
 <a className="btn btn-primary text-white">
   {t('common:goToHomepage')}
 </a>
 </Link>*/}
    </>
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
