// import { flatten, zip } from 'lodash';
import { useAtom } from 'jotai';

// import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';

import { useQuery, QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import globalSearchEngineAtom from '../src/atoms/searchEngine';

import { CycleMosaicItem } from '../src/types/cycle';
import { WorkMosaicItem } from '../src/types/work';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
// import { findAll as findAllCycles } from '../src/facades/cycle';
// import { findAll as findAllWorks } from '../src/facades/work';
import Mosaic from '../src/components/Mosaic';
import SearchEngine from '../src/components/SearchEngine';

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

const getRecords = async (type: string) => {
  const res = await fetch(`/api/${type}/`);
  const result = await res.json();
  type ItemType = (CycleMosaicItem & { TYPE: string }) | (WorkMosaicItem & { TYPE: string });
  const subTypeFn = (i: ItemType) => {
    return 'type' in i ? `-${i.type}` : '';
  };
  result.data.forEach((i: ItemType, k: string) => {
    result.data[k] = { ...i, TYPE: `${type}${subTypeFn(i)}` };
  });
  return result;
};

const IndexPage: NextPage = () => {
  const { t } = useTranslation('common');
  const [globalSearchEngineState] = useAtom(globalSearchEngineAtom);

  const {
    isLoading,
    isError,
    error,
    data: works,
  } = useQuery('WORKS', () => getRecords('work'), {
    staleTime: 1000 * 60 * 60,
  });

  const {
    isLoading: isLoadingCycles,
    isError: isErrorCycles,
    error: errorCycles,
    data: cycles,
  } = useQuery('CYCLES', () => getRecords('cycle'), {
    staleTime: 1000 * 60 * 60,
  });

  const [homepageMosaicData, setHomepageMosaicData] = useState<
    ((CycleMosaicItem & { TYPE: string }) | (WorkMosaicItem & { TYPE: string }))[]
  >([]);
  useEffect(() => {
    if (works && cycles) setHomepageMosaicData([...works.data, ...cycles.data]);
  }, [works, cycles]);

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

  const [homepageMosaicDataFiltered, setHomepageMosaicDataFiltered] = useState<
    ((CycleMosaicItem & { TYPE: string }) | (WorkMosaicItem & { TYPE: string }))[]
  >([]);

  useEffect(() => {
    if (homepageMosaicData) {
      const { only } = globalSearchEngineState;
      if (only.length) {
        const filtered = homepageMosaicData.filter((i) => {
          return only.includes(i.TYPE);
        });
        setHomepageMosaicDataFiltered([...filtered]);
      } else {
        setHomepageMosaicDataFiltered(homepageMosaicData);
      }
    }
  }, [homepageMosaicData, globalSearchEngineState]);

  return (
    <SimpleLayout title={t('browserTitleWelcome')}>
      <SearchEngine />
      {cycles && works && <Mosaic stack={homepageMosaicDataFiltered} />}

      {isLoading && `${t('Loading Works')}...`}
      <br />
      {isLoadingCycles && `${t('Loading Cycles')}...`}
      {isError && `${t('Error loading Cycles')}: ${JSON.stringify(error)}`}
      <br />
      {isErrorCycles && `${t('Error loading Works')}: ${JSON.stringify(errorCycles)}`}
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
