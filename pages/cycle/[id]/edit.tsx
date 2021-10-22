import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { BiArrowBack } from 'react-icons/bi';
import { Alert, ButtonGroup, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Session } from '../../../src/types';
import { CycleMosaicItem } from '../../../src/types/cycle';
import SimpleLayout from '../../../src/components/layouts/SimpleLayout';
import EditCycleForm from '../../../src/components/forms/EditCycleForm';
import { find } from '../../../src/facades/cycle';

interface Props {
  cycle: CycleMosaicItem;
  notFound?: boolean;
}

const EditCyclePage: NextPage<Props> = ({ cycle, notFound }) => {
  const { t } = useTranslation('createCycleForm');
  const router = useRouter();
  return (
    <SimpleLayout title={t('editCycle')}>
      <>
        <ButtonGroup className="mb-1">
          <Button variant="primary" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
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
