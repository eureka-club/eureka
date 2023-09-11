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
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import LanguageSelect from './controls/LanguageSelect';


interface Props {
  noModal?: boolean;
}

interface FormValues {
  identifier: string;
  password: string;
  name: string,
  lastname: string,
  language: string
}

const SignUpForm: FunctionComponent<Props> = ({ noModal = false }) => {
  const { t } = useTranslation('signUpForm');
  //const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    identifier: '',
    password: '',
    name: '',
    lastname: '',
    language: '',
  });
  interface MutationProps {
    identifier: string;
    password: string;
    fullName: string;
    language: string
  }


  function handleChangeTextField(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    ev.preventDefault();
    ev.preventDefault();
    const { name, value } = ev.target;
    console.log(name, value, 'name, value')
    setFormValues({
      ...formValues,
      [name]: value
    });
  }

 

  const onSelectLanguage = (language: string) => {
    setFormValues({
      ...formValues,
      ['language']: language
    });
  };

  useEffect(() => {
    if (/^en\b/.test(navigator.language))
      onSelectLanguage('english');

    if (/^es\b/.test(navigator.language))
      onSelectLanguage('spanish');

    if (/^fr\b/.test(navigator.language))
      onSelectLanguage('french');

    if (/^pt\b/.test(navigator.language))
      onSelectLanguage('portuguese');

  }, []);

  const handleSignUpGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    signIn('google');
  };

  const userRegistered = async (email: string) => {
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if (res.ok) {
      return res.json();
    }
    return null;
  };

  const { mutate, isLoading: isMutating } = useMutation(async (props: MutationProps) => {
    const { identifier, password,language, fullName } = props;
    const res = await fetch('/api/userCustomData', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
        fullName,
        language
      }),
    });
    if (res.ok) {
      const data = await res.json();
      signIn('email', { email: identifier });
      // return data;
    } else {
      toast.error(res.statusText);
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


  const handleSubmitSignUp = async (ev: FormEvent<HTMLFormElement>) => {
    //mutate user custom data
    ev.preventDefault();

    const email = formValues.identifier;
    const password = formValues.password;
    const language = formValues.language;
    const fullName = formValues.name + ' ' + formValues.lastname;

    console.log(formValues)

    if (email && password && fullName && language) {
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
          language,
          fullName,
        });
      } else toast.error(t('UserRegistered'));
    } else toast.error(t('emptyFields'));
  };

  //border border-1"  style={{ borderRadius: '0.5em'}}
  return (
    <>
      <section className={`${styles.welcomeMobileSection}`}>
        <div className="d-flex d-lg-none flex-column justify-content-center">
          <Container className={`${styles.imageContainer} d-flex justify-content-center`}>
            <img className={`${styles.eurekaImage}`} src="/Eureka-VT-web-white.png" alt="Eureka" />
          </Container>
          <p className={`mt-3 ${styles.welcomeText}`}>{t('Welcome')}</p>
        </div>
      </section>
      <Container className="p-lg-0 m-lg-0">
        <Row className="d-flex justify-content-between">
          <Col className={`d-none d-lg-flex col-6 ${styles.welcomeSection}`}>
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
          <Col className={`col-12 col-lg-6`}>
            <div className={`${styles.registerFormSection}`}>
              <Row>
                <span className={`lg-ms-3 ${styles.joinEurekaText}`}>{t('JoinEureka')}</span>
                <p className={`${styles.haveAccounttext}`}>
                  {t('HaveAccounttext')}{' '}
                  <Link href="/">
                    <a className="">{t('Login')}</a>
                  </Link>
                </p>
              </Row>
              <section className="border border-1 mb-5" style={{ borderRadius: '0.5em' }}>
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
                  <div className="d-flex justify-content-center ">
                    <Form onSubmit={handleSubmitSignUp}>
                      <div className="d-flex flex-column flex-lg-row justify-content-between">
                        <div className={`d-flex flex-column ${styles.personalData}`}>
                          <TextField id="name" className="w-100" label={`${t('Name')}`}
                            variant="outlined" size="small" name="name"
                            value={formValues.name!}
                            type="text"
                            onChange={handleChangeTextField}
                          >
                          </TextField>
                        </div>
                        <div className={`d-flex flex-column ${styles.personalData}`}>
                          <TextField id="lastname" className="w-100" label={`${t('LastName')}`}
                            variant="outlined" size="small" name="lastname"
                            value={formValues.lastname!}
                            type="text"
                            onChange={handleChangeTextField}
                          >
                          </TextField>
                        </div>
                      </div>
                      <div className='mt-4'>
                        <LanguageSelect onSelectLanguage={onSelectLanguage} defaultValue={formValues.language} label={t('languageFieldLabel')} />
                      </div>

                      <TextField id="email" className="w-100 mt-4" label={`${t('emailFieldLabel')}`}
                        variant="outlined" size="small" name="identifier"
                        value={formValues.identifier!}
                        type="text"
                        onChange={handleChangeTextField}
                      >
                      </TextField>

                      <TextField id="pass" className="w-100 mt-4" label={`${t('passwordFieldLabel')}`}
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
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUpForm;
