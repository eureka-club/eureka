import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { Grid, Box } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';
import Trans from 'next-translate/Trans';

const Header: FC<{ cycleId: number }> = ({ cycleId }) => {
  const { t } = useTranslation('spinardi');

  const { data: cycle } = useCycleSumary(cycleId);

  return (
    <Box sx={{backgroundColor: "#ecf0f1"}} paddingTop={6}>
      <Stack gap={2} paddingTop={0} paddingBottom={1} paddingLeft={2}>
        <aside className="d-flex  align-items-left aligg-content-left">
          {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
          <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
          <section>
            <div className={`text-secondary ms-3 h4 mb-0 `}>Eureka</div>
            <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>
              {t('navbar:tagline')}
            </p>
          </section>
        </aside>
      </Stack>
      <Stack gap={2} paddingTop={0} paddingBottom={0}>
        <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
          <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Stack direction={{xs:'column',md:'row'}} alignItems={'flex-end'}>
                <Box sx={{
                  width:{xs:'100%',md:'30%'}
                }}>
                  <img src="/img/spinardi/muchachoh.png" width={'100%'}/>
                </Box>
                <Box sx={{
                  width:{xs:'100%',md:'40%'}
                }}>
                    <Typography textAlign="center" paddingTop={2} variant="h4">
                        <b> {t('club title')}</b>
                      </Typography>

                      <Typography paddingBlockEnd={2} textAlign="center" fontSize={20} paddingTop={2}>
                        <b>{t('club dates')}</b>
                      </Typography>
                      <Typography textAlign="center" variant="subtitle1">
                        {/* {t('fully written')} */}
                        <Trans
                          i18nKey={'spinardi:fully written'}
                          components={[<p key={1}></p>,<b key={2}/>]}
                        />
                      </Typography>
                      <Box paddingBottom={6}>
                        <BuyButton
                          label={t('btn exclusive club')}
                          price={cycle?.price!}
                          product_id={cycle?.product_id!}
                          cycleId={cycle?.id!}
                        />
                        <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                          <i>{t('written text')}</i>
                        </Typography>
                      </Box>
                    </Box>
                <Box 
                  sx={{
                    width:{xs:'100%',md:'30%'},
                    display:{md:'inherit',xs:'none'}
                  }}>
                  <img src="/img/spinardi/libros.webp" width={'100%'}/>
                </Box>
              </Stack>
            {/* <Grid container gap={2} sx={{ justifyContent: 'left', alignItems: 'left' }}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                
                <Stack gap={2}>
                  <Box
                    sx={{
                      maxWidth: { lg: '100dvw', sm: '90dvw', xs: '100dvw' },
                      position: 'relative',
                      zIndex: 0,
                      top: '53px',
                      right: '16px',
                      marginRight: 0,
                      marginTop: 0,
                    }}
                    paddingLeft={0}
                    paddingTop={0}
                    paddingRight={0}
                  >
                    <Image src="/img/spinardi/muchachoh.png" width={740} height={740}></Image>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={12} md={5}>
                <Stack gap={2} paddingTop={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw', md: '100dvw' } }}>
                      <Typography textAlign="center" paddingTop={2} variant="h4">
                        <b> {t('club title')}</b>
                      </Typography>

                      <Typography paddingBlockEnd={2} textAlign="center" fontSize={20} paddingTop={2}>
                        <b>{t('club dates')}</b>
                      </Typography>
                      <Typography textAlign="center" variant="subtitle1">
                        <Trans
                          i18nKey={'spinardi:fully written'}
                          components={[<p></p>,<b/>]}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
                      <BuyButton
                        label={t('btn exclusive club')}
                        price={cycle?.price!}
                        product_id={cycle?.product_id!}
                        cycleId={cycle?.id!}
                      />

                      <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                        <i>{t('written text')}</i>
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={2} md={2}>
                <Stack gap={2}>
                  <Box
                    sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}
                    paddingLeft={2}
                    paddingTop={2}
                    paddingRight={2}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        zIndex: 0,
                        top: '310px',
                        right: '0',
                        marginRight: 0,
                        marginTop: 0,
                        display: { xs: 'none', lg: 'block', sm: 'none', md: 'none' },
                      }}
                    >
                      <Image src="/img/spinardi/libros.webp" width={400} height={400}></Image>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
export default Header;
