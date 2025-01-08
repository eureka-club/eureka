import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import Countdown from 'pages/participar/components/Countdown';
import Image from 'next/image';
import { Grid, Box } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';

const Header = () => {
  const { t } = useTranslation('spinardi');
  return (
    <>
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
      <Stack gap={2} paddingTop={0} paddingBottom={1} >
      
        <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}  paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Grid container gap={2} sx={{ justifyContent: 'left',alignItems:'left'}}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
              
              

                <Stack gap={2} >
                  <Box
                    sx={{ maxWidth: { lg: '100dvw', sm: '90dvw', xs: '100dvw' }, position: 'relative',
                    zIndex: 0,
                    top: '53px',
                    right: '16px',
                    marginRight: 0,
                    marginTop: 0,}}
                    paddingLeft={0}
                    paddingTop={0}
                    paddingRight={0}
                    
                  >
                    <Image src="/img/spinardi/muchachoh.webp" width={740} height={740}></Image>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={12} md={5}>
                <Stack gap={2} paddingTop={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw',md:'100dvw' } }}>
                      <Typography textAlign="center" paddingTop={2} variant="h4">
                        <b> {t('club title')}</b>
                      </Typography>

                      <Typography paddingBlockEnd={2} textAlign="center" fontSize={20} paddingTop={2}>
                       <b>{t('club dates')}</b> 
                      </Typography>
                      <Typography textAlign="center" variant="subtitle1">
                        {t('fully written')}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={4} paddingTop={2}>
                    <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '100dvw' } }}>
                      <BuySubscriptionButton
                        label={t('btn exclusive club')}
                        price="price_1QaOWZLbVcSeBXdQ7Nt4wPOr"
                        product_id="prod_RTLCazmGCcyKKH"
                        cycleId={30}
                      />
                      

                      
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
                        position:'absolute',
                        zIndex: 0,
                        top: '310px',
                        right: '0',
                        marginRight: 0,
                        marginTop: 0,
                        display: { xs: 'none', lg: 'block',sm:'none',md:'none' },
                      }}
                    >
                      <Image src="/img/spinardi/libros.webp"  width={400} height={400}></Image>
                      
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Stack>
    </>
  );
};
export default Header;
