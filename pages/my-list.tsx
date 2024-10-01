import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { CycleSumary } from '../src/types/cycle';
import { WorkSumary } from '../src/types/work';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
// import { search as searchCycles } from '../src/facades/cycle';
// import { search as searchWork } from '../src/facades/work';
// import Mosaic from '../src/components/Mosaic';
import { getCyclesSumary } from '@/src/useCyclesSumary';
import { getWorksSumary } from '@/src/useWorksSumary';
import { TabPanelSwipeableViews } from '@/src/components/common/TabPanelSwipeableViews';
import Masonry from '@mui/lab/Masonry';
import CycleMosaicItem from '@/src/components/cycle/MosaicItem';
import WorkMosaicItem from '@/src/components/work/MosaicItem';

interface Props {
  cycles: CycleSumary[];
  works: WorkSumary[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  // let interleavedResults:(CycleSumary|WorkSumary)[]=[]
  let cycles;
  let works;
  
  if (session == null) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    // return { notFound: true };
  }
  else{
    // const cycles = await searchCycles({
    //   where: JSON.stringify({
    //     OR: [{ participants: { some: { id: session.user.id } } }, { favs: { some: { id: session.user.id } } }],
    //   }),
    //   include: JSON.stringify({ localImages: true }),
    // });
  
    // const works = await searchWork(session,{
    //   where: JSON.stringify({ favs: { some: { id: session.user.id } } }),
    //   include: JSON.stringify({ localImages: true }),
    // });
    const {cycles:cs}=await getCyclesSumary(ctx.locale,{
      where:{
        OR: [{ participants: { some: { id: session.user.id } } }, { favs: { some: { id: session.user.id } } }]
      }
    });
    cycles = cs;
    const {works:ws} = await getWorksSumary(ctx.locale,{
      where:{
        favs: { some: { id: session.user.id } }
      }
    });
    works=ws;
  }
  return {
    props: {
      session,
      cycles:cycles??[],
      works:works??[],
    },
  };

};

const MyListPage: NextPage<Props> = ({ cycles,works }) => {
  const { t } = useTranslation('common');
  
  return (
    <SimpleLayout title={t('browserTitleMyList')}>
      <h4 className="mt-4 mb-5">{t('mosaicHeaderMyCycles')}</h4>
      <TabPanelSwipeableViews 
        indexActive={0} 
        items={[
          cycles?.length ?{
            label:t('cycles'),
            content:<Masonry>
              {cycles?.map((c:CycleSumary)=><CycleMosaicItem key={`cycle-${c.id}`} cycleId={c.id}/>)}
            </Masonry>
          }:null,
          works?.length ? {
            label:t('works'),
            content:<Masonry>
              {works?.map((w:WorkSumary)=><WorkMosaicItem key={`work-${w.id}`} workId={w.id}/>)}
            </Masonry>
          }:null
        ].filter(a=>a) as any}
      />
      {/* <Mosaic cacheKey={['my-list','']} stack={myListMosaicData} /> */}
    </SimpleLayout>
  );
};

export default MyListPage;
