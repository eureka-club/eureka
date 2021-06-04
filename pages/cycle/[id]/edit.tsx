import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';

import { Session } from '../../../src/types';
import { CycleDetail } from '../../../src/types/cycle';
import SimpleLayout from '../../../src/components/layouts/SimpleLayout';
import EditCycleForm from '../../../src/components/forms/EditCycleForm';
import { find } from '../../../src/facades/cycle';

interface Props {
  cycle: CycleDetail;
}

const EditCyclePage: NextPage<Props> = ({ cycle }) => {
  const { t } = useTranslation('createCycleForm');

  return (
    <SimpleLayout title={t('createCycle')}>
      <EditCycleForm className="mb-5" cycle={cycle} />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as unknown as Session;

  const cycleId = parseInt(ctx.query.id as string, 10);
  const cycle = await find(cycleId);
  if (session == null || !session.user.roles.includes('admin') || session.user.id !== cycle?.creatorId) {
    return { notFound: true };
  }

  return {
    props: { cycle },
  };
};

export default EditCyclePage;
