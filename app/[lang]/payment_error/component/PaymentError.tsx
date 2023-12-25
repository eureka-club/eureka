'use client'
import { FC } from "react";
import { useRouter } from 'next/navigation';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Box } from '@mui/material';
import Link from 'next/link';
import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";
import { Session } from "@/src/types";

interface Props {
    session: Session | null;
}

const PaymentError: FC<Props> = ({ session }) => {
   
    const { dict, langs } = useDictContext();
    const router = useRouter();

    return (
                <Box >
                    <Row className="d-flex justify-content-between">
                        <Col className='col-12'>
                            <Row className='p-4'>
                                <Link href="/" replace >
                                    <span className="d-flex align-items-center">
                                        <aside className="d-flex justify-content-around align-items-center">
                                            {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
                                            <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                                            <section>
                                                <div className={`text-secondary ms-3 h4 mb-0 `}>Eureka</div>
                                                <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>{t(dict, 'tagline')}</p>
                                            </section>
                                        </aside>
                                    </span>
                                </Link>
                            </Row>
                            <Box className='d-flex flex-column flex-xl-row'
                                sx={{
                                    backgroundImage: { sm: "url('/registro_desktop_about_bg.webp')" },
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: { sm: `100% auto` },
                                    height: { md: '750px' },//lg:'500px'
                                }}
                            >
                                <Col className=' d-flex w-100 justify-content-center mt-5'>
                                    <Box className=' d-flex flex-column'
                                        sx={{ paddingX: { xs: '1em', sm: '8em', md: '10em', lg: '20em', xl: '30em' } }}>
                                        <Row className='p-3 '><h1 className='text-primary text-center  mb-5'><b>{t(dict, 'errorText')}</b></h1></Row>
                                        <Row className='py-1'><p className='text-left mb-3'>{t(dict, 'errorExtraText')}</p></Row>
                                        <Row className='py-2'><p className='text-left  mb-3'>{t(dict, 'errorExtraText2')}</p></Row>
                                        <Row className='py-2'><p className='text-left  mb-5'>{t(dict, 'errorExtraText3')}<b><u>hola@eureka.club.</u></b></p></Row>
                                        <Row className='w-100 p-2'>
                                            <Button className={`mt-4 btn btn-eureka  `} onClick={() => router.push('/')}>
                                                {t(dict, 'Try again')}
                                            </Button>
                                        </Row>
                                    </Box>
                                </Col>
                            </Box>
                        </Col>
                    </Row>
                </Box >
    );
};



export default PaymentError;
