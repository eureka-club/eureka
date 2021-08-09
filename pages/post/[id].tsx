import { GetServerSideProps, NextPage } from 'next';
// import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Alert } from 'react-bootstrap';
import { sendMail } from '../../src/facades/mail';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';

const CycleDetailPage: NextPage = () => {
  return (
    <SimpleLayout title="Post required to be associated to a work or a cycle">
      <Alert variant="warning">Not Found</Alert>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const opt = {
    to: [
      {
        email: 'gbanoaol@gmail.com',
      },
      {
        email: 'julie@eureka.club',
      },
    ],
    from: {
      email: process.env.EMAILING_FROM!,
      name: 'EUREKA-CLUB',
    },
    subject: `Error on post: ${ctx.params!.id}`,
    html: `Error on post: ${ctx.params!.id}.`,
  };

  sendMail(opt);
  return { props: {} };
};

export default CycleDetailPage;
