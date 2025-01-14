import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Button,
  CardActions,
} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';
import Link from 'next/link';

const Payment = ({}) => {
  const { t } = useTranslation('spinardi');

  return (
    <>
      <div>
        <Stack
          gap={0}
          paddingTop={0}
          sx={{ backgroundColor: 'white' }}
          paddingLeft={0.5}
          alignContent={'center'}
          alignItems={'center'}
        >
          <Stack direction={{ xs: 'column' }} gap={4} alignContent={'center'} alignItems={'center'}>
            <Grid
              container
              spacing={5}
              rowSpacing={3}
              columnSpacing={{ sm: 7, md: 7 }}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Card
                  elevation={0}
                  sx={{
                    width: 325,
                    transition: '0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    background: '#ecf0f1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '1px',
                  }}
                >
                  <CardHeader
                    sx={{ justifyContent: 'center' }}
                    title={
                      <Typography textAlign={'center'} variant="h6" color="text.secondary">
                        <b>A vista</b>
                      </Typography>
                    }
                    subheader={
                      <Typography
                        textAlign={'center'}
                        variant="body2"
                        color="text.secondary"
                        paddingBlockEnd={2.5}
                      ></Typography>
                    }
                  />

                  <Box
                    sx={{ maxWidth: { lg: '43dvw', sm: '60dvw', xs: '100dvw' }, display: 'flex' }}
                    alignItems={'center'}
                    alignContent={'center'}
                    paddingLeft={6}
                  >
                    <Typography fontSize={40} paddingLeft={1} paddingRight={1}>
                      <b>R$</b>
                    </Typography>
                    <Typography textAlign="center" paddingBlockEnd={0} fontSize={40} paddingLeft={1}>
                      <b>199</b>
                    </Typography>
                    <Typography textAlign="center" fontSize={40}>
                      <b>,00</b>
                    </Typography>
                  </Box>

                  <Typography textAlign={'center'} paddingLeft={2} paddingTop={2}>
                    <Button variant="contained" size="large">
                      {t('lblpayment button 1')}
                    </Button>
                  </Typography>
                  <CardContent></CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Card
                  elevation={0}
                  sx={{
                    width: 325,
                    transition: '0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    background: '#ecf0f1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '1px',
                  }}
                >
                  <CardHeader
                    sx={{ justifyContent: 'center' }}
                    title={
                      <Typography textAlign={'center'} variant="h6" color="text.secondary">
                        <b>Por mês</b>
                      </Typography>
                    }
                    subheader={
                      <Typography textAlign={'center'} variant="body2" color="text.secondary" paddingRight={0}>
                        <b> Pagamento facilitado em 4 parcelas.</b>
                      </Typography>
                    }
                  />

                  <Box
                    sx={{ maxWidth: { lg: '43dvw', sm: '60dvw', xs: '100dvw' }, display: 'flex' }}
                    alignItems={'center'}
                    alignContent={'center'}
                    paddingLeft={6}
                  >
                    <Typography fontSize={40}>
                      <b>4 x R$</b>
                    </Typography>
                    <Typography textAlign="center" paddingBlockEnd={0} fontSize={40} paddingLeft={2}>
                      <b>49</b>
                    </Typography>
                    <Typography textAlign="center" fontSize={40}>
                      <b>,90</b>
                    </Typography>
                  </Box>

                  <Typography textAlign={'center'} paddingLeft={2} paddingTop={2}>
                    <Button variant="contained" size="large">
                      {t('lblpayment button 2')}
                    </Button>
                  </Typography>
                  <CardContent></CardContent>
                </Card>
              </Grid>
            </Grid>
            <Stack textAlign={'left'} alignContent={'left'} alignItems={'left'}>
              <Grid paddingTop={2}>
                <Box sx={{ justifyContent: 'left' }} alignItems={'left'} paddingTop={1} paddingLeft={3}>
                  <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                    <Typography textAlign="left" variant="body2">
                      ✅<b> {t('lblpayment 1')}</b>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid paddingTop={2}>
                <Box sx={{ justifyContent: 'left', alignContent: 'left' }} alignItems={'left'} paddingLeft={3}>
                  <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                    <Typography textAlign="left" variant="body2">
                      ✅<b> {t('lblpayment 2')}</b>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid paddingTop={2}>
                <Box sx={{ justifyContent: 'left' }} alignItems={'left'} paddingLeft={3}>
                  <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                    <Typography textAlign="left" variant="body2">
                      ✅<b> {t('lblpayment 3')}</b>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid paddingTop={2} >
                <Box sx={{ justifyContent: 'left' }} alignItems={'left'} paddingLeft={3}>
                  <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                    <Typography textAlign="left" variant="body2">
                      ✅<b> {t('lblpayment 4')}</b>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid paddingRight={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingTop={8}>
                  <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
                    <Typography textAlign="center" paddingBlockEnd={1} variant="body2">
                      {t('lblpayment 5')}
                      <Link href={'http://bit.ly/bolsa-com-amor'}>
                        <span style={{ color: 'black', cursor: 'pointer', textDecoration: 'underline' }}>
                          bit.ly/bolsa-com-amor
                        </span>
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </>
  );
};
export default Payment;
