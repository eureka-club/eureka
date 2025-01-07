import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import { Grid, Box, Card, CardContent, CardHeader,Avatar, IconButton, Divider} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';


const InvestInYourself = () => {
  const { t } = useTranslation('spinardi');
  return (
    <>
    <div>

    <Stack gap={5} paddingTop={5} paddingBottom={1} >
                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}  paddingLeft={2} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                        <Typography fontSize={30} textAlign="center">
                        <b> {t('sub title invest in yourself')}</b>
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"} paddingLeft={2} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                        <Grid container gap={4}  sx={{justifyContent:'center'}}>
                            
                            <Grid item xs={12}
                                sm={6}
                                
                            >
                                <Stack gap={4}>
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
                                </Stack>
                            </Grid>

                            <Grid item xs={12}
                                sm={6}
                                md={4}
                            >
                                <Stack gap={4}>
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
                                </Stack>
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
               
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} >
          <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
              <BuySubscriptionButton 
                label={t('lbl button cost and payment')} 
                price="price_1QaOWZLbVcSeBXdQ7Nt4wPOr"
                product_id="prod_RTLCazmGCcyKKH"
                iterations={3}
                cycleId={30} 
              />
            </Box>
          </Box>
          </Grid>
            </Stack>
     
      
    </div>
    </>
  );
}
export default InvestInYourself;