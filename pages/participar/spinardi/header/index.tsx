import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import Countdown from 'pages/participar/components/Countdown';
import Image from 'next/image';
import { Grid, Box } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';

const Header = () => {
  const { t, lang } = useTranslation('spinardi');
  return (
    <>
      <Stack gap={2} paddingTop={0} paddingBottom={1}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingLeft={2} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '80dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Grid container gap={2} sx={{ justifyContent: 'center' }}>
              <Grid item xs={12} sm={6} md={4} >
                <Stack gap={2}>
                <Box sx={{ maxWidth: { lg: '80dvw', sm: '100dvw', xs: '100dvw' } }} paddingLeft={2} paddingTop={2} paddingRight={2}>
                    <Image src="/img/spinardi/provisoria.webp" width={340} height={380}></Image>
                    </Box> 
                </Stack>

                
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={2}>

                <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingX={1}>
                    <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    
                       
                      <Typography textAlign="center" paddingTop={2} variant="h4">
                        <b> {t('club title')}</b>
                      </Typography>
                      
                     
                      <Typography paddingBlockEnd={2} textAlign="center" variant="subtitle1" paddingTop={2}>
                        {t('club dates')}
                      </Typography>
                      <Typography textAlign="center" variant="subtitle1">
                        {t('fully written')}
                      </Typography>
                  
                      </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
                      <BuySubscriptionButton
                        label={t('btn exclusive club')}
                        price="price_1QaOWZLbVcSeBXdQ7Nt4wPOr"
                        product_id="prod_RTLCazmGCcyKKH"
                        cycleId={30}
                      />
                      <Countdown startDate={new Date('2025-01-12')} />

                      <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                        <i>{t('written')}</i>
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>

             
            </Grid>
          </Box>
        </Box>

        
       
        
      </Stack>
    </>
  );
};
export default Header;
