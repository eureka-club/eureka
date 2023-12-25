'use client'
import { signIn } from 'next-auth/react';
import { FunctionComponent, useState, MouseEvent, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@tanstack/react-query';
import { Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import styles from './SignUpJoinToCycleForm.module.css';
import MosaicItem from '@/src/components/cycle/MosaicItem';
import { CycleContext } from '@/src/hooks/useCycleContext';
import useCycle from '@/src/hooks/useCycle';
import UserAvatar from '@/src/components/common/UserAvatar';
import CycleDetailWorks from '@/app/[lang]/cycle/[id]/component/CycleDetailWorks';
import Footer from '@/src/components/layout/Footer';
import { TextField, Box } from '@mui/material';
import { DATE_FORMAT_LARGE } from '@/src/constants/index';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Session } from '@/src/types';
import { useJoinUserToCycleAction } from '@/src/hooks/mutations/useCycleJoinOrLeaveActions'
import useUser from '@/src/hooks/useUser';
import useUsers from '@/src/hooks/useUsers'
import { useCyclePrice } from '@/src/hooks/useCyclePrices';
import LinearProgress from '@mui/material/LinearProgress';
import { CycleMosaicItem } from "@/src/types/cycle";
import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";


interface Props {
  cycle?: CycleMosaicItem;
  session?: Session
}

interface FormValues {
  identifier: string;
  password: string;
  name: string,
  lastname: string,
  // language: string
}

const SignUpJoinToCycleForm: FunctionComponent<Props> = ({ cycle, session }) => {
  const { dict, langs } = useDictContext();
  const asPath = usePathname();
  const searchParams = useSearchParams();

  //const { data: session, status } = useSession();
  //const formRef = useRef<HTMLFormElement>(null);
  //const [idSession, setIdSession] = useState<string>('')
  const [formValues, setFormValues] = useState<FormValues>({
    identifier: '',
    password: '',
    name: '',
    lastname: ''
    // language: '',
  });
  const [loading, setLoading] = useState(false)

  interface MutationProps {
    identifier: string;
    password: string;
    fullName: string;
    joinToCycle: number;

    // language: string
  }


  function handleChangeTextField(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    ev.preventDefault();
    const { name, value } = ev.target;
    //console.log(name, value, 'name, value')
    setFormValues({
      ...formValues,
      [name]: value
    });
  }

  const router = useRouter();
  //const [cycleId, setCycleId] = useState<string>('')
  const [haveAccount, setHaveAccount] = useState<boolean>(false)

  // useEffect(() => {
  //   if (router?.query) {
  //     if (router.query.cycleId) {
  //       setCycleId(router.query.cycleId?.toString())
  //     }
  //   }
  // }, [router])

  // useEffect(() => {
  //   const s = session;
  //   if (s) {
  //     setIdSession(s.user.id.toString());
  //   }
  // }, [session]);


  //const { data: cycle, isLoading: isLoadingCycle } = useCycle(+cycleId, { enabled: !!cycleId })


 
  const { data: { price, currency } = { currency: '', price: -1 } } = useCyclePrice(cycle);
  
  const works = cycle?.cycleWorksDates?.length
    ? cycle?.cycleWorksDates
    : cycle?.works.map(w => ({ id: w.id, workId: w.id, work: w, startDate: new Date(), endDate: new Date() }))

  const whereCycleParticipants = {
    where: {
      OR: [
        { cycles: { some: { id: cycle?.id } } },//creator
        { joinedCycles: { some: { id: cycle?.id } } },//participants
      ],
    }
  };
  const { data: participants, isLoading: isLoadingParticipants } = useUsers(whereCycleParticipants,
    {
      enabled: !!cycle?.id,
      from: 'cycle/Mosaic'
    }
  )

  //const { data: user } = useUser(+session!.user.id, { enabled: !!+session!.user.id });

  const handleHaveAccountLink = (ev: MouseEvent<HTMLButtonElement>) => {
    setFormValues({
      identifier: '',
      password: '',
      name: '',
      lastname: ''
    });
    setHaveAccount(!haveAccount);

  }


  const handleSignUpGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    let callbackUrl = `/cycle/${cycle!.id}?join=true`;

    if (cycle?.access == 2)
      callbackUrl = `/transitionJoinPrivateCycle`;

    if (cycle?.access == 4)
      callbackUrl = `/transitionSignUpToPayCycle/${cycle!.id}`;


    signIn('google', { callbackUrl });
  };

  const userRegistered = async (email: string) => {
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if (res.ok) {
      return res.json();
    }
    return null;
  };

  const { mutate, isPending: isMutating } = useMutation(
    {
      mutationFn: async (props: MutationProps) => {
        const { identifier, password, fullName } = props;
        const res = await fetch('/api/userCustomData', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            identifier,
            password,
            fullName,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          //const callbackUrl = `/cycle/${router.query.cycleId}?join=true`;

          let callbackUrl = `/cycle/${cycle!.id}?join=true`;

          if (cycle?.access == 2)
            callbackUrl = `/transitionJoinPrivateCycle`;

          if (cycle?.access == 4)
            callbackUrl = `/transitionSignUpToPayCycle/${cycle!.id}`;

          signIn('email', { ...callbackUrl && { callbackUrl }, email: identifier });
          // return data;
        } else {
          toast.error(t(dict,res.statusText));
          setLoading(false);
        }
        return null;
      }
      
    });

  const validateEmail = (text: string) => {
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (!text.match(emailRegex)) {
      return false;
    }
    return true;
  };

  const validatePassword = (text: string) => {
    if (text.length < 8) {
      return false;
    }
    if (!text.match(/[a-zA-z]/g)) {
      return false;
    }
    if (!text.match(/\d/g)) {
      return false;
    }
    return true;
  };

  const handleSubmitSignIn = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const joinToCycle = cycle!.id || -1;
    const email = formValues.identifier;
    const password = formValues.password;
    setLoading(true);

    if (!email) {
      toast.error(t(dict,'EmailRequired'))
      setLoading(false)

      return false;
    }
    if (!password) {
      toast.error(t(dict, 'PasswordRequired'))
      setLoading(false)
      return false;
    }
    if (email && password) {

      if (!validateEmail(email)) {
        toast.error(t(dict, 'InvalidMail'));
        return false;
      }

      const ur = await userRegistered(email);
      if (!ur) {
        toast.error('Error');
        setLoading(false)

        return;
      }
      if (ur.isUser) {
        if (!ur.provider && !ur.hasPassword) {
          toast.error(t(dict, 'RegisterAlert'))
          setLoading(false)
        }
        else if (ur.provider == 'google') {
          toast.error(t(dict, 'RegisteredUsingGoogleProvider'))
          setLoading(false)
        }
        else {
          let callbackUrl = localStorage.getItem('loginRedirect')?.toString() || '/';;
          // ? `/cycle/${joinToCycle}`
          // : localStorage.getItem('loginRedirect')?.toString() || '/';

          if (!!joinToCycle && joinToCycle > 0) {

            callbackUrl = `/cycle/${cycle!.id}?join=true`;

            if (cycle?.access == 2)
              callbackUrl = `/transitionJoinPrivateCycle`;

            if (cycle?.access == 4)
              callbackUrl = `/transitionSignUpToPayCycle/${cycle!.id}`;
          }


          signIn('credentials', {
            callbackUrl,
            email: email,
            password: password
          })
            .then(res => {
              const r = res as unknown as { error: string }


              if (res && r.error) {
                toast.error(t(dict, 'InvalidSesion'))
                //setLoading(false)
              }
              else {
                close()
                const sp = searchParams.toString();
                localStorage.setItem('loginRedirect', `${asPath}/?${sp}`);
                router.push(localStorage.getItem('loginRedirect') || '/')
              }
            })
        }
      }
      else {
        toast.error(t(dict, 'isNotUser'))
        setLoading(false)

      }
    }

  }


  const handleSubmitSignUp = async (ev: FormEvent<HTMLFormElement>) => {
    //mutate user custom data
    ev.preventDefault();

    const email = formValues.identifier;
    const password = formValues.password;
    // const language = formValues.language;
    const fullName = formValues.name + ' ' + formValues.lastname;
    setLoading(true)
    //console.log(formValues)

    if (email && password && fullName) {//&& language
      if (!validateEmail(email)) {
        toast.error(t(dict, 'InvalidMail'));
        setLoading(false)
        return false;
      }

      if (!validatePassword(password)) {
        toast.error(t(dict, 'InvalidPassword'));
        setLoading(false)
        return false;
      }

      

      const ur = await userRegistered(email);
      if (!ur) {
        toast.error(t(dict, 'Error'));
        setLoading(false)
        return;
      }
      if (!ur.isUser || !ur.hasPassword) {
        mutate({
          identifier: email,
          password: password,
          //language,
          fullName,
          joinToCycle: cycle!.id || -1
        });
      } else {
        toast.error(t(dict, 'UserRegistered'));
        setLoading(false)
        return;
      }

    } else {
      toast.error(t(dict, 'emptyFields'));
      setLoading(false)
    }

  };

  const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setLoading(true);
    execJoinCycle();
    if (session && cycle?.access == 1)
      router.push(`/cycle/${cycle.id}`);
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

  const handlerRecoveryLogin = () => {
    close()
    router.push("/recoveryLogin")
  }

  //border border-1"  style={{ borderRadius: '0.5em'}}
  if (cycle)
    return (
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
                        <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                        <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>{t(dict,'tagline')}</p>
                      </section>
                    </aside>
                  </span>
                </Link>
              </Row>
            </Col>
            <Col className='col-12'>
              {/* <Row className='bg-primary d-flex align-items-center' style={{ height: '.2rem', fontSize: '1.2em' }}>
              </Row> */}
            </Col>
            <Box
              sx={{
                display: { xs: 'block', sm: 'none' },
                //backgroundColor: { xs: '#f7f7f7' },
              }}
            ><section className='mt-3'>
                <Image src="/pelicula.webp" width={200}
                  height={120}
                  alt=""></Image></section>
            </Box>
            <Box className='d-flex flex-column flex-xl-row'
              sx={{
                backgroundImage: { sm: "url('/registro_movil_bg.webp')", lg: "url('/registro_desktop_bg.webp')" },
                //backgroundColor: { xs:'#f7f7f7'},
                backgroundRepeat: "no-repeat",
                backgroundSize: { sm: `cover`, xl: `100% 600px` },
                height: { sm: '1000px', lg: 'auto' },
                width: '100%',
              }}
            >
              {/* <section className='d-flex d-md-none justify-content-end aling-items-end me-1 mt-sm-5'>
                <div className=' d-flex flex-column justify-content-center align-items-baseline me-1'>
                  <span className=' ' style={{ fontSize: '.6em', fontStyle: 'italic' }}>Organizado por:</span>
                  <span className=' ' style={{ fontSize: '.8em' }}>{cycle.creator.name}</span>
                </div>
,                <Row className=''>
                  <UserAvatar className='d-flex justify-content-center' size={'md'} width={75} height={75} userId={cycle.creatorId} showName={false} />
                </Row>
              </section> */}
              <Col className={`col-12 col-xl-6 mt-lg-4`}>
                <div className='p-3 d-flex flex-column justify-content-center align-items-center'>
                  <Box sx={{ width: ['100%', '60%', '40%', '90%', '100%'], paddingTop: { sm: '5em' }, paddingLeft: { lg: '10em', xl: '21em' } }} >

                    <section className=''>
                      <Row className='mb-2'>
                        <span className='text-center ' style={{ fontSize: '.8em', fontStyle: 'italic' }}>{t(dict, "OrganinedBy")}</span>
                      </Row>
                      <Row className='mb-2'>
                        <UserAvatar className='d-flex justify-content-center' size={'xl'} width={75} height={75} userId={cycle.creatorId} showName={false} />
                      </Row>
                      <Row className='mb-4'>
                        <span className='text-center ' style={{ fontSize: '1em' }}>{cycle.creator.name}</span>
                      </Row>
                    </section>
                    <Row className='mb-4 d-none d-md-flex justify-content-center align-items-center' style={{ fontSize: '1.6em', fontStyle: 'italic' }}>
                      <span className='text-center'><b>{(cycle.title).toUpperCase()}</b></span>
                    </Row>
                    <Row className='mb-4 d-flex d-md-none justify-content-center align-items-center' style={{ fontSize: '1.2em', fontStyle: 'italic' }}>
                      <span className='text-center'><b>{(cycle.title).toUpperCase()}</b></span>
                    </Row>
                    <Row className='mb-4 d-none d-md-flex' style={{ fontSize: '1.4em', fontStyle: 'italic' }}>
                      <span className='text-center '>{dayjs(cycle?.startDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_LARGE)} - {dayjs(cycle?.endDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_LARGE)}</span>
                    </Row>
                    <Row className='mb-4 d-flex d-md-none' style={{ fontSize: '1em', fontStyle: 'italic' }}>
                      <span className='text-center '>{dayjs(cycle?.startDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_LARGE)} - {dayjs(cycle?.endDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_LARGE)}</span>
                    </Row>
                    <Row className='mb-4 ' >
                      <Box sx={{ padding: '1em' }}>
                        <a href='#FormContainer'>
                          <Button className={`mb-xl-4 btn btn-eureka  w-100`}>
                            <Box sx={{}}>{t(dict, 'WantToJoin')}</Box>
                          </Button></a>
                      </Box>
                    </Row>
                  </Box>
                </div>
              </Col>
              <Col className={`col-12 col-xl-6 my-xl-5`}>
                <Box sx={{ ml: { xl: '6em' } }} className='d-flex justify-content-center justify-content-xl-start align-items-center align-items-xl-start'>
                  <CycleContext.Provider value={{ linkToCycle: false, showShare: false, cycle: cycle }}>
                    <MosaicItem
                      cycleId={cycle.id}
                      showTrash
                      detailed={false}
                      showSaveForLater={false}
                      showCreateEureka={false}
                      showJoinOrLeaveButton={false}
                      showSocialInteraction={false}
                      className="mt-1"
                      cacheKey={['CYCLE', `${cycle.id}`]}
                      size={'xxl'}
                    />
                  </CycleContext.Provider>
                </Box>
              </Col>
              <Box className=' w-100 mt-5'
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  justifyContent: { xs: 'flex-end' },
                  //backgroundColor: { xs: '#f7f7f7' },
                }}
              > <Image className='' src="/libro.webp" width={180}
                height={284}
                alt=""></Image></Box>
            </Box>
          </Row>

          {cycle.contentText != null && (<>


            <Col className='col-12'>
              <Box className='d-flex flex-column flex-xl-row'
                sx={{
                  backgroundImage: { sm: "url('/registro_desktop_about_bg.webp')" },
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `100% auto`,
                  paddingTop: { sx: '4em' }
                  // height: ['100%'],
                  // width: '100%',
                }}
              >
                <Box className='' sx={{ paddingX: { xs: '2em', sm: '7em', md: '12em', lg: '15em', xl: '25em' }, paddingY: { xs: '3em', sm: '6em' } }}>
                  <div className="">
                    <Box className="" sx={{ width: '1', paddingX: { lg: '2em' }, fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}> <span className='text-primary text-center mb-3  '><b>{t(dict, 'WhyJoin')}</b></span></Box>
                    <div
                      className={styles.dangerouslySetInnerHTML}
                      dangerouslySetInnerHTML={{ __html: cycle.contentText }}
                    />
                  </div>
                </Box>
              </Box>
            </Col></>)
          }

          <Col className='col-12'>
            <Row className='bg-primary d-flex justify-content-center align-items-center' style={{ height: '5rem' }}>
              <Box sx={{ fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}><p className='text-center text-white mt-2'>{t(dict, 'ManifestoText1').toUpperCase()}<br></br>
                {t(dict, 'ManifestoText2')}<a href="/manifest" target="_blank" className='text-white text-decoration-underline' onClick={() => window.scrollTo(0, 0)}>{t(dict, 'Manifesto')}</a></p>
              </Box>
            </Row>
          </Col>
          <Col className='col-12'>
            <Box className='d-flex flex-column flex-xl-row'
              sx={{
                backgroundImage: {
                  sm: "url('/registro_desktop_works.webp')"
                },
                backgroundRepeat: "no-repeat",
                backgroundSize: `100% auto`,
                // height: ['100%'],
                // width: '100%',
              }}
            >
              <Box className='d-flex flex-column justify-content-center align-items-center' sx={{ paddingX: { md: '8em', lg: '15em', xl: '25em' }, paddingY: '4em' }}>
                <Box className="" sx={{ width: '1', paddingX: { xs: '2em', sm: '7em', lg: '2em' }, fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}> <span className='text-primary text-center mb-3  '><b>{t(dict, 'CurationText')}</b></span></Box>
                {works && <CycleDetailWorks size={'md'} cycleWorksDates={works!} showSocialInteraction={false} showHeader={false} /> || ''}
              </Box>
            </Box>
          </Col>
          <Col className='col-12'>
            <Row id='FormContainer' className='bg-secondary d-flex align-items-center' style={{ height: '3rem' }}>
              {cycle.access == 4 && price != -1 ? <Box sx={{ fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}>
                <span className='text-center text-white'>{t(dict,'MembershipFee')} {`$${price} ${currency}`}</span> </Box> : <></>}
            </Row>
          </Col>
          <Col className='col-12'>
            <Box  className="mt-5" sx={{ width: '1', paddingX: { xs: '2em', sm: '7em', lg: '2em' }, fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}>
              <span className='text-primary text-center'><b>{t(dict, 'JoinOurClub')}</b></span>
            </Box>
            <Box className='d-flex justify-content-center'
              sx={{
                backgroundImage: { sm: "url('/registro_desktop_form_bg.webp')" },
                backgroundRepeat: "no-repeat",
                backgroundSize: `100% auto`,
                // height: ['100%'],
                // width: '100%',
              }}
            >

              <Box className='py-4' 
                sx={{ width: ['90%', '60%', '40%', '30%', '25%'] }}>
                {/*CASO CUANDO HAY SESSION*/}
                {session && <>
                  <Box >
                    {!loading && <Button onClick={handleJoinCycleClick} className={`mb-4 btn btn-eureka  w-100`}>
                      {t(dict, 'I want to register now')}
                    </Button>}{loading && <LinearProgress className='mb-4' />}
                  </Box>
                </>}
                {/*CASO CUANDO NO HAY SESSION*/}
                {!session &&
                  <><button
                    type="button"
                    onClick={handleSignUpGoogle}
                    className={`d-flex justify-content-center   ${styles.buttonGoogleSignUpJoinCycle}`}
                  >
                    <div
                      className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}
                    >
                      <img className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" />
                    {t(dict, 'joinViaGoogle')}
                    </div>
                  </button>
                  <p className={`my-2 ${styles.alternativeLabelSignUpJoinCycle}`}>{t(dict, 'alternativeText')}</p>
                    {!haveAccount && <Form onSubmit={handleSubmitSignUp} className='mt-2'>
                    <TextField id="name" className="w-100 mb-4 " label={`${t(dict, 'Name')}`}
                        variant="outlined" size="small" name="name"
                        value={formValues.name!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>
                      <TextField id="lastname" className=" w-100 mb-4" label={`${t(dict,'LastName')}`}
                        variant="outlined" size="small" name="lastname"
                        value={formValues.lastname!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                    <TextField id="email" className="w-100 mb-4" label={`${t(dict, 'emailFieldLabel')}`}
                        variant="outlined" size="small" name="identifier"
                        value={formValues.identifier!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                    <TextField id="pass" className="w-100 mb-4" label={`${t(dict, 'passwordFieldLabel')}`}
                        variant="outlined" size="small" name="password"
                        value={formValues.password!}
                        autoComplete="current-password"
                        type="password"
                      helperText={`(${t(dict, 'passRequirements')})`}
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <Box >
                        <p
                          className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                        >
                        {t(dict, 'HaveAccounttext')}
                          <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`} onClick={handleHaveAccountLink}>
                          {t(dict, 'clic')}
                          </span>
                        {t(dict, 'joinClub')}
                        </p>
                      </Box>

                      <Box >
                        {!loading && <Button type="submit" disabled={loading} className={`mb-4 btn btn-eureka  w-100`}>
                        {t(dict, 'I want to register now')}
                        </Button>} {loading && <LinearProgress className='mb-4' />}
                      </Box>
                      <p
                        className={`text-center align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                      >
                      {t(dict, 'joinedCycleSignInTerms')}
                        <Link href="/manifest" passHref>
                          <span className={` cursor-pointer ms-1 me-1 ${styles.linkText}`}>
                          {t(dict, 'termsText')}
                          </span>
                        </Link>
                      {t(dict, 'and')}
                        <Link href="/policy" passHref>
                        <span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t(dict, 'policyText')}</span>
                        </Link>
                      </p>


                    </Form>}

                    {haveAccount && <Form onSubmit={handleSubmitSignIn} className='mt-2'>

                    <TextField id="email" className="w-100 mb-2" label={`${t(dict, 'emailFieldLabel')}`}
                        variant="outlined" size="small" name="identifier"
                        value={formValues.identifier!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>
                      <div className='d-flex justify-content-between mb-1'><div></div>
                      <Button onClick={handlerRecoveryLogin} variant="link" className={`btn-link d-flex link align-items-end cursor-pointer text-gray`} style={{ fontSize: '.8em' }}>{t(dict, 'forgotPassText')}</Button>
                      </div>
                    <TextField id="pass" className="w-100 mb-4" label={`${t(dict, 'passwordFieldLabel')}`}
                        variant="outlined" size="small" name="password"
                        value={formValues.password!}
                        autoComplete="current-password"
                        type="password"
                      helperText={`(${t(dict, 'passRequirements')})`}
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <Box >
                        <p
                          className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                        >
                        {t(dict, 'dontHaveAccounttext')}
                          <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`} onClick={handleHaveAccountLink}>
                          {t(dict, 'clic')}
                          </span>
                        {t(dict, 'joinClub')}
                        </p>
                      </Box>


                      <Box >
                        {!loading && <Button type="submit" disabled={loading} className={`mb-4 btn btn-eureka  w-100`}>
                        {t(dict, 'I want to register now')}
                        </Button>} {loading && <LinearProgress className='mb-4' />}
                      </Box>



                    </Form>}

                  </>}
                <Box className='mt-5 w-100'
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                    justifyContent: { xs: 'flex-end' },
                    marginLeft: '40px'

                  }}
                > <Image src="/mano2.webp" width={250}
                  height={250}
                  alt=""></Image>
                </Box>

              </Box>

            </Box>

          </Col >
        </Box >
      </>
    );
  else
    return (<></>)
};

export default SignUpJoinToCycleForm;
