import { useState,useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Container from 'react-bootstrap/Container';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TagsInput from '../src/components/forms/controls/TagsInput';
import useBackOffice from '@/src/useBackOffice';
import { CycleMosaicItem } from '@/src/types/cycle';
import useCycles from '@/src/useCycles';
import CarouselStatic from '@/src/components/CarouselStatic';
import globalSearchEngineAtom from '@/src/atoms/searchEngine';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';

const backOfficeCycles = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

const ExplorePage: NextPage = () => {
  const { t } = useTranslation('common');
  const [ids, setIds] = useState<number[]>([]);

  const [topics /* , setHide */] = useState<string[]>([
    'gender-feminisms', 'technology', 'environment','racism-discrimination','wellness-sports', 'social issues',
    'politics-economics', 'philosophy', 'migrants-refugees', 'introspection', 'sciences', 'arts-culture', 'history',
  ]);
  const router = useRouter();
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const {data:bo} = useBackOffice();


   useEffect(() => {
    if (bo && bo.CyclesExplorePage?.length) {
      let ids:number[] = [];
      bo.CyclesExplorePage.split(',').forEach(x=> ids.push(parseInt(x)));
      setIds(ids);
    }
     
  }, [bo]);

  const {data:dataCycles} = useCycles(backOfficeCycles(ids));
  const [cycles,setCycles] = useState(dataCycles?.cycles)
  useEffect(()=>{
    if(dataCycles)setCycles(dataCycles.cycles)
  },[dataCycles])

  console.log(cycles,'cycles')

  const getTopicsBadgedLinks = () => {
    return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
  };

  const seeAll = async (data: CycleMosaicItem[], q: string, showFilterEngine = true): Promise<void> => {
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      itemsFound: data,
      q,
      show: showFilterEngine,
    });
    router.push(`/search?q=${q}`);
  };

const renderBackOfficeCycles = () => {
    return (cycles && cycles.length) 
    ? <div>      
       <h1 className="text-secondary fw-bold">{t('Interest cycles')}</h1>
       <CarouselStatic
        cacheKey={['CYCLES',JSON.stringify(backOfficeCycles(ids))]}
        onSeeAll={async () => seeAll(cycles, t('Interest cycles'))}
        data={cycles}
        iconBefore={<></>}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />
      </div>
    : <></>;
  };


  return (
    <>
    <SimpleLayout showCustomBaner={true} title={t('Explore')}>
      <h1 className="text-secondary fw-bold mt-5">{t('ExploreTopics')}</h1>
      <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
      <div>
        {renderBackOfficeCycles()}
      </div>
    
    
    
    </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return { props: {} };
};

export default ExplorePage;
