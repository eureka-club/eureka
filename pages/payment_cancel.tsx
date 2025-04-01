import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { Box } from '@mui/material';
import Link from 'next/link';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { useRouter } from 'next/router';
import { Button, Grid, Stack } from '@mui/material';

const StripePaymentCancelPage: NextPage = () => {
  const { t } = useTranslation('stripe');
  const router = useRouter();

  return (
    <SimpleLayout title="Payment Cancel" showNavBar={false} showFooter={false}>
      <>
        <Box padding={3}>
          <Grid container>
            <Link href="/" replace>
              <a className="d-flex align-items-center">
                <aside className="d-flex justify-content-around align-items-center">
                  {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
                  <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                  <section>
                    <div className={`text-secondary ms-3 h4 mb-0 `}>Eureka</div>
                    <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>
                      {t('navbar:tagline')}
                    </p>
                  </section>
                </aside>
              </a>
            </Link>
          </Grid>
          <Box padding={3}
            
            sx={{
              backgroundImage: { sm: "url('/registro_desktop_about_bg.webp')" },
              backgroundRepeat: 'no-repeat',
              backgroundSize: { sm: `100% auto` },
              height: { xs: '500px', md: '450px' }, //lg:'500px'
              
            }}
          >
            <Grid container direction="row" justifyContent="center" alignItems="center" paddingTop={2} >
              <Stack direction="column" justifyContent="center" alignItems="center" alignContent={'center'}>
                <Box paddingX={1} sx={{ maxWidth: { lg: '60dvw', sm: '80dvw', xs: '80dvw',md:'60dvw' } }} justifyContent="center" alignItems="left" textAlign={'left'}>
                  <Grid>
                    <h1 className="text-primary text-center mb-4">
                      <b>{t('cancelText')}</b>
                    </h1>
                  </Grid>
                  <Grid>
                    <h1 className="text-primary text-center mb-4">
                      <b>{t('cancelExtraText')}</b>
                    </h1>
                  </Grid>
                  <Grid container justifyContent="center" alignItems="center" alignContent={'center'}>
                    <Button variant="contained" size="large" onClick={() => router.push('/')} sx={{textTransform: 'none'}}>
                      <b>{t('VisitEureka')}</b>
                    </Button>
                  </Grid>
                </Box>
              </Stack>
            </Grid>
          </Box>
        </Box>
      {/*<Footer />*/}  
      </>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // if (session != null) {
  // return { redirect: { destination: '/', permanent: false } };
  // }

  return { props: {} };
};

export default StripePaymentCancelPage;
