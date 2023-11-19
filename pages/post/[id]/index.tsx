import { GetServerSideProps, NextPage } from 'next';
import { Alert } from 'react-bootstrap';
import { sendMail } from '@/src/facades/mail';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';

const CycleDetailPage: NextPage = () => {
  return (
    <SimpleLayout title="Post required to be associated to a work or a cycle">
      <Alert variant="warning">Not Found</Alert>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const opt = {
    to: [
      {
        email: process.env.DEV_EMAIL!,
      },
      {
        email: process.env.EMAILING_FROM!,
      },
    ],
    from: {
      email: process.env.EMAILING_FROM!,
      name: 'EUREKA-CLUB',
    },
    subject: `Error on post: ${ctx.params!.id}, wrong url.`,
    html: `Error on post: ${ctx.params!.id}, wrong url.`,
  };

  sendMail(opt);
  return { props: {session} };
};

export default CycleDetailPage;
