'use client'
import { FC, useState, MouseEvent } from 'react';
import Footer from '@/src/components/layout/Footer';
import Button from 'react-bootstrap/Button';
import { Box } from '@mui/material';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import { useRouter,useSearchParams } from 'next/navigation';
import { Session } from '@/src/types';

import { useDictContext } from "@/src/hooks/useDictContext";
import LinearProgress from '@mui/material/LinearProgress';
import { useJoinUserToCycleAction } from '@/src/hooks/mutations/useCycleJoinOrLeaveActions';
import toast from 'react-hot-toast';
import { CycleDetail } from "@/src/types/cycle";
import { UserMosaicItem } from "@/src/types/user";

interface Props {
    session: Session;
    cycle: CycleDetail;
    participants: UserMosaicItem[];
}

const TransitionToPayCycle: FC<Props> = ({ session, cycle,participants }) => {

    const { t, dict } = useDictContext();

    const router = useRouter();
    //const [cycleId, setCycleId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    
    const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        setLoading(true);
        execJoinCycle();
        setLoading(false)

    };


    const {
        mutate: execJoinCycle,
        isPending: isJoinCycleLoading,
        data: mutationResponse,
        // isSuccess: isJoinCycleSuccess,
    } = useJoinUserToCycleAction(session!, cycle!, participants!, (_data, error) => {
        if (error)
            toast.error(t(dict, 'Internal Server Error'));
    });


    //console.log(session, 'SESSION1 SESSION1 SESSION1')


    return (
        // <SimpleLayout title="Welcome" showNavBar={false} showFooter={false}>
        <>
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
                                            <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>{t(dict,'tagline')}</p>
                                        </section>
                                    </aside>
                                </span>
                            </Link>
                        </Row>
                        <Box className='d-flex flex-column justify-content-center flex-xl-row'
                            sx={{
                                backgroundImage: { sm: "url('/registro_desktop_about_bg.webp')" },
                                backgroundRepeat: "no-repeat",
                                backgroundSize: { sm: `100% auto` },
                                height: { sm: '500px', md: '750px' },//lg:'500px'
                            }}
                        >
                            <Col className=' d-flex col-12 col-xl-6 d-flex  justify-content-center '>
                                <Box className=' d-flex flex-column mt-5 '>
                                    <Row className='p-3 '><h1 className='text-primary text-center  mb-5'><b>{t(dict,'JoinToPrivateCycleText')}</b></h1></Row>
                                    <Row className='p-3 '><h1 className='text-primary text-center   mb-5'><b>{t(dict,'CompleteRegistrationText')}</b></h1></Row>
                                    <Row className='w-100  p-2'>
                                        {!loading && <Button onClick={handleJoinCycleClick} className={`mb-4 btn btn-eureka  w-100`}>
                                            {t(dict,'ClickToPay')}
                                        </Button>}{loading && <LinearProgress className='mb-4' />}
                                    </Row>
                                </Box>
                            </Col>
                        </Box>
                    </Col>
                </Row>

            </Box>
            <Footer />
        </>
    );
};



export default TransitionToPayCycle;