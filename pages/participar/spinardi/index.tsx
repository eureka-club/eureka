import { GetServerSideProps, NextPage } from 'next';
import Header from './header';
import WhyBePartOf from './why-be-part-of';
import ClubProgramming from './club-programming/clubProgramming';
import AdFromOurCommunity from './adFromOurCommunity';
import InvestInYourself from './investInYourself';
import FAQ from '../components/faq';
import WhatAreYouAaitingFor from './whatAreYouAaitingFor';
import SubscriptionForm from './subscriptionForm';
import Footer from '@/src/components/layouts/Footer';
import { getSession } from 'next-auth/react';

import { Session } from '@/src/types';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { Stack, Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { getCycleSumary } from '@/src/useCycleSumary';
import { dehydrate, QueryClient } from 'react-query';
interface Props {
  session: Session;
}
const Spinardi: NextPage<Props> = ({session}) => {
  const { t } = useTranslation('spinardi');
  return (
    <>
      <Head>
        <meta name="title" content={t('title page')}></meta>
        <meta name="description" content={t('title page')}></meta>
      </Head>
      <style jsx global>{`
        body {
          background-color: white !important;
        }
      `}</style>
     
     
      <Stack sx={{ justifyContent: 'center',backgroundColor: "#ecf0f1"}} alignItems={'center'} paddingX={2}  
           >
          <Stack gap={5} paddingTop={0} paddingBottom={5}>
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingLeft={2}
              paddingRight={2}
            >

              <Box paddingTop={5} alignItems={'left'} alignContent={'left'}>
              
              </Box>
             
            </Box>
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>

           
                <Header />


              </Box>
          </Stack>
        </Stack>


        <Stack paddingBottom={5} >
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                <WhyBePartOf />
              </Box>
            </Box>
          </Stack>

          <Stack paddingBottom={5} sx={{ justifyContent: 'center',backgroundColor: "#ecf0f1"}} >
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                <AdFromOurCommunity />
              </Box>
            </Box>
          </Stack>


          <Stack gap={5} paddingTop={1} paddingBottom={5}>
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingLeft={2}
              paddingRight={2}
            >
              <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                <ClubProgramming />
              </Box>
            </Box>
          </Stack>
          <Stack gap={5} paddingTop={1} paddingBottom={5}>
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingLeft={2}
              paddingRight={2}
            >
              <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                <SubscriptionForm />
              </Box>
            </Box>
          </Stack>

          <Stack paddingBottom={5} sx={{ backgroundColor: "#00cec9" }} gap={5} >
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingLeft={2}
              paddingRight={2}
            >
              <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' },paddingX:2 }}>
                <InvestInYourself />
              </Box>
            </Box>
          </Stack>
        <Stack gap={5} paddingTop={5} paddingBottom={5}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
            <Box sx={{ maxWidth: { lg: '95dvw', sm: '95dvw', xs: '100dvw' } }}>
              <Typography fontSize={30} textAlign="center">
                <b> {t('club description')}</b>
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={1}
            paddingRight={1}
          >
            <Box
              sx={{
                position: 'absolute',
                zIndex: 1,
                bottom: '0',
                right: '0',
                display: { xs: 'none', lg: 'block' },
              }}
            >
              <Image src="/img/imgctry.webp" width={200} height={200} />
            </Box>
            <Box sx={{ maxWidth: { lg: '70dvw', sm: '95dvw', xs: '100dvw' } }}>
              <FAQ />
            </Box>
          </Box>
        </Stack>
        <Stack paddingBottom={5} sx={{background:"linear-gradient(90deg, white, rgb(21, 202, 202));" }}>
          <Box 
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box  >
              <WhatAreYouAaitingFor />
            </Box>
          </Box>
        </Stack>
      
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const cycle = getCycleSumary(30);
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey:['CYCLE',`${30}`,'SUMARY'],
    queryFn:()=>cycle
  })
  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),      
    },
  };
  
};
export default Spinardi;
