import { signIn } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState, MouseEvent, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useMutation } from 'react-query';
import { Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import styles from './SignUpJoinToCycleForm.module.css';
import useCycle from '@/src/useCycle';
import { TextField, Box } from '@mui/material';
import useUsers from '@/src/useUsers'
import { useCyclePrice } from '@/src/hooks/useCyclePrices';
import LinearProgress from '@mui/material/LinearProgress';



interface Props {
  noModal?: boolean;
  //session: Session
}

interface FormValues {
  identifier: string;
  password: string;
  name: string,
  lastname: string,
  // language: string
}

const SignUpJoinToCycleSimpleForm: FunctionComponent<Props> = ({ noModal = false}) => {
  const { t } = useTranslation('signUpForm');
 
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

  //console.log(session, 'SESSION1 SESSION1 SESSION1')


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
  const [cycleId, setCycleId] = useState<string>('')
  const [haveAccount, setHaveAccount] = useState<boolean>(false)

  useEffect(() => {
    if (router?.query) {
      if (router.query.cycleId) {
        setCycleId(router.query.cycleId?.toString())
      }
    }
  }, [router])



  const { data: cycle, isLoading: isLoadingCycle } = useCycle(+cycleId, { enabled: !!cycleId })
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
    let callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${router.query.cycleId}?join=true`;

    if (cycle?.access == 2)
      callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionJoinPrivateCycle`;

    if (cycle?.access == 4)
      callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionSignUpToPayCycle?cycleId=${router.query.cycleId}`;


    signIn('google', { callbackUrl});
  };

  const userRegistered = async (email: string) => {
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if (res.ok) {
      return res.json();
    }
    return null;
  };

  const { mutate, isLoading: isMutating } = useMutation(async (props: MutationProps) => {
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

      let callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${router.query.cycleId}?join=true`;

      if (cycle?.access == 2)
        callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionJoinPrivateCycle`;

      if (cycle?.access == 4)
        callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionSignUpToPayCycle?cycleId=${router.query.cycleId}`;

      signIn('email', { ...callbackUrl && { callbackUrl }, email: identifier });
      // return data;
    } else {
      toast.error(t(res.statusText));
      setLoading(false);
    }
    return null;
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
      toast.error(t('EmailRequired'))
      setLoading(false)

      return false;
    }
    if (!password) {
      toast.error(t('PasswordRequired'))
      setLoading(false)
      return false;
    }
    if (email && password) {

      if (!validateEmail(email)) {
        toast.error(t('InvalidMail'));
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
          toast.error(t('RegisterAlert'))
          setLoading(false)
        }
        else if (ur.provider == 'google') {
          toast.error(t('RegisteredUsingGoogleProvider'))
          setLoading(false)
        }
        else {
          let callbackUrl = localStorage.getItem('loginRedirect')?.toString() || '/';;
          // ? `/cycle/${joinToCycle}`
          // : localStorage.getItem('loginRedirect')?.toString() || '/';

          if (!!joinToCycle && joinToCycle > 0) {

            callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${router.query.cycleId}?join=true`;

            if (cycle?.access == 2)
              callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionJoinPrivateCycle`;

            if (cycle?.access == 4)
              callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionSignUpToPayCycle?cycleId=${router.query.cycleId}`;
          }


          signIn('credentials', {
            callbackUrl,
            email: email,
            password: password
          })
            .then(res => {
              const r = res as unknown as { error: string }


              if (res && r.error) {
                toast.error(t('InvalidSesion'))
                //setLoading(false)
              }
              else {
                close()
                localStorage.setItem('loginRedirect', router.asPath)
                router.push(localStorage.getItem('loginRedirect') || '/').then(() => {
                  localStorage.setItem('loginRedirect', '')
                })
              }
            })
        }
      }
      else {
        toast.error(t('isNotUser'))
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
        toast.error(t('InvalidMail'));
        setLoading(false)
        return false;
      }

      if (!validatePassword(password)) {
        toast.error(t('InvalidPassword'));
        setLoading(false)
        return false;
      }

      const ur = await userRegistered(email);
      if (!ur) {
        toast.error(t('Error'));
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
        toast.error(t('UserRegistered'));
        setLoading(false)
        return;
      }

    } else {
      toast.error(t('emptyFields'));
      setLoading(false)
    }

  };


  const handlerRecoveryLogin = () => {
    close()
    router.push("/recoveryLogin")
  }

  if (cycle)
    return (
      <>
        <Box >
          <Row className="d-flex justify-content-between">
            <Col className='col-12'>
              <Row className='p-4'>
                <Link legacyBehavior  href="/" replace >
                  <a target='_blank' className="d-flex align-items-center">
                    <aside className="d-flex justify-content-around align-items-center">
                      {/*<Image src="/logo.svg" width={45} height={52} alt="Project logo" />*/}
                      <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                      <section>
                        <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                        <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>{t('navbar:tagline')}</p>
                      </section>
                    </aside>
                  </a>
                </Link>
              </Row>
            </Col>
          </Row>
          {/* <Col className='col-12'>
            <Row id='FormContainer' className='bg-secondary d-flex align-items-center' style={{ height: '3rem' }}>
              {cycle.access == 4 && price != -1 ? <Box sx={{ fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}>
                <span className='text-center text-white'>{t('MembershipFee')} {`$${price} ${currency}`}</span> </Box> : <></>}
            </Row>
          </Col> */}
          <Col className='col-12'>
            <Box  className="mt-2" sx={{ width: '1', paddingX: { xs: '2em', sm: '7em', lg: '2em' }, fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}>
              <span className='text-primary text-center'><b>{t('JoinOurClub')}</b></span>
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
                <button
                    type="button"
                    onClick={handleSignUpGoogle}
                    className={`d-flex justify-content-center   ${styles.buttonGoogleSignUpJoinCycle}`}
                  >
                    <div
                      className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}
                    >
                      <img className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" />
                      {t('joinViaGoogle')}
                    </div>
                  </button>
                    <p className={`my-2 ${styles.alternativeLabelSignUpJoinCycle}`}>{t('alternativeText')}</p>
                {!haveAccount &&  <Form onSubmit={handleSubmitSignUp} className='mt-2'>
                      <TextField id="name" className="w-100 mb-4 " label={`${t('Name')}`}
                        variant="outlined" size="small" name="name"
                        value={formValues.name!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>
                      <TextField id="lastname" className=" w-100 mb-4" label={`${t('LastName')}`}
                        variant="outlined" size="small" name="lastname"
                        value={formValues.lastname!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <TextField id="email" className="w-100 mb-4" label={`${t('emailFieldLabel')}`}
                        variant="outlined" size="small" name="identifier"
                        value={formValues.identifier!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <TextField id="pass" className="w-100 mb-4" label={`${t('passwordFieldLabel')}`}
                        variant="outlined" size="small" name="password"
                        value={formValues.password!}
                        autoComplete="current-password"
                        type="password"
                        helperText={`(${t('passRequirements')})`}
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <Box >
                        <p
                          className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                        >
                          {t('HaveAccounttext')}
                          <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`} onClick={handleHaveAccountLink}>
                            {t('clic')}
                          </span>
                          {t('joinClub')}
                        </p>
                      </Box>

                  <Box >
                        {!loading && <Button type="submit" disabled={loading} className={`mb-4 btn btn-eureka  w-100`}>
                          {t('I want to register now')}
                        </Button>} {loading && <LinearProgress className='mb-4' />}
                      </Box>
                      <p
                        className={`text-center align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                      >
                        {t('joinedCycleSignInTerms')}
                        <Link legacyBehavior  href="/manifest" passHref>
                      <a target="_blank"><span className={` cursor-pointer ms-1 me-1 ${styles.linkText}`}>
                            {t('termsText')}
                          </span></a>
                        </Link>
                        {t('and')}
                        <Link legacyBehavior  href="/policy" passHref> 
                      <a target="_blank"><span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t('policyText')}</span></a>
                        </Link>
                      </p>


                    </Form>}

                {haveAccount && <Box sx={{ height: {xl:'800px'} }}>
                  
                  <Form onSubmit={handleSubmitSignIn} className='mt-2'>

                  <TextField id="email" className="w-100 mb-2" label={`${t('emailFieldLabel')}`}
                    variant="outlined" size="small" name="identifier"
                    value={formValues.identifier!}
                    type="text"
                    onChange={handleChangeTextField}
                  >
                  </TextField>
                  <div className='d-flex justify-content-between mb-1'><div></div>
                    <Button onClick={handlerRecoveryLogin} variant="link" className={`btn-link d-flex link align-items-end cursor-pointer text-gray`} style={{ fontSize: '.8em' }}>{t('forgotPassText')}</Button>
                  </div>
                  <TextField id="pass" className="w-100 mb-4" label={`${t('passwordFieldLabel')}`}
                    variant="outlined" size="small" name="password"
                    value={formValues.password!}
                    autoComplete="current-password"
                    type="password"
                    helperText={`(${t('passRequirements')})`}
                    onChange={handleChangeTextField}
                  >
                  </TextField>

                  <Box >
                    <p
                      className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                    >
                      {t('dontHaveAccounttext')}
                      <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`} onClick={handleHaveAccountLink}>
                        {t('clic')}
                      </span>
                      {t('joinClub')}
                    </p>
                  </Box>


                  <Box >
                    {!loading && <Button type="submit" disabled={loading} className={`mb-4 btn btn-eureka  w-100`}>
                      {t('I want to register now')}
                    </Button>} {loading && <LinearProgress className='mb-4' />}
                  </Box>

                </Form>
                </Box>
                }
               
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

export default SignUpJoinToCycleSimpleForm;
