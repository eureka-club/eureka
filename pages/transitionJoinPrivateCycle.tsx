import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Footer from '@/components/layouts/Footer';
import Button from 'react-bootstrap/Button';
import { Box } from '@mui/material';
import Link from 'next/link';
import {Col,Row} from 'react-bootstrap';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { useRouter } from 'next/router';
import { Session } from '@/src/types';

interface Props {
  session: Session
}

const TransitionJoinPrivateCyclePage: NextPage<Props> = ({ session }) => {
  const { t } = useTranslation('common');

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
    <SimpleLayout title="Welcome" showNavBar={false} showFooter={false}>
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
              <Box className='d-flex flex-column justify-content-center  flex-xl-row'
                sx={{
                  backgroundImage: { sm:"url('/registro_desktop_about_bg.webp')"},
                  backgroundRepeat: "no-repeat",
                  backgroundSize: {sm:`100% auto`},
                  height: { sm: '500px', md: '750px' },//lg:'500px'
                }}
              >
                <Col className=' d-flex col-12 col-xl-6 mt-5'>
                  <Box className=' d-flex flex-column '>
                    <Row className='p-3 '><h1 className='text-primary text-center  mb-5'><b>{t('JoinToPrivateCycleText')}</b></h1></Row>
                    <Row className='p-3 '><h1 className='text-primary text-center   mb-5'><b>{t('privateCycleJoinRequestText')}</b></h1></Row>
                    <Row className='w-100  p-2'>
                      <Button className={`mt-4 btn btn-eureka  w-100`} onClick={() => router.push(`/`)}>
                        {t('InMeantimeButtonText')}
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

  return { props: { session } };
};

export default TransitionJoinPrivateCyclePage;
