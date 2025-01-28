import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import { Grid, Box, Card, CardContent, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';
import Link from 'next/link';

const InvestInYourself: FC<{ cycleId: number }> = ({ cycleId }) => {
  const { t } = useTranslation('spinardi');
  const { data: cycle } = useCycleSumary(cycleId);

  return (
    <>
      <div>
        <Stack gap={3} paddingTop={5} paddingBottom={1}>
          <Grid>
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingLeft={2}
              paddingRight={2}
            >
              <Box id="price-info" sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                <Typography fontSize={30} textAlign="center">
                  <b> {t('lblHV')}</b>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '45dvw', sm: '75dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  {t('lblB1V')}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} alignContent={'center'}>
              <Box
                sx={{ maxWidth: { lg: '43dvw', sm: '60dvw', xs: '100dvw' }, display: 'flex' }}
                alignItems={'center'}
                alignContent={'center'}
              >
                <Typography fontSize={30}>
                  <b>4 X</b>
                </Typography>
                <Typography textAlign="center" paddingBlockEnd={0} fontSize={60} paddingLeft={1}>
                  <b>49,90</b>
                </Typography>
                <Typography textAlign="left" fontSize={30}>
                  <b></b>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '100dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  {t('lblB2V')}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  ✅<b>{t('lblB3V')}</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  ✅<b>{t('lblB4V')}</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  ✅<b>{t('lblB5V')}</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
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
              paddingTop={0}
            >
              <Box sx={{ maxWidth: { lg: '90dvw', sm: '100dvw', xs: '100dvw' } }}>
                <BuyButton label={t('payment-opt-btn')} cycleId={cycle?.id!} />
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2" paddingBlockEnd={1}>
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
