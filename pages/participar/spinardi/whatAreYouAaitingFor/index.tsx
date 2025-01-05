import { Stack, Typography } from '@mui/material';
import Countdown from 'pages/participar/components/Countdown';
import { Grid, Box, Card, CardContent, CardHeader,Avatar, IconButton, Divider} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';




const WhatAreYouAaitingFor = () => {
  const { t } = useTranslation('spinardi');
  return (
    <>
    <div>
    <Stack direction={{ xs: 'column' }} gap={2}  >
       <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingTop={2} paddingX={1} >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Typography textAlign="center" paddingTop={2}   fontSize={30}>
                <b> {t('footer Club title')}</b>
              </Typography>
             
            </Box>
          </Box>

        
          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingX={1}>
            <Box sx={{ maxWidth: { lg: '40dvw', sm: '40dvw', xs: '100dvw' } }}>
              <Typography textAlign="center" paddingBlockEnd={2}  fontSize={22}>
                {t('footer Club sub title 1')}
              </Typography>
             
            </Box>
          </Box>
          </Grid>

          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} >
            <Box sx={{ maxWidth: { lg: '35dvw', sm: '35dvw', xs: '70dvw' } }}>
              <Typography textAlign="center" paddingBlockEnd={2} fontSize={22}>
                {t('footer Club sub title 2')}
              </Typography>
             
            </Box>
          </Box>
          </Grid>
          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Countdown startDate={new Date('2025-01-12')} />
            </Box>
          </Box>
          </Grid>
          <Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} >
            <Box sx={{ maxWidth: { lg: '38dvw', sm: '38dvw', xs: '100dvw' } }}>
              <Typography textAlign="center" paddingBlockEnd={2} paddingX={2} variant='body2'>
                {t('footer Club sub title 3')}
              </Typography>
             
            </Box>
          </Box>
          </Grid>

          
          
        </Stack>
    </div>
    </>
  );
}
export default WhatAreYouAaitingFor;