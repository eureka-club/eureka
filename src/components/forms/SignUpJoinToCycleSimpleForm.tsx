import { signIn } from 'next-auth/react';

import { FunctionComponent, useState, MouseEvent, ChangeEvent, FormEvent, useEffect } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useMutation } from '@tanstack/react-query';;
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
import { useDictContext } from '@/src/hooks/useDictContext';



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
  const { t, dict } = useDictContext();
 
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
  const asPath=usePathname()!;
  const [haveAccount, setHaveAccount] = useState<boolean>(false)
  const searchParams=useSearchParams();
  const cycleId=searchParams?.get('cycleId')!;

  const { data: cycle, isLoading: isLoadingCycle } = useCycle(+cycleId, { enabled: !!cycleId })
  const { data: { price, currency } = { currency: '', price: -1 } } = useCyclePrice(cycle?.product_id!);

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
    let callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${cycleId}?join=true`;

    if (cycle?.access == 2)
      callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionJoinPrivateCycle`;

    if (cycle?.access == 4)
      callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionSignUpToPayCycle?cycleId=${cycleId}`;


    signIn('google', { callbackUrl});
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
      mutationFn:async (props: MutationProps) => {
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
    
          let callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${cycleId}?join=true`;
    
          if (cycle?.access == 2)
            callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionJoinPrivateCycle`;
    
          if (cycle?.access == 4)
            callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionSignUpToPayCycle?cycleId=${cycleId}`;
    
          signIn('email', { ...callbackUrl && { callbackUrl }, email: identifier });
          // return data;
        } else {
          toast.error(t(dict,res.statusText));
          setLoading(false);
        }
        return null;
        }
    }
  );

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
      toast.error(t(dict,'PasswordRequired'))
      setLoading(false)
      return false;
    }
    if (email && password) {

      if (!validateEmail(email)) {
        toast.error(t(dict,'InvalidMail'));
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
          toast.error(t(dict,'RegisterAlert'))
          setLoading(false)
        }
        else if (ur.provider == 'google') {
          toast.error(t(dict,'RegisteredUsingGoogleProvider'))
          setLoading(false)
        }
        else {
          let callbackUrl = localStorage.getItem('loginRedirect')?.toString() || '/';;
          // ? `/cycle/${joinToCycle}`
          // : localStorage.getItem('loginRedirect')?.toString() || '/';

          if (!!joinToCycle && joinToCycle > 0) {

            callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/cycle/${cycleId}?join=true`;

            if (cycle?.access == 2)
              callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionJoinPrivateCycle`;

            if (cycle?.access == 4)
              callbackUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/transitionSignUpToPayCycle?cycleId=${cycleId}`;
          }


          signIn('credentials', {
            callbackUrl,
            email: email,
            password: password
          })
            .then(res => {
              const r = res as unknown as { error: string }


              if (res && r.error) {
                toast.error(t(dict,'InvalidSesion'))
                //setLoading(false)
              }
              else {
                close()
                localStorage.setItem('loginRedirect', asPath)
                router.push(localStorage.getItem('loginRedirect') || '/')
                localStorage.setItem('loginRedirect', '')
                // .then(() => {
                // })
              }
            })
        }
      }
      else {
        toast.error(t(dict,'isNotUser'))
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
        toast.error(t(dict,'InvalidMail'));
        setLoading(false)
        return false;
      }

      if (!validatePassword(password)) {
        toast.error(t(dict,'InvalidPassword'));
        setLoading(false)
        return false;
      }

      const ur = await userRegistered(email);
      if (!ur) {
        toast.error(t(dict,'Error'));
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
        toast.error(t(dict,'UserRegistered'));
        setLoading(false)
        return;
      }

    } else {
      toast.error(t(dict,'emptyFields'));
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
                        <p className="text-secondary my-0 ms-3 font-weight-light" style={{ fontSize: '.7em' }}>{t(dict,'navbar:tagline')}</p>
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
                <span className='text-center text-white'>{t(dict,'MembershipFee')} {`$${price} ${currency}`}</span> </Box> : <></>}
            </Row>
          </Col> */}
          <Col className='col-12'>
            <Box  className="mt-2" sx={{ width: '1', paddingX: { xs: '2em', sm: '7em', lg: '2em' }, fontSize: { sx: '.6em', lg: '1.4em' }, display: 'flex', justifyContent: 'center' }}>
              <span className='text-primary text-center'><b>{t(dict,'JoinOurClub')}</b></span>
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
                      {t(dict,'joinViaGoogle')}
                    </div>
                  </button>
                    <p className={`my-2 ${styles.alternativeLabelSignUpJoinCycle}`}>{t(dict,'alternativeText')}</p>
                {!haveAccount &&  <Form onSubmit={handleSubmitSignUp} className='mt-2'>
                      <TextField id="name" className="w-100 mb-4 " label={`${t(dict,'Name')}`}
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

                      <TextField id="email" className="w-100 mb-4" label={`${t(dict,'emailFieldLabel')}`}
                        variant="outlined" size="small" name="identifier"
                        value={formValues.identifier!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <TextField id="pass" className="w-100 mb-4" label={`${t(dict,'passwordFieldLabel')}`}
                        variant="outlined" size="small" name="password"
                        value={formValues.password!}
                        autoComplete="current-password"
                        type="password"
                        helperText={`(${t(dict,'passRequirements')})`}
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <Box >
                        <p
                          className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                        >
                          {t(dict,'HaveAccounttext')}
                          <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`} onClick={handleHaveAccountLink}>
                            {t(dict,'clic')}
                          </span>
                          {t(dict,'joinClub')}
                        </p>
                      </Box>

                  <Box >
                        {!loading && <Button type="submit" disabled={loading} className={`mb-4 btn btn-eureka  w-100`}>
                          {t(dict,'I want to register now')}
                        </Button>} {loading && <LinearProgress className='mb-4' />}
                      </Box>
                      <p
                        className={`text-center align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                      >
                        {t(dict,'joinedCycleSignInTerms')}
                        <Link legacyBehavior  href="/manifest" passHref>
                      <a target="_blank"><span className={` cursor-pointer ms-1 me-1 ${styles.linkText}`}>
                            {t(dict,'termsText')}
                          </span></a>
                        </Link>
                        {t(dict,'and')}
                        <Link legacyBehavior  href="/policy" passHref> 
                      <a target="_blank"><span className={`cursor-pointer ms-1 ${styles.linkText}`}>{t(dict,'policyText')}</span></a>
                        </Link>
                      </p>


                    </Form>}

                {haveAccount && <Box sx={{ height: {xl:'800px'} }}>
                  
                  <Form onSubmit={handleSubmitSignIn} className='mt-2'>

                  <TextField id="email" className="w-100 mb-2" label={`${t(dict,'emailFieldLabel')}`}
                    variant="outlined" size="small" name="identifier"
                    value={formValues.identifier!}
                    type="text"
                    onChange={handleChangeTextField}
                  >
                  </TextField>
                  <div className='d-flex justify-content-between mb-1'><div></div>
                    <Button onClick={handlerRecoveryLogin} variant="link" className={`btn-link d-flex link align-items-end cursor-pointer text-gray`} style={{ fontSize: '.8em' }}>{t(dict,'forgotPassText')}</Button>
                  </div>
                  <TextField id="pass" className="w-100 mb-4" label={`${t(dict,'passwordFieldLabel')}`}
                    variant="outlined" size="small" name="password"
                    value={formValues.password!}
                    autoComplete="current-password"
                    type="password"
                    helperText={`(${t(dict,'passRequirements')})`}
                    onChange={handleChangeTextField}
                  >
                  </TextField>

                  <Box >
                    <p
                      className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                    >
                      {t(dict,'dontHaveAccounttext')}
                      <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`} onClick={handleHaveAccountLink}>
                        {t(dict,'clic')}
                      </span>
                      {t(dict,'joinClub')}
                    </p>
                  </Box>


                  <Box >
                    {!loading && <Button type="submit" disabled={loading} className={`mb-4 btn btn-eureka  w-100`}>
                      {t(dict,'I want to register now')}
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
