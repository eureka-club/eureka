import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Footer from '@/components/layouts/Footer';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import SimpleLayout from '@/src/components/layouts/SimpleLayout'
import { useRouter } from 'next/router';
import {Button} from '@mui/material'

const StripePaymentCancelPage: NextPage = () => {
  const { t } = useTranslation('stripe');
  const router = useRouter();

  return (
    <SimpleLayout title="Payment Cancel" showNavBar={false} showFooter={false}>
      <>
        <Box>
              <Box padding={3}>
                <Link href="/" replace >
                  <a className="d-flex align-items-center">
                    <aside className="d-flex justify-content-around align-items-center">
                      {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
                      <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                      <section>
                        <div className={`text-secondary ms-3 h4 mb-0 `}>Eureka</div>
                        <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>{t('navbar:tagline')}</p>
                      </section>
                    </aside>
                  </a>
                </Link>
              </Box>
              <Box
                sx={{
                  backgroundImage: { sm: "url('/registro_desktop_about_bg.webp')" },
                  backgroundRepeat: "no-repeat",
                  backgroundSize: { sm: `100% auto` },
                  height: { xs: '500px', md: '750px' },//lg:'500px'
                }}
              >
                <Stack alignItems={'center'} justifyContent={'center'} paddingTop={5}>
                  <Stack direction={'column'} gap={6}>
                      <Typography variant='h5' fontWeight={'bold'} color={'primary'}>{t('cancelText')}</Typography>
                      <Typography variant='h5' fontWeight={'bold'} color={'primary'}>{t('cancelExtraText')}</Typography>
                      <Button variant='contained' onClick={() => router.push('/')}>
                        {t('VisitEureka')}
                      </Button>
                  </Stack>
                </Stack>
              </Box>
        </Box>
        <Footer />
      </>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const session = await getSession(ctx);
  // if (session != null) {
  //   return { redirect: { destination: '/', permanent: false } };
  // }
  return { props: {} };
};
export default StripePaymentCancelPage;
