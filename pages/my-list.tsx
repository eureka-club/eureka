import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { flatten, zip } from 'lodash';

import { Session } from '../src/types';
import { CycleMosaicItem } from '../src/types/cycle';
import { WorkMosaicItem } from '../src/types/work';
import { PostMosaicItem } from '../src/types/post';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { search as searchCycles } from '../src/facades/cycle';
import { search as searchPosts } from '../src/facades/post';
import { search as searchWork } from '../src/facades/work';
import Mosaic from '../src/components/Mosaic';
import { MosaicItem } from '../src/types';


interface Props {
  myListMosaicData: (CycleMosaicItem | WorkMosaicItem)[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as Session;
  if (session == null) {
    return { notFound: true };
  }

  const cycles = await searchCycles({
    where: JSON.stringify(
      {
        OR: [
          { participants: { some: { id: session.user.id } } },
          { favs: { some: { id: session.user.id } } },
        ]
      }
    ),
    include: JSON.stringify({ localImages: true }),
  });

  const posts = await searchPosts({
    where: JSON.stringify({ favs: { some: { id: session.user.id } } }),
    include: JSON.stringify({ localImages: true }),
  });

  const works = await searchWork({
    where: JSON.stringify({ favs: { some: { id: session.user.id } } }),
    include: JSON.stringify({ localImages: true }),
  });

  const interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);

  return {
    props: {
      myListMosaicData: interleavedResults,      
    },
  };
};


const MyListPage: NextPage<Props> = ({ myListMosaicData }) => {
  const { t } = useTranslation('common');

  return (
    <SimpleLayout title={t('browserTitleMyList')}>
      <h4 className="mt-4 mb-5">{t('mosaicHeaderMyCycles')}</h4>
      <Mosaic stack={myListMosaicData} />
    </SimpleLayout>
  );
};


export default MyListPage;
