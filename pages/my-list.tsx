import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';

import { Session } from '../src/types';
import { CycleMosaicItem } from '../src/types/cycle';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { search as searchCycles } from '../src/facades/cycle';
import Mosaic from '../src/components/Mosaic';

interface Props {
  cycles: CycleMosaicItem[];
}

const MyListPage: NextPage<Props> = ({ cycles }) => {
  const { t } = useTranslation('common');

  return (
    <SimpleLayout title={t('browserTitleMyList')}>
      <h4 className="mt-4 mb-5">{t('mosaicHeaderMyCycles')}</h4>
      <Mosaic stack={cycles} />
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as Session;
  if (session == null) {
    return { notFound: true };
  }

  const cycles = await searchCycles({
    where: JSON.stringify({ participants: { some: { id: session.user.id } } }),
    include: JSON.stringify({ localImages: true }),
  });

  return {
    props: {
      cycles,
    },
  };
};

export default MyListPage;
