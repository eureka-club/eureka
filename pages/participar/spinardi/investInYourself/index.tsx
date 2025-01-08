import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import { Grid, Box, Card, CardContent, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';

const InvestInYourself:FC<{cycleId:number}> = ({cycleId}) => {
  const { t } = useTranslation('spinardi');
  const{data:cycle}=useCycleSumary(cycleId);

  return (
    <>
      <div>
        <Stack gap={5} paddingTop={5} paddingBottom={1}>
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box sx={{ maxWidth: { lg: '200dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Typography fontSize={30} textAlign="center">
                <b> {t('lblHV')}</b>
              </Typography>
            </Box>
          </Box>
      

          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '45dvw', sm: '75dvw', xs: '100dvw' } }}>
                <Typography textAlign="center"  variant="body2">
                {t('lblB1V')}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} alignContent={'center'}>
              <Box sx={{ maxWidth: { lg: '43dvw', sm: '60dvw', xs: '100dvw' },display: 'flex' }} alignItems={'center'} alignContent={'center'}>
              <Typography   fontSize={30}>
                  <b>$R</b>
                </Typography>
                <Typography textAlign="center" paddingBlockEnd={2} fontSize={60} paddingX={1}>
                  <b>199</b>
                </Typography>
                <Typography textAlign="center"  fontSize={30}>
                  <b>.00</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '50dvw', sm: '100dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" paddingBlockEnd={1} variant="body2">
                  {t('lblB2V')}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="left" variant="body2">
                  ✅<b>{t('lblB3V')}</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="left"  variant="body2">
                  ✅<b>{t('lblB4V')}</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="left"  variant="body2">
                  ✅<b>{t('lblB5V')}</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="left"  variant="body2">
                ✅<b>{t('lblB6V')}</b> 
                </Typography>
              </Box>
            </Box>
          </Grid>


          <Grid>
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingRight={4}
              paddingTop={2}
            >
              <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '100dvw' } }}>
              <BuyButton 
                label={t('btn exclusive club')} 
                price={cycle?.price!}
                product_id={cycle?.product_id!}
                cycleId={cycle?.id!} 
              />
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" paddingBlockEnd={1} variant="body2">
                  {t('lblB7V')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Stack>
      </div>
    </>
  );
};
export default InvestInYourself;
