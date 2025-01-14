import useTranslation from 'next-translate/useTranslation';
import { Stack, Box, Typography } from '@mui/material';
import Payment from './payment';
import Head from 'next/head';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import { useRouter } from 'next/router';

const PaymenOption = () => {
  const { t } = useTranslation('spinardi');
  const router = useRouter();

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

      <Stack gap={5} paddingTop={8} paddingBottom={5} sx={{ display: 'row', justifyContent: 'left' }}>
        <Box sx={{  justifyContent: 'left' }} alignItems={'left'} paddingLeft={5} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
            <ButtonsTopActions />
            
          </Box>
          <Box sx={{ maxWidth: { lg: '100dvw', sm: '80dvw', xs: '80dvw' , md:'80dvw'} }}>
          <Typography textAlign={'center'} variant="h5" paddingTop={0}>
              {t('lblpayment title')}
            </Typography>
          </Box>
        </Box>
       
        
      </Stack>
      <Stack gap={5} paddingTop={0} paddingBottom={5}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingLeft={3} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Payment cycleId={+router?.query.cycleId?.toString()!}/>
          </Box>
        </Box>
      </Stack>
    </>
  );
};
export default PaymenOption;
