import { GetServerSideProps, NextPage } from 'next';
import Header from './header';
import WhyBePartOf from './why-be-part-of';
import ClubProgramming from './club-programming/clubProgramming';
import AdFromOurCommunity from './adFromOurCommunity';
import InvestInYourself from './investInYourself';
import FAQ from '../components/faq';
import WhatAreYouAaitingFor from './whatAreYouAaitingFor';
import SubscriptionForm from './subscriptionForm';
import { getSession } from 'next-auth/react';
import LineTime from './lineTime';
import { Session } from '@/src/types';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { Stack, Box, Typography } from '@mui/material';
import Image from 'next/image';
import { getCycleSumary } from '@/src/useCycleSumary';
import { dehydrate, QueryClient } from 'react-query';
interface Props {
  session: Session;
  cycleId:number;
}

const Spinardi: NextPage<Props> = ({session,cycleId}) => {
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
     
      <Stack sx={{ justifyContent: 'center'}} alignItems={'center'}>
          <Stack gap={5} paddingTop={0} paddingBottom={5}>
                <Header cycleId={cycleId}/>
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
          <AdFromOurCommunity cycleId={cycleId} />
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
            <ClubProgramming cycleId={cycleId}/>
          </Box>
        </Box>
      </Stack>
      <Stack gap={5} paddingTop={1} paddingBottom={2}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center' }}
          alignItems={'center'}
          paddingLeft={2}
          paddingRight={2}
        >
          <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
            <SubscriptionForm cycleId={cycleId} />
          </Box>
        </Box>
      </Stack>
      <Stack paddingBottom={5}  gap={0} alignContent={'center'}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center' }}
          alignItems={'center'}
          
          paddingLeft={2}
          textAlign={'center'}
        >
          <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '100dvw' } }} >
          <Typography textAlign={'center'} variant="h4"  paddingBlockEnd={2}>
                    <b>Cronograma</b>
                  </Typography>
            <LineTime />
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
            <InvestInYourself cycleId={cycleId} />
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
            <WhatAreYouAaitingFor cycleId={cycleId} />
          </Box>
        </Box>
        {/* <PaymentOptionForm
          price={cycle?.price!}
          priceInPlots={cycle?.priceInPlots!}
          product_id={cycle?.product_id!}
          cycleId={cycleId}
          cycleTitle={cycle?.title!}
          iterations={3}
          
        /> */}
      </Stack>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const cycleId=36;

  const cycle = getCycleSumary(cycleId);
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey:['CYCLE',`${cycleId}`,'SUMARY'],
    queryFn:()=>cycle
  });
  return {
    props: {
      session,
      cycleId,
      dehydratedState: dehydrate(qc),      
    },
  };
  
};
export default Spinardi;
