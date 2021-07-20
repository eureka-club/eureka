// import { flatten, zip } from 'lodash';
import { useAtom } from 'jotai';

// import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { useState, useEffect, ReactElement } from 'react';

// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { Spinner, Card, Row, Col, Button } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
import { BsCircleFill, BsBookmark } from 'react-icons/bs';

import { Cycle, LocalImage, User, Work } from '@prisma/client';
import styles from './index.module.css';
import { useUsers } from '../../src/useUsers';

import globalSearchEngineAtom from '../../src/atoms/searchEngine';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import FilterEngine from '../../src/components/FilterEngine';
import TagsInput from '../../src/components/forms/controls/TagsInput';
import CarouselStatic from '../../src/components/CarouselStatic';
// import useWorks from '../src/useWorks';
// import useCycles from '../src/useCycles';
// import useCountries from '../src/useCountries';
import { Session, MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem } from '../../src/types';
import { CycleMosaicItem, CycleWithImages } from '../../src/types/cycle';
import { PostMosaicItem, PostWithImages } from '../../src/types/post';
import { WorkMosaicItem, WorkWithImages } from '../../src/types/work';
// import MosaicItemCycle from '../../src/components/cycle/MosaicItem';
// import MosaicItemPost from '../../src/components/post/MosaicItem';
// import MosaicItemWork from '../../src/components/work/MosaicItem';

type Item = (CycleMosaicItem & { type: string }) | WorkMosaicItem | (PostMosaicItem & { type: string });
// | WorkMosaicItem | ;

const Mediatheque: NextPage = () => {
  const [session] = useSession();
  const [id, setId] = useState<string | undefined>();
  const router = useRouter();
  const [cyclesAndPost, setCyclesAndPosts] = useState<Item[]>([]);
  const [savedForLater, setSavedForLaters] = useState<Item[]>([]);

  const { t } = useTranslation('mediatheque');
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // if (!s?.user) {
  //   router?.push('/');
  //   window.location.href = '/';
  // }

  useEffect(() => {
    const s = session as unknown as Session;
    if (!s || !s.user) router?.push('/');
    else setId(s.user.id.toString());
  }, [session, router]);

  const { isLoading, /* isError, error, */ data: user } = useUsers(id);
  useEffect(() => {
    if (user) {
      let C: Item[] = [];
      let JC: Item[] = [];
      let P: Item[] = [];
      let FW: Item[] = [];
      if (user.cycles) {
        C = user.cycles.map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' }));
      }
      if (user.joinedCycles) {
        JC = user.joinedCycles.map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' }));
      }
      if (user.posts) {
        P = user.posts.map((p: PostMosaicItem) => ({ ...p, type: 'post' }));
      }
      if (user.favWorks) FW = user.favWorks;
      setCyclesAndPosts([...C, ...JC, ...P]);
      setSavedForLaters([...FW]);
    }
  }, [user]);
  // const { isLoading, /* isError, error, */ data: works } = useWorks();
  // const { isLoading: isLoadingCycles, /* isError: isErrorCycles, error: errorCycles, */ data: cycles } =
  //   useCycles();
  // const { data: onlyByCountriesAux } = useCountries();

  // const [homepageMosaicData, setHomepageMosaicData] = useState<
  //   ((CycleMosaicItem & { type: string }) | WorkMosaicItem)[]
  // >([]);

  // useEffect(() => {
  //   if (works || cycles /* || posts */) {
  //     const w = works ? works.data : [];
  //     const c = cycles ? cycles.data : [];
  //     // const p = posts ? posts.data : [];
  //     const res = [...w, ...c /* , ...p */];
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
  //     // if (q) {debugger;
  //     //   const whereAux = encodeURIComponent(JSON.stringify({ title: { contains: globalSearchEngineState.q } }));
  //     //   setTempWhere(whereAux);
  //     // }
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

  // useEffect(() => {
  //   if (globalSearchEngineState.q) {
  //     const { q } = globalSearchEngineState;
  //     const where = JSON.stringify({ title: { contains: q } });
  //     setGlobalSearchEngineState({ ...globalSearchEngineState, where });
  //   }
  // }, [globalSearchEngineState]);

  // const genLoadingCmp = (): ReactElement => {
  //   if (isLoading || isLoadingCycles)
  //     return (
  //       <Spinner animation="border" role="status">
  //         <span className="sr-only">{t('Loading')}</span>
  //       </Spinner>
  //     );
  //   return <span>{`${''}`}</span>;
  // };
  // let qLabel = t(`topics:${globalSearchEngineState.q as string}`);
  // if (qLabel.match(':')) qLabel = globalSearchEngineState.q as string;
  const seeAll = async (data: Item[], q: string): Promise<void> => {
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      itemsFound: data,
      q,
    });

    router.push('/search');
  };
  return (
    <SimpleLayout title={t('Mediatheque')}>
      {user && (
        <Card className={styles.userHeader}>
          <Card.Body>
            <Row>
              <Col>
                <img className={styles.avatar} src={user.image} alt={user.email} />
                <br />
                <em>{user.name}</em>
              </Col>
              <Col xs={8}>
                <h2>{user.name}</h2>
                <em>
                  <AiOutlineEnvironment /> Location
                </em>
                <p className={styles.description}>
                  Auto-layout for flexbox grid columns also means you can set the width of one column and have the
                  sibling columns automatically resize around it. You may use predefined grid classes (as shown below),
                  grid mixins, or inline widths. Note that the other columns will resize no matter the width of the
                  center column.
                </p>
                <TagsInput tags={user.tags} readOnly label="" />
              </Col>
              <Col>
                <BsCircleFill className={styles.infoCircle} />
                <Button>{t('Follow')}</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      <h1 className={styles.title}>{t('Mediatheque')}</h1>
      <FilterEngine fictionOrNotFilter={false} geographyFilter={false} />
      <CarouselStatic
        onSeeAll={async () => seeAll(cyclesAndPost, t('Cycles and Eurekas I created or joined'))}
        title={t('Cycles and Eurekas I created or joined')}
        data={cyclesAndPost}
        iconBefore={<></>}
        iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />

      <CarouselStatic
        onSeeAll={async () => seeAll(savedForLater, t('Saved for later of forever'))}
        title={t('Saved for later of forever')}
        data={savedForLater}
        iconBefore={<BsBookmark />}
        iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />
    </SimpleLayout>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const queryClient = new QueryClient();
//   // await queryClient.prefetchQuery('WORKS', getWorks);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };

export default Mediatheque;
