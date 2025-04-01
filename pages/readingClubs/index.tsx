'use client';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';

import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';

import ReadingClubs from './components/ReadingClubs';
import { Box, Stack, Typography } from '@mui/material';
interface Props {
  session: Session;
}
const readingClubsPage: NextPage<Props> = ({}) => {
  const { t } = useTranslation('readingClubs');

  return (
    <>
      <Head>
        <meta name="title" content={t('meta:readingsClubsTitle')}></meta>
        <meta name="description" content={t('meta:readingsClubsDescription')}></meta>
      </Head>
      <style jsx global>{`
        body {
          background-color: #10b4bb;
        }
      `}</style>
      <SimpleLayout fullWidth title={t('readingsClubsTitle')}>
        <Stack sx={{ alignItems: 'center', alignContent: 'center' }}>
          <Box>

            <Typography sx={{ padding: '30px', fontSize: 36, maxWidth: { lg: '80dvw', sm: '80dvw', xs: '100dvw' } }}>
              <b>{t('titlePage')}</b>
              {t('titlePage1')}
            </Typography>
          </Box>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingX: '10px', paddingTop: '20px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <ReadingClubs />
            </Box>
          </Box>
        </Stack>
      </SimpleLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
};
export default readingClubsPage;
