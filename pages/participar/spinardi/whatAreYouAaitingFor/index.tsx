import { Stack, Typography } from '@mui/material';
import Countdown from 'pages/participar/components/Countdown';
import { Grid, Box, Card, CardContent, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';

const WhatAreYouAaitingFor: FC<{ cycleId: number }> = ({ cycleId }) => {
  const { t } = useTranslation('spinardi');
  const { data: cycle } = useCycleSumary(cycleId);

  return (
    <>
      <div>
        <Stack gap={2} paddingTop={0} paddingBottom={1} sx={{}}>
          <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Grid container gap={2} sx={{ justifyContent: 'left', alignItems: 'left' }}>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Stack gap={2}>
                    <Box
                      sx={{
                        maxWidth: { lg: '80dvw', sm: '80dvw', xs: '0dvw' },
                        position: 'relative',
                        zIndex: 0,
                        top: '55px',
                        right: '16px',
                        marginRight: 0,
                        marginTop: 0,
                        display: { xs: 'none', lg: 'block', sm: 'block', md: 'block' },
                      }}
                      paddingLeft={0}
                      paddingTop={0}
                      paddingRight={0}
                      paddingBlockEnd={0}
                    >
                      <Image src="/img/spinardi/footer_background.webp" width={740} height={740}></Image>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Stack gap={2} paddingTop={2} paddingX={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
                      <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw', md: '100dvw' } }}>
                        <Typography textAlign="center" paddingTop={2} fontSize={30}>
                          <b> {t('footer Club title')}</b>
                        </Typography>

                        <Typography textAlign="center" paddingBlockEnd={2} fontSize={20} paddingTop={2}>
                          {t('footer Club sub title 1')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={4}>
                      <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Countdown startDate={new Date('2025-03-10')} />
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center' }}
                      alignItems={'center'}
                      paddingRight={4}
                      paddingTop={2}
                    >
                      <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '90dvw' } }} paddingX={0}>
                        <BuyButton
                          label={t('btn exclusive club')}
                          price={cycle?.price!}
                          product_id={cycle?.product_id!}
                          cycleId={cycle?.id!}
                        />
                        <Typography textAlign="center" paddingY={2} variant="body2">
                          {t('footer Club sub title 3')}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Stack>
      </div>
    </>
  );
};
export default WhatAreYouAaitingFor;
