import { Button, Stack, Typography } from '@mui/material';
import { Grid, Box } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import Link from 'next/link';

const AdFromOurCommunity = () => {
  const { t } = useTranslation('spinardi');
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
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Typography fontSize={30} textAlign="center">
                <b> {t('lbl1HCS')}</b>
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Grid container gap={4} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} sm={6}>
                  <Stack gap={4}>
                    <Box sx={{display:{xs:'none',sm:'block'}}}>
                      <img src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/com amorspinardi.webp`} width={482} />
                    </Box>
                    <Box sx={{display:{xs:'block',sm:'none'}}}>
                      <img src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/com amorspinardi.webp`} width={365} />
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Stack gap={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
                      <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                          {t('lbl1BCS')}
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                          {/* {t('lbl2BCS')} */}
                          <Trans i18nKey={'spinardi:lbl2BCS'} components={[<p key={1}></p>, <b key={2} />]} />
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                          {t('lbl3BCS')}
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                          {t('lbl4BCS')}
                        </Typography>
                        <Typography textAlign="left"  variant="body2">
                          {t('lbl5BCS')}
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                          {t('lbl6BCS')}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '90dvw' } }}>
                <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                  <Link href="#price-info">
                    <Button variant='contained'>{t('btn exclusive club')}</Button>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Stack>
      </div>
    </>
  );
};

export default AdFromOurCommunity;
