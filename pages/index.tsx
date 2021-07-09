// import { flatten, zip } from 'lodash';
import { useAtom } from 'jotai';

// import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect, ReactElement, Children } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { Spinner, Button } from 'react-bootstrap';
import globalSearchEngineAtom from '../src/atoms/searchEngine';

import { CycleMosaicItem } from '../src/types/cycle';
import { WorkMosaicItem } from '../src/types/work';
// import { PostMosaicItem } from '../src/types/post';
import styles from './index.module.css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
// import { findAll as findAllCycles } from '../src/facades/cycle';
// import { findAll as findAllWorks } from '../src/facades/work';
import Mosaic from '../src/components/Mosaic';
// import SearchEngine from '../src/components/SearchEngine';
import FilterEngine from '../src/components/FilterEngine';
import Carousel from '../src/components/Carousel';

import useWorks from '../src/useWorks';
import useCycles from '../src/useCycles';
import useCountries from '../src/useCountries';

// interface Props {
//   homepageMosaicData: (CycleMosaicItem | WorkMosaicItem)[];
// }
// const getWorks = async () => {
//   const res = await fetch('/api/work/');
//   return res.json();
// };
// const getCycles = async () => {
//   const res = await fetch('/api/cycle/');
//   return res.json();
// };

// const getRecords = async (type: string, where?: string) => {
//   const res = await fetch(`/api/${type}${where ? `?where=${where}` : ''}`);
//   const result = await res.json();
//   type ItemType =
//     | (CycleMosaicItem & { TYPE: string })
//     | (WorkMosaicItem & { TYPE: string })
//     | (PostMosaicItem & { TYPE: string });
//   const subTypeFn = (i: ItemType) => {
//     return 'type' in i ? `-${i.type}` : '';
//   };
//   result.data.forEach((i: ItemType, k: string) => {
//     // result.data[k] = { ...i, TYPE: `${type}${subTypeFn(i)}` };
//     result.data[k] = { ...i, TYPE: `${type}` };
//   });
//   return result;
// };

const IndexPage: NextPage = () => {
  const { t } = useTranslation('common');
  // const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);

  // const { isLoading, /* isError, error, */ data: works } = useWorks();
  // const { isLoading: isLoadingCycles, /* isError: isErrorCycles, error: errorCycles, */ data: cycles } = useCycles();
  // const { data: onlyByCountriesAux } = useCountries();

  // const [homepageMosaicData, setHomepageMosaicData] = useState<
  //   ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[]
  // >([]);

  // useEffect(() => {
  //   if (works || cycles /* || posts */) {
  //     const w = works ? works.data : [];
  //     const c = cycles ? cycles.data : [];
  //     // const p = posts ? posts.data : [];
  //     const res = [...w, ...c /* , ...p */].sort(
  //       (i, j) => +(new Date(i.createdAt).getTime() >= new Date(j.createdAt).getTime() && -1),
  //     );
  //     setHomepageMosaicData(res);
  //   }
  // }, [works, cycles /* , posts */]);

  /* type FilterWhere = {
    where: {
      OR: {
        title: { contains: string };
        contentText: { contains: string };
      };
    };
  };

  type Filter = {
    [index: string]: Array<string> | FilterWhere | undefined;
    only?: Array<string>;
    cycle?: FilterWhere;
    work?: FilterWhere;
  }; */

  // const [homepageMosaicDataFiltered, setHomepageMosaicDataFiltered] = useState<
  //   ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[]
  // >([]);

  // useEffect(() => {
  //   setGlobalSearchEngineState({
  //     ...globalSearchEngineState,
  //     ...{ onlyByCountries: onlyByCountriesAux },
  //   });
  // }, [onlyByCountriesAux]);

  // useEffect(() => {
  //   if (homepageMosaicData) {
  //     const { only, onlyByCountries } = globalSearchEngineState;
  //     let filtered = null;
  //     if (only.length) {
  //       filtered = homepageMosaicData.filter((i) => {
  //         return only.includes(i.type);
  //       });
  //       setHomepageMosaicDataFiltered([...filtered]);
  //     }
  //     if (onlyByCountries && onlyByCountries.length) {
  //       filtered = (filtered || homepageMosaicData).filter((i) => {
  //         if (i.type !== 'cycle')
  //           return (
  //             onlyByCountries.includes((i as WorkMosaicItem).countryOfOrigin as string) ||
  //             onlyByCountries.includes((i as WorkMosaicItem).countryOfOrigin2 as string)
  //           );
  //         return false;
  //       });
  //       setHomepageMosaicDataFiltered([...filtered]);
  //     }
  //     if (!filtered) {
  //       setHomepageMosaicDataFiltered([...homepageMosaicData]);
  //     }
  //   }
  // }, [homepageMosaicData, globalSearchEngineState]);

  // const genLoadingCmp = (): ReactElement => {
  //   if (isLoading || isLoadingCycles)
  //     return (
  //       <Spinner animation="border" role="status">
  //         <span className="sr-only">{t('Loading')}</span>
  //       </Spinner>
  //     );
  //   return <span>{`${''}`}</span>;
  // };
  const [show, setShow] = useState<string[]>(['environment']);
  const [hide, setHide] = useState<string[]>([
    'gender',
    'history',
    'introspection',
    'politics',
    'racism',
    'social',
    'sciences',
    'technology',
  ]);

  const showTopic = () => {
    if (hide.length) {
      const topic = hide.splice(0, 1);
      setShow([...show, ...topic]);
    }
  };

  const hideTopic = () => {
    if (show.length > 1) {
      const topic = show.pop() as string;
      setHide([...hide, topic]);
    }
  };

  return (
    <SimpleLayout title={t('browserTitleWelcome')}>
      {/* <h1 className={styles.title}>{t('Results about')}</h1> */}
      <h1 className={styles.title}>{t('Trending topics')}</h1>
      {/* <FilterEngine /> */}
      {/* <Mosaic stack={homepageMosaicDataFiltered} /> */}
      {/* {genLoadingCmp()} */}

      {/* <Carousel topic="environment" />
      <Carousel topic="gender-feminisms" />
      <Carousel topic="history" />
      <Carousel topic="introspection" />
      <Carousel topic="politics-economics" />
      <Carousel topic="racism-discrimination" />
      <Carousel topic="social issues" />
      <Carousel topic="sciences" />
      <Carousel topic="technology" />
      <Carousel topicLabel={t('uncategorized')} topic="uncategorized" /> */}
      <>{show && show.map((item) => <Carousel key={item} topic={item} />)}</>
      <Button
        // className={styles.leftButton}
        onClick={showTopic}
        disabled={hide.length === 0}
      >
        <RiArrowDownSLine />
      </Button>
      <Button
        // className={styles.leftButton}
        onClick={hideTopic}
        disabled={show.length <= 1}
      >
        <RiArrowUpSLine />
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
