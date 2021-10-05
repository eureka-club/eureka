// import { flatten, zip } from 'lodash';
// import { useAtom } from 'jotai';

// import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState /* , useEffect, ReactElement, Children */ } from 'react';
import { RiArrowDownSLine /* , RiArrowUpSLine */ } from 'react-icons/ri';

import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { Button } from 'react-bootstrap';

// import { CycleMosaicItem } from '../src/types/cycle';
// import { WorkMosaicItem } from '../src/types/work';
// import { PostMosaicItem } from '../src/types/post';
import styles from './index.module.css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
// import { findAll as findAllCycles } from '../src/facades/cycle';
// import { findAll as findAllWorks } from '../src/facades/work';
// import Mosaic from '../src/components/Mosaic';
// import SearchEngine from '../src/components/SearchEngine';
// import FilterEngine from '../src/components/FilterEngine';
import Carousel from '../src/components/Carousel';

const IndexPage: NextPage = () => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState<string[]>(['gender-feminisms', 'environment', 'technology']);
  const [hide /* , setHide */] = useState<string[]>([
    'racism-discrimination',
    'wellness-sports',
    'social issues',
    'politics-economics',
    'philosophy',
    'migrants-refugees',
    'introspection',
    'sciences',
    'arts-culture',
    'history',
  ]);

  const showTopic = () => {
    if (hide.length) {
      const topic = hide.splice(0, 3);
      setShow([...show, ...topic]);
    }
  };

  return (
    <SimpleLayout title={t('browserTitleWelcome')}>
      <h1 className="text-success">{t('Trending topics')}</h1>

      <>{show && show.map((item) => <Carousel key={item} topic={item} />)}</>
      <Button className={styles.carouselDowmButton} onClick={showTopic} disabled={hide.length === 0}>
        <RiArrowDownSLine />
      </Button>
    </SimpleLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  // await queryClient.prefetchQuery('WORKS', getWorks);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const cycles = await findAllCycles();
//   const works = await findAllWorks();
//   const interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);

//   return {
//     props: {
//       homepageMosaicData: interleavedResults,
//     },
//   };
// };

export default IndexPage;
