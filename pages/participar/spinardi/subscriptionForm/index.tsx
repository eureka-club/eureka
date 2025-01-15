import { Button, Stack, Typography } from '@mui/material';
import { Grid, Box} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
// import BuyButton from 'pages/participar/components/BuyButton';
// import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';
import Trans from 'next-translate/Trans';
import Link from 'next/link';

const SubscriptionForm:FC<{cycleId:number}> = ({cycleId}) => {
  const { t } = useTranslation('spinardi');
  // const{data:cycle}=useCycleSumary(cycleId);
  const bolderComponents = ()=>[<p key={1}/>,<b className='text-shadow' key={2}/>,<>✓ </>]
  return (
    <div>
      <Stack gap={5} paddingTop={5} paddingBottom={5} >
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingLeft={2} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
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
                  <Trans i18nKey='spinardi:lbl1BQ' components={bolderComponents()}/>
                  <Trans i18nKey='spinardi:lbl2BQ' components={bolderComponents()}/>
                  <Trans i18nKey='spinardi:lbl3BQ' components={bolderComponents()}/>
                  <Trans i18nKey='spinardi:lbl4BQ' components={bolderComponents()}/>
                  <Trans i18nKey='spinardi:lbl5BQ' components={bolderComponents()}/>

                  <Trans i18nKey='spinardi:lbl6BQ' components={bolderComponents()}/>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                  <Trans i18nKey='spinardi:lbl7BQ' components={bolderComponents()}/>
                  <Trans i18nKey='spinardi:lbl8BQ' components={bolderComponents()}/>

                  <Typography>✓ {t('lbl9BQ')}</Typography>
                  <Trans i18nKey='spinardi:lbl10BQ' components={bolderComponents()}/>

                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={4} paddingTop={2}>
                    <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '90dvw' } }}>
                      <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                          <Link href="#price-info">
                            <Button variant='contained'>{t('btn exclusive club')}</Button>
                          </Link>
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
  );
};
export default SubscriptionForm;
