import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Footer from '@/components/layouts/Footer';
//import Button from 'react-bootstrap/Button';
import { Box } from '@mui/material';
import Link from 'next/link';
//import {Col,Row} from 'react-bootstrap';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { useRouter } from 'next/router';
import { Session } from '@/src/types';
import {Button,Grid} from '@mui/material'
import EditUserForm from '@/src/components/forms/EditUserForm';

interface Props {
  session: Session
}

const StripePaymentSuccessPage: NextPage<Props> = ({ session }) => {
  const { t } = useTranslation('stripe');

  const router = useRouter();
  const [cycleId, setCycleId] = useState<string>('')

  useEffect(() => {
    if (router?.query) {
      if (router.query.cycleId) {
        setCycleId(router.query.cycleId?.toString())
      }
    }
  }, [router])

  //console.log(session, 'SESSION1 SESSION1 SESSION1')


  return (
    <SimpleLayout title="Payment Success" showNavBar={false} showFooter={false}>
      <>
        <Box padding={3}>
         
              <Grid container >
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
              </Grid>
              <Box padding={3}
                sx={{
                  backgroundImage: { sm:"url('/registro_desktop_about_bg.webp')"},
                  backgroundRepeat: "no-repeat",
                  backgroundSize: {sm:`100% auto`},
                  height: { sm: '500px', md: '450px' },//lg:'500px'
                }}
              >
                <Grid container justifyContent="center" alignItems="center" alignContent={'center'}>
                  <Box padding={3}>
                    <Grid container justifyContent="center" alignItems="center" alignContent={'center'}><h1 className='text-primary text-center  mb-5'><b>{t('successText')}</b></h1></Grid>
                    <Grid container justifyContent="center" alignItems="center" alignContent={'center'} ><h1 className='text-primary text-center   mb-5'><b>{t('successExtraText')}</b></h1></Grid>
                    {/*<Grid container justifyContent="center" alignItems="center" alignContent={'center'}>
                      <Button variant="contained" size="large"  onClick={() => router.push(`/cycle/${cycleId}`)} sx={{textTransform: 'none'}}>
                        <b>{t('successButtomText')}</b>
                      </Button>
                    </Grid>*/}
                    <EditUserForm/>
                  </Box>
                </Grid>
              </Box>
            
         
        </Box>
        {/* <Footer /> */}
      </>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // if (session != null) {
  //   return { redirect: { destination: '/', permanent: false } };
  // }

  return { props: { session } };
};

export default StripePaymentSuccessPage;
