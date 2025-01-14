import { useCycleStripePrice } from '@/src/hooks/useCycleStripePrices';
import useCycleSumary from '@/src/useCycleSumary';
import { Alert, Skeleton, Stack, Typography } from '@mui/material';
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { FC } from 'react';
import toast from 'react-hot-toast';

const Payment:FC<{cycleId:number}> = ({cycleId}) => {
  const { t } = useTranslation('spinardi');
  const{data:session}=useSession();
  const{data:cycle,isLoading}=useCycleSumary(cycleId);
  const {data:prices,isLoading:isLoadingPrices}=useCycleStripePrice(cycle?.product_id!);

  const doAction = async (mode:'payment'|'subscription',price:string,iterations?:number)=>{
    const url = mode=='payment'
      ? '/api/stripe/checkout_sessions'
      : '/api/stripe/subscriptions/checkout_sessions';

    const fr = await fetch(url,{
      method:'POST',
      body:JSON.stringify({
        price,
        product_id:cycle?.product_id,
        client_reference_id:session?.user.id,
        customer_email: session?.user.email,
        cycleId,
        cycleTitle:cycle?.title,
        ... mode=='subscription' && {iterations}
      }),
      headers:{
        'Content-Type':'application/json'
      }
    });

    const {stripe_session_url,participant_already_exist} = await fr.json();
    if(participant_already_exist){ 
      return toast.error(t('Você já está inscrito no clube.'));
    }
    window.location.href = stripe_session_url;
  }
  const onClickHandler = async (e:any,mode:'payment'|'subscription',price:string,iterations?:number)=>{
    e.preventDefault();
    await doAction(mode,price,iterations);
  }

  if(isLoading||isLoadingPrices)return <>
    <Skeleton variant="text" sx={{ fontSize: '1rem' }} /><br/>
    <Stack direction={{xs:'column',sm:'row'}} gap={3} sx={{width:'80dvw'}} justifyContent={'center'}>
      <Skeleton variant="rectangular" width={325} height={243} />
      <Skeleton variant="rectangular" width={325} height={243} />
    </Stack>
    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
  </>;
  if(!isLoading && !cycle || !prices)return <Alert variant='outlined' color='info'>{t('common:Not Found')}</Alert>

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
                      <b>{prices.one_time.currency.toUpperCase()}</b>
                    </Typography>
                    <Typography textAlign="center" paddingBlockEnd={0} fontSize={40} paddingLeft={1}>
                      <b>{prices.one_time.amount}</b>
                    </Typography>
                    {/* <Typography textAlign="center" fontSize={40}>
                      <b>,00</b>
                    </Typography> */}
                  </Box>

                  <Typography textAlign={'center'} paddingLeft={2} paddingTop={2}>
                    <Button variant="contained" size="large" onClick={(e)=>onClickHandler(e,'payment',cycle?.price!)}>
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
                      <b>{cycle?.iterations} x {prices.recurring.currency.toUpperCase()}</b>
                    </Typography>
                    <Typography textAlign="center" paddingBlockEnd={0} fontSize={40} paddingLeft={2}>
                      <b>{prices.recurring.amount}</b>
                    </Typography>
                    {/* <Typography textAlign="center" fontSize={40}>
                      <b>,90</b>
                    </Typography> */}
                  </Box>

                  <Typography textAlign={'center'} paddingLeft={2} paddingTop={2}>
                    <Button variant="contained" size="large" onClick={(e)=>onClickHandler(e,'subscription',cycle?.priceInPlots!)}>
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
