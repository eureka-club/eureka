import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import Countdown from 'pages/participar/components/Countdown';

import Image from 'next/image';
import { Container } from '@mui/system';
import { Grid, Box, Card, CardContent, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';

const SubscriptionForm = () => {
  const { t } = useTranslation('spinardi');
  return (
    <div>
      <Stack gap={5} paddingTop={5} paddingBottom={5} >
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingLeft={2} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '30dvw', sm: '90dvw', xs: '100dvw' } }}>
            <Typography fontSize={30} textAlign="center">
              {t('lbl1HQ')}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingLeft={2} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '99dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Grid container gap={4} sx={{ justifyContent: 'center' }}>
              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                  <Typography>✓ {t('lbl1BQ')}</Typography>
                  <Typography>✓ {t('lbl2BQ')}</Typography>
                  <Typography>✓ {t('lbl3BQ')}</Typography>
                  <Typography>✓ {t('lbl4BQ')}</Typography>
                  <Typography>✓ {t('lbl5BQ')}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                  <Typography>✓ {t('lbl6BQ')}</Typography>
                  <Typography>✓ {t('lbl7BQ')}</Typography>
                  <Typography>✓ {t('lbl8BQ')}</Typography>
                  <Typography>✓ {t('lbl9BQ')}</Typography>
                  <Typography>✓ {t('lbl10BQ')}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={4} paddingTop={2}>
                    <Box sx={{ maxWidth: { lg: '90dvw', sm: '95dvw', xs: '100dvw' } }}>
                      <BuySubscriptionButton
                        label={t('btn exclusive club')}
                        price="price_1QaOWZLbVcSeBXdQ7Nt4wPOr"
                        product_id="prod_RTLCazmGCcyKKH"
                        cycleId={30}
                      />
                      

                      
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Stack>
    </div>
  );
};
export default SubscriptionForm;
