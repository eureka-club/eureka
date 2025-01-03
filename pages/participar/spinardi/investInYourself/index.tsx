import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import { Grid, Box, Card, CardContent, CardHeader,Avatar, IconButton, Divider} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';


const InvestInYourself = () => {
  const { t } = useTranslation('spinardi');
  return (
    <>
    <div>
     
       <Stack direction={{ xs: 'column' }} gap={2} bgcolor= "#ecf0f1" width={{xs:350, sm:1100}}>
       <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Typography textAlign="center" paddingTop={2}  fontSize={30}>
                <b> {t('sub title invest in yourself')}</b>
              </Typography>
             
            </Box>
          </Box>

          <Grid container>
          <Grid item xs={12} sm={6} padding={2}>
              <Card
                elevation={0}
                sx={{
                  maxWidth: 500,
                  transition: '0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  
                  bgcolor:"#ecf0f1" ,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CardHeader
                  sx={{ justifyContent: 'center', alignItems:'center', textAlign:'center' }}
                
                
                  title={t('card club cost per month 4')}
                  subheader={(t('card header 4'))}
                />

                <Divider />
                <CardContent>
                  <Typography textAlign="center" variant="body2"  fontSize={30} >
                   
                  <b> 40x R$ 49,00</b> 
                    
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} padding={2}>
              <Card
                elevation={0}
                sx={{
                  maxWidth: 500,
                  transition: '0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  
                  bgcolor:"#ecf0f1" ,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CardHeader
                  sx={{ justifyContent: 'center', alignItems:'center', textAlign:'center' }}
                  
                  
                  title={t('card Club cost 1 payment 5')}
                  subheader={t('card header 5')}
                />

                <Divider />
                <CardContent>
                  <Typography textAlign={'center'} variant="body2" fontSize={30} paddingTop={0}>
                    
                  <b> R$ 160,00</b> 
                   
                  </Typography>
                </CardContent>
              </Card>
            
            </Grid>
            
          </Grid>
          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} >
            <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
              <Typography textAlign="center" paddingBlockEnd={2}  variant='body2'>
                {t('lbl cost and payment')}
              </Typography>
             
            </Box>
          </Box>
          </Grid>

          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingBlockEnd={2}>
          <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
              <BuySubscriptionButton label={t('lbl button cost and payment')} price={''} product_id={''} cycleId={0} />
            </Box>
          </Box>
          </Grid>

          

        </Stack>
    </div>
    </>
  );
}
export default InvestInYourself;