import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import { Grid, Box, Card, CardContent, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

const AdFromOurCommunity = () => {
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
                           <Image src="/img/spinardi/com amorspinardi.webp" width={300} height={450}></Image>
                            </Stack>
                        </Grid>

                        <Grid item xs={12}
                            sm={6}
                            md={4}
                        >
                            <Stack gap={4}>
                            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'} >
        <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
          <Typography textAlign="left" paddingBlockEnd={2}  variant='body2'>
            {t('lbl1BCS')}
          </Typography>
          <Typography textAlign="left" paddingBlockEnd={2}  variant='body2'>
            {t('lbl2BCS')}
          </Typography>
          <Typography textAlign="left" paddingBlockEnd={2}  variant='body2'>
            {t('lbl3BCS')}
          </Typography>
          <Typography textAlign="left" paddingBlockEnd={2}  variant='body2'>
            {t('lbl4BCS')}
          </Typography>
          <Typography textAlign="left" paddingBlockEnd={2}  variant='body2'>
            {t('lbl5BCS')}
          </Typography>
         
        </Box>
      </Box>
                            </Stack>
                        </Grid>

                    </Grid>
                </Box>
            </Box>
           
           

      <Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} >
      <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
          <BuySubscriptionButton label={t('btn exclusive club')}
                        price="price_1QaOWZLbVcSeBXdQ7Nt4wPOr"
                        product_id="prod_RTLCazmGCcyKKH"
                        cycleId={30} />
        </Box>
      </Box>
      </Grid>
        </Stack>
 
  
</div>
</>
    
  );
};
export default AdFromOurCommunity;
