import { signIn } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState, MouseEvent, ChangeEvent, FormEvent, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useMutation } from 'react-query';
import { Form } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './SignUpForm.module.css';
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Box } from '@mui/material';
import LanguageSelect from './controls/LanguageSelect';
import { validateEmail } from '@/src/lib/utils';
import { useRouter } from 'next/router';


interface Props {
  noModal?: boolean;
}

interface FormValues {
  identifier: string;
  password: string;
  name: string,
  lastname: string,
 // language: string
}

const SignUpForm: FunctionComponent<Props> = ({ noModal = false }) => {
  const { t, lang } = useTranslation('signUpForm');
  const router = useRouter();

  //const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    identifier: '',
    password: '',
    name: '',
    lastname: ''
   // language: '',
  });
  interface MutationProps {
    identifier: string;
    password: string;
    fullName: string;
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



  // const onSelectLanguage = (language: string) => {
  //   setFormValues({
  //     ...formValues,
  //     ['language']: language
  //   });
  // };

  // useEffect(() => {
  //   if (/^en\b/.test(navigator.language))
  //     onSelectLanguage('english');

  //   if (/^es\b/.test(navigator.language))
  //     onSelectLanguage('spanish');

  //   if (/^fr\b/.test(navigator.language))
  //     onSelectLanguage('french');

  //   if (/^pt\b/.test(navigator.language))
  //     onSelectLanguage('portuguese');

  // }, []);

  const handleSignUpGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    let callbackUrl = localStorage.getItem('loginRedirect')?.toString()||`/${lang}${router.asPath}`
    signIn('google',{callbackUrl});
  };

  const userRegistered = async (email: string) => {
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if (res.ok) {
      return res.json();
    }
    return null;
  };

  const { mutate, isLoading: isMutating } = useMutation(async (props: MutationProps) => {
    const { identifier, password, fullName } = props;//language,
    const res = await fetch('/api/userCustomData', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
        fullName
       // language
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const urlRedirect = localStorage.getItem('loginRedirect')??`/${lang}${router.asPath}`;
      signIn('email', { email: identifier, callbackUrl:urlRedirect });
      // return data;
    } else {
      toast.error(t(res.statusText));
    }
    return null;
  });

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


  const handleSubmitSignUp = async (ev: FormEvent<HTMLFormElement>) => {
    //mutate user custom data
    ev.preventDefault();
    const email = formValues.identifier;
    const password = formValues.password;
    // const language = formValues.language;
    const fullName = formValues.name + ' ' + formValues.lastname;

    console.log(formValues)

    if (email && password && fullName) {//&& language
      if (!validateEmail(email)) {
        toast.error(t('InvalidMail'));
        return false;
      }

      if (!validatePassword(password)) {
        toast.error(t('InvalidPassword'));
        return false;
      }

      const ur = await userRegistered(email);
      if (!ur) {
        toast.error(t('Error'));
        return;
      }

      if (!ur.isUser || !ur.hasPassword) {
        mutate({
          identifier: email,
          password: password,
          //language,
          fullName,
        });
      } else toast.error(t('UserRegistered'));
    } else toast.error(t('emptyFields'));
  };

  //border border-1"  style={{ borderRadius: '0.5em'}}
  return (
    <>
      <section className={`${styles.welcomeMobileSection}`}>
        <div className="d-flex d-xl-none flex-column justify-content-center">
          <Container className={`${styles.imageContainer} d-flex justify-content-center`}>
            <img className={`${styles.eurekaImage}`} src="/Eureka-VT-web-white.png" alt="Eureka" />
          </Container>
          <p className={`mt-3 ${styles.welcomeText}`}>{t('Welcome')}</p>
        </div>
      </section>
      <Container className="p-xl-0 m-xl-0">
        <Row className="d-flex justify-content-between">
          <Col className={`d-none d-xl-flex col-6 ${styles.welcomeSection}`}>
            <section className={`d-flex flex-column w-100 ${styles.welcomeSectionText}`}>
              <p className={`ms-5 ${styles.welcomeText}`}>{t('Welcome')}</p>
              <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText1')}</p>
              <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText2')}</p>
              <Container
                className={`${styles.imageContainer} d-flex flex-column align-items-center justify-content-center`}
              >
                <Link href="/" replace>
                  <img
                    className={` cursor-pointer ${styles.eurekaImage}`}
                    src="/Eureka-VT-web-white.png"
                    alt="Eureka"
                  />
                </Link>
                <Link href="/" replace>
                  <p className={`mt-5 cursor-pointer text-white ${styles.VisitEurekaText}`}>{t('VisitEureka')} </p>
                </Link>
              </Container>
            </section>
          </Col>
          <Col className={`col-12 col-xl-6`}>
            <div className={`${styles.registerFormSection}`}>
              <Row>
                <span className={`xl-ms-3 ${styles.joinEurekaText}`}>{t('JoinEureka')}</span>
                <p className={`${styles.haveAccounttext}`}>
                  {t('HaveAccounttext')}{' '}
                  <Link href="/">
                    <a className="">{t('Login')}</a>
                  </Link>
                </p>
              </Row>
              <Box className="d-flex flex-column border border-1 mb-5" style={{ borderRadius: '0.5em' }}>
                <Row>
                  <button
                    type="button"
                    onClick={handleSignUpGoogle}
                    className={`d-flex justify-content-center mt-4  ${styles.buttonGoogle}`}
                  >
                    <div
                      className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}
                    >
                      <img className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" />
                      {t('joinViaGoogle')}
                    </div>
                  </button>
                  <p className={`mb-2 ${styles.alternativeLabel}`}>{t('alternativeText')}</p>
                </Row>
                <Row>
                  <div className="d-flex justify-content-center w-100 ">
                    <Form onSubmit={handleSubmitSignUp}>
                      <div className="d-flex flex-column flex-lg-row justify-content-between">
                        <div className={`d-flex flex-column ${styles.personalData}`}>
                          <TextField id="name" className="p-2 w-100 mt-4" label={`${t('Name')}`}
                            variant="outlined" size="small" name="name"
                            value={formValues.name!}
                            type="text"
                            onChange={handleChangeTextField}
                          >
                          </TextField>
                        </div>
                        <div className={`d-flex flex-column ${styles.personalData}`}>
                          <TextField id="lastname" className="p-2 w-100 mt-4" label={`${t('LastName')}`}
                            variant="outlined" size="small" name="lastname"
                            value={formValues.lastname!}
                            type="text"
                            onChange={handleChangeTextField}
                          >
                          </TextField>
                        </div>
                      </div>
                      {/* <div className='p-2 mt-4'>
                        <LanguageSelect onSelectLanguage={onSelectLanguage} defaultValue={formValues.language} label={t('languageFieldLabel')} />
                      </div> */}

                      <TextField id="email" className="p-2 w-100 mt-4" label={`${t('emailFieldLabel')}`}
                        variant="outlined" size="small" name="identifier"
                        value={formValues.identifier!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <TextField id="pass" className="p-2 w-100 mt-4" label={`${t('passwordFieldLabel')}`}
                        variant="outlined" size="small" name="password"
                        value={formValues.password!}
                        autoComplete="current-password"
                        type="password"
                        helperText={`(${t('passRequirements')})`}
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <Button type="submit" className={`mb-4 btn-eureka ${styles.submitButton}`}>
                          {t('Join')}
                        </Button>
                        <p
                          className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}
                        >
                          {t('joinedTerms')}
                          <Link href="/manifest" passHref>
                            <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`}>
                              {t('termsText')}
                            </span>
                          </Link>
                          {t('and')}
                          <Link href="/policy" passHref>
                            <span className={`d-flex cursor-pointer ms-1 ${styles.linkText}`}>{t('policyText')}</span>
                          </Link>
                        </p>
                      </div>

                    </Form>

                  </div>
                </Row>
              </Box>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUpForm;
