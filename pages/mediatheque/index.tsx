// import { flatten, zip } from 'lodash';
import { useAtom } from 'jotai';

// import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { /* GetStaticProps, */ NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
// import { QueryClient } from 'react-query';
// import { dehydrate } from 'react-query/hydration';
import { useState, useEffect /* , ReactElement */ } from 'react';

// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { /* Spinner, */ Card, Row, Col, Button } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
import { /* BsCircleFill, */ BsBookmark, BsEye } from 'react-icons/bs';

// import { Cycle, LocalImage, User, Work } from '@prisma/client';
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
import { Session /* , MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem */ } from '../../src/types';
import { CycleMosaicItem /* , CycleWithImages */ } from '../../src/types/cycle';
import { PostMosaicItem /* , PostWithImages */ } from '../../src/types/post';
import { WorkMosaicItem /* , WorkWithImages */ } from '../../src/types/work';
// import MosaicItemCycle from '../../src/components/cycle/MosaicItem';
// import MosaicItemPost from '../../src/components/post/MosaicItem';
// import MosaicItemWork from '../../src/components/work/MosaicItem';

type Item = (CycleMosaicItem & { type: string }) | WorkMosaicItem | (PostMosaicItem & { type: string });
// | WorkMosaicItem | ;

const Mediatheque: NextPage = () => {
  const [session] = useSession();
  const [id, setId] = useState<string>('');
  const router = useRouter();
  const [cycles, setCycles] = useState<Item[]>([]);
  const [posts, setPosts] = useState<Item[]>([]);
  const [savedForLater, setSavedForLaters] = useState<Item[]>([]);
  const [readOrWatched, setReadOrWatched] = useState<Item[]>([]);

  const { t } = useTranslation('mediatheque');
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // if (!s?.user) {
  //   router?.push('/');
  //   window.location.href = '/';
  // }

  useEffect(() => {
    const s = session as unknown as Session;
    if (s && s.user) setId(s.user.id.toString());
  }, [session, router]);

  const { /* isLoading, isError, error, */ data: user } = useUsers(id);
  useEffect(() => {
    if (user && id) {
      let C: Item[] = [];
      const JC: Item[] = [];
      let P: Item[] = [];
      let FW: Item[] = [];
      let RW: Item[] = [];
      if (user.cycles && user.cycles.length) {
        C = user.cycles.map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' }));
      }
      if (user.joinedCycles && user.joinedCycles.length) {
        user.joinedCycles.reduce((p: Item[], c: Item) => {
          if (c.creatorId !== parseInt(id, 10)) {
            // otherwise will be already on C
            p.push({ ...c, type: 'cycle' } as Item);
          }
          return p;
        }, JC);
        // .filter((c: CycleMosaicItem) => c.creatorId !== parseInt(id, 10))
        // .map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' }));
      }
      if (user.posts && user.posts.length) {
        P = user.posts.map((p: PostMosaicItem) => ({ ...p, type: 'post' }));
      }
      if (user.favWorks && user.favWorks.length) FW = user.favWorks;
      if (user.readOrWatchedWorks && user.readOrWatchedWorks.length) {
        RW = user.readOrWatchedWorks;
      }
      setCycles([...C, ...JC]);
      setPosts([...P]);
      setSavedForLaters([...FW]);
      setReadOrWatched([...RW]);
    }
  }, [user, id]);

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
      {session && user && (
        <Card className={styles.userHeader}>
          <Card.Body>
            <Row>
              <Col>
                <img className={styles.avatar} src={user.image} alt={user.email} />
                <br />
                {/* <em>{user.name}</em> */}
              </Col>
              <Col xs={8}>
                <h2>{user.name}</h2>
                <em>
                  <AiOutlineEnvironment /> {t(`countries:${user.countryOfOrigin}`)}
                </em>
                <p className={styles.description}>{user.aboutMe}</p>
                <TagsInput tags={user.tags} readOnly label="" />
              </Col>
              <Col>
                {/* <BsCircleFill className={styles.infoCircle} /> */}
                <Button>{t('Follow')}</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      <h1 className={styles.title}>{t('Mediatheque')}</h1>
      <FilterEngine fictionOrNotFilter={false} geographyFilter={false} />

      <CarouselStatic
        onSeeAll={async () => seeAll(cycles, t('Cycles I created or joined'))}
        title={t('Cycles I created or joined')}
        data={cycles}
        iconBefore={<></>}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />

      <CarouselStatic
        onSeeAll={async () => seeAll(cycles, t('Eurekas I created'))}
        title={t('Eurekas I created')}
        data={posts}
        iconBefore={<></>}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />

      <CarouselStatic
        onSeeAll={async () => seeAll(readOrWatched, t(`Movies/books i've watched/read`))}
        title={t(`Movies/books i've watched/read`)}
        data={readOrWatched}
        iconBefore={<BsEye />}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />

      <CarouselStatic
        onSeeAll={async () => seeAll(savedForLater, t('Saved for later of forever'))}
        title={t('Saved for later of forever')}
        data={savedForLater}
        iconBefore={<BsBookmark />}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
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
