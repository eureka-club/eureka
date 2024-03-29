import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { flatten, zip } from 'lodash';

import { CycleDetail, CycleSumary } from '../src/types/cycle';
import { WorkDetail, WorkSumary } from '../src/types/work';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { search as searchCycles } from '../src/facades/cycle';
import { search as searchWork } from '../src/facades/work';
import Mosaic from '../src/components/Mosaic';
import {Cycle,Work} from '@prisma/client'

interface Props {
  myListMosaicData: (CycleSumary | WorkSumary)[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  let interleavedResults:(Cycle|WorkSumary|undefined)[]=[]
  if (session == null) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    // return { notFound: true };
  }
  else{
    const cycles = await searchCycles({
      where: JSON.stringify({
        OR: [{ participants: { some: { id: session.user.id } } }, { favs: { some: { id: session.user.id } } }],
      }),
      include: JSON.stringify({ localImages: true }),
    });
  
    const works = await searchWork(session,{
      where: JSON.stringify({ favs: { some: { id: session.user.id } } }),
      include: JSON.stringify({ localImages: true }),
    });
  
    interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);
  
    
  }
  return {
    props: {
      session,
      myListMosaicData: interleavedResults,
    },
  };

};

const MyListPage: NextPage<Props> = ({ myListMosaicData }) => {
  const { t } = useTranslation('common');

  return (
    <SimpleLayout title={t('browserTitleMyList')}>
      <h4 className="mt-4 mb-5">{t('mosaicHeaderMyCycles')}</h4>
      <Mosaic cacheKey={['my-list','']} stack={myListMosaicData} />
    </SimpleLayout>
  );
};

export default MyListPage;
