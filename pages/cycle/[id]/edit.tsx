import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';

import { Alert } from 'react-bootstrap';
import { Session } from '../../../src/types';
import { CycleDetail } from '../../../src/types/cycle';
import SimpleLayout from '../../../src/components/layouts/SimpleLayout';
import EditCycleForm from '../../../src/components/forms/EditCycleForm';
import { find } from '../../../src/facades/cycle';

interface Props {
  cycle: CycleDetail;
  notFound?: boolean;
}

const EditCyclePage: NextPage<Props> = ({ cycle, notFound }) => {
  const { t } = useTranslation('createCycleForm');

  return (
    <SimpleLayout title={t('createCycle')}>
      <>
        {!notFound && <EditCycleForm className="mb-5" cycle={cycle} />}
        {notFound && <Alert variant="danger">{t('common:Error')}</Alert>}
      </>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as unknown as Session;

  const cycleId = parseInt(ctx.params?.id as string, 10);
  const cycle = await find(cycleId);
  if (session == null || (session.user.id !== cycle?.creatorId && !session.user.roles.includes('admin'))) {
    return { props: { notFound: true } };
  }

  return {
    props: { cycle },
  };
};

export default EditCyclePage;
