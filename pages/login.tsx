import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import SimpleLayout from '../src/components/layouts/SimpleLayout';
import SignInForm from '../src/components/forms/SignInForm';

const LoginPage: NextPage = () => {
  const { t } = useTranslation('signInForm');

  return (
    <SimpleLayout title={t('login')}>
      <Row>
        <Col md={{ offset: 2, span: 8 }}>
          <SignInForm noModal />
        </Col>
      </Row>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return { props: {} };
};

export default LoginPage;
