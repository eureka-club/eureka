import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Footer from '@/components/layouts/Footer';
//import Button from 'react-bootstrap/Button';
import { Box } from '@mui/material';
import Link from 'next/link';
//import { Col, Row } from 'react-bootstrap';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { useRouter } from 'next/router';
import { Button, Grid, Stack } from '@mui/material';

const StripePaymentErrorPage: NextPage = () => {
  const { t } = useTranslation('stripe');
  const router = useRouter();

  return (
    <SimpleLayout title="Payment Error" showNavBar={false} showFooter={false}>
      <>
        <Box padding={3}>
          <Grid container>
            <Grid>
              <Grid>
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
              <Box
                paddingTop={3}
                sx={{
                  backgroundImage: { sm: "url('/registro_desktop_about_bg.webp')" },
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: { sm: `100% auto` },
                  height: { md: '450px' }, //lg:'500px'
                }}
              >
                <Grid>
                 
                    <Box
                      padding={3}
                      sx={{ paddingX: { xs: '1em', sm: '8em', md: '10em', lg: '20em', xl: '30em' } }}
                    >
                      <Grid container justifyContent="center" alignItems="center"
                      alignContent={'center'} >
                        <h1 className="text-primary text-center  mb-5">
                          <b>{t('errorText')}</b>
                        </h1>
                      </Grid>
                      <Grid container  justifyContent="center" alignItems="center"
                      alignContent={'center'}>
                        <p className="text-left mb-3">{t('errorExtraText')}</p>
                      </Grid>
                      <Grid container  justifyContent="center" alignItems="center"
                      alignContent={'center'}>
                        <p className="text-left  mb-3">{t('errorExtraText2')}</p>
                      </Grid>
                      <Grid container  justifyContent="center" alignItems="center"
                      alignContent={'center'}>
                        <p className="text-left  mb-5">
                          {t('errorExtraText3')}
                          <b>
                             <Link  href="mailto:hola@eureka.club">hola@eureka.club</Link>
                          </b>
                        </p>
                      </Grid>
                      <Grid container justifyContent="center"
                      alignItems="center"
                      alignContent={'center'}>
                        <Button variant="contained" size="large" onClick={() => router.push('/')}>
                         <b>{t('Try again')}</b> 
                        </Button>
                      </Grid>
                    </Box>
                 
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // if (session != null) {
  //   return { redirect: { destination: '/', permanent: false } };
  // }

  return { props: {} };
};

export default StripePaymentErrorPage;
