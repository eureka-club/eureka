import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect, MouseEvent } from 'react';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Footer from '@/components/layouts/Footer';
import { Box } from '@mui/material';
import Link from 'next/link';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { useRouter } from 'next/router';
import { Session } from '@/src/types';
import LinearProgress from '@mui/material/LinearProgress';
import { useJoinUserToCycleAction } from '@/src/hooks/mutations/useCycleJoinOrLeaveActions';
import useCycle from '@/src/useCycleDetail';
import useUsers from '@/src/useUsers';
import toast from 'react-hot-toast';
import useUserSumary from '@/src/useUserSumary';
import { CycleSumary } from '@/src/types/cycle';
import { Grid, Button, Stack } from '@mui/material/';

interface Props {
  session: Session;
}

const TransitionSignUpToPayCyclePage: NextPage<Props> = ({ session }) => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const [cycleId, setCycleId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [idSession, setIdSession] = useState<string>('');

  useEffect(() => {
    if (router?.query) {
      if (router.query.cycleId) {
        setCycleId(router.query.cycleId?.toString());
      }
    }
  }, [router]);

  useEffect(() => {
    const s = session;
    if (s) {
      setIdSession(s.user.id.toString());
    }
  }, [session]);

  const { data: cycle, isLoading: isLoadingCycle } = useCycle(+cycleId, { enabled: !!cycleId });

  const whereCycleParticipants = {
    where: {
      OR: [
        { cycles: { some: { id: cycle?.id } } }, //creator
        { joinedCycles: { some: { id: cycle?.id } } }, //participants
      ],
    },
  };

  const { data: participants, isLoading: isLoadingParticipants } = useUsers(whereCycleParticipants, {
    enabled: !!cycle?.id,
    from: 'cycle/Mosaic',
  });

  const { data: user } = useUserSumary(+idSession, { enabled: !!+idSession });

  //console.log(session, 'SESSION1 SESSION1 SESSION1')

  const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setLoading(true);
    execJoinCycle();
    setLoading(false);
  };

  const {
    mutate: execJoinCycle,
    isLoading: isJoinCycleLoading,
    data: mutationResponse,
    // isSuccess: isJoinCycleSuccess,
  } = useJoinUserToCycleAction(user!, cycle as unknown as CycleSumary, (_data, error) => {
    if (error) toast.error(t('Internal Server Error'));
  });

  return (
    <SimpleLayout title="Welcome" showNavBar={false} showFooter={false}>
      <>
        <Box padding={3} >
          
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
                   height: { sm: '500px', md: '450px' }, //lg:'500px'
                 }}
              >
              <Grid container direction="column" justifyContent="center" alignItems="center" paddingTop={3}>
                <Stack direction="column" justifyContent="center" alignItems="center" alignContent={'center'}>
                 
                    <Grid container justifyContent="center" alignItems="center" paddingTop={3}>
                      <h1 className="text-primary text-center  mb-5">
                        <b>{t('JoinToPrivateCycleText')}</b>
                      </h1>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" paddingTop={3}>
                      <h1 className="text-primary text-center   mb-5">
                        <b>{t('CompleteRegistrationText')}</b>
                      </h1>
                    </Grid >
                    <Grid container  justifyContent="center" alignItems="center" paddingTop={3}>
                      {!loading && (
                        <Button onClick={handleJoinCycleClick} variant="contained" size="large" sx={{textTransform: 'none'}} >
                          {t('ClickToPay')}
                        </Button>
                      )}
                      {loading && <LinearProgress className="mb-4" />}
                    </Grid>
                  
                </Stack>
              </Grid>
            </Box>
          
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

export default TransitionSignUpToPayCyclePage;
