import React, { useRef, useState } from 'react';
import { Session } from '@/src/types';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {Form,Button} from 'react-bootstrap'
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import {useToasts} from 'react-toast-notifications'

interface Props{
  session:Session;
}
const RecoveryLoginPage: NextPage<Props> = () => {
  const { t } = useTranslation('signUpForm');
  const {addToast} = useToasts();
  const [validated,setValidated] = useState<boolean>(false);

  const handlerSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
  }
  return (
    <SimpleLayout title={t('Sign up')} showNavBar={false}>
      <Head>
        <title>Recovery login</title>
      </Head>
          <Form onSubmit={handlerSubmit} action='/api/recoveryLogin' validated={validated} method='POST'>
            <Form.Group controlId='email'>
              <Form.Control type="email" name="email" required />
            </Form.Group>
            <Button type='submit'>{t('send')}</Button>
          </Form>
    </SimpleLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   if (session != null) {
//     return { redirect: { destination: '/', permanent: false } };
//   }

//   return { props: {} };
// };

export default RecoveryLoginPage;
