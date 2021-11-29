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
import TagsInput from '../src/components/forms/controls/TagsInput';

// import { CycleMosaicItem } from '../src/types/cycle';
// import { WorkMosaicItem } from '../src/types/work';
// import { PostMosaicItem } from '../src/types/post';
import styles from './index.module.css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import Header from '../src/components/layouts/Header';
// import { findAll as findAllCycles } from '../src/facades/cycle';
// import { findAll as findAllWorks } from '../src/facades/work';
// import Mosaic from '../src/components/Mosaic';
// import SearchEngine from '../src/components/SearchEngine';
// import FilterEngine from '../src/components/FilterEngine';
import Carousel from '../src/components/Carousel';

const IndexPage: NextPage = () => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState<string[]>(['gender-feminisms', 'technology', 'environment']);
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
  const getTopicsBadgedLinks = () => {
    return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...show, ...hide].join()} readOnly />;
  };
  const showTopic = () => {
    if (hide.length) {
      const topic = hide.splice(0, 3);
      setShow([...show, ...topic]);
    }
  };

  return (
    <SimpleLayout showHeader title={t('browserTitleWelcome')}>
      <h1 className="text-secondary fw-bold">{t('Trending topics')}</h1>
      <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
      <>{show && show.map((item) => <Carousel className="mt-5" key={item} topic={item} />)}</>
      <Button className="my-3 pe-3 rounded-pill text-white" onClick={showTopic} disabled={hide.length === 0}>
        <span>
          <RiArrowDownSLine /> {t('loadMoreTopics')}
        </span>
      </Button>
    </SimpleLayout>
  );
};

/* export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  // await queryClient.prefetchQuery('WORKS', getWorks);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
 */
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
