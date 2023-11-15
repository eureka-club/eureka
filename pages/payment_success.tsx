import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Footer from '@/components/layouts/Footer';
import Button from 'react-bootstrap/Button';
import { Box } from '@mui/material';
import Link from 'next/link';
import {Col,Row} from 'react-bootstrap';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';

const StripePaymentSuccessPage: NextPage = () => {
  const { t } = useTranslation('stripe');

  return (
    <SimpleLayout title="Payment Success" showNavBar={false} showFooter={false}>
      <>
        <Box >
          <Row className="d-flex justify-content-between">
            <Col className='col-12'>
              <Row className='p-4'>
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
              </Row>
              <Box className='d-flex flex-column flex-xl-row'
                sx={{
                  backgroundImage: "url('/registro_desktop_about_bg.webp')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `100% auto`,
                  height: { xs: '500px', md: '700px' },//lg:'500px'
                }}
              >
                <Col className=' d-flex w-100 justify-content-center align-items-center '>
                  <Box className=' d-flex flex-column justify-content-center align-items-center '>
                    <Row className='p-3 '><h1 className='text-primary text-center  mb-5'><b>{t('successText')}</b></h1></Row>
                    <Row className='p-3 '><h1 className='text-primary text-center   mb-5'><b>{t('successExtraText')}</b></h1></Row>
                    <Row className='w-100  p-2'>
                      <Button  className={`mt-4 btn btn-eureka  w-100`}>
                        {t('successButtomText')}
                      </Button>
                    </Row>
                  </Box>
                </Col>
              </Box>
            </Col>
            </Row>
         
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

export default StripePaymentSuccessPage;
