// import { flatten, zip } from 'lodash';
import { useAtom } from 'jotai';

// import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { /* GetStaticProps, */ NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useQueryClient, useMutation } from 'react-query';
// import { dehydrate } from 'react-query/hydration';
import { useState, useEffect /* , ReactElement */ } from 'react';

// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { /* Spinner, */ Card, Row, Col, Button } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
import { /* BsCircleFill, */ BsBookmark, BsEye } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';

import { RatingOnCycle, RatingOnWork, User } from '@prisma/client';
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
import { Session } from '../../src/types';
import { CycleMosaicItem /* , CycleWithImages */ } from '../../src/types/cycle';
import { PostMosaicItem /* , PostWithImages */ } from '../../src/types/post';
import { WorkMosaicItem /* , WorkWithImages */ } from '../../src/types/work';
import { UserMosaicItem /* , UserDetail, WorkWithImages */ } from '../../src/types/user';
// import MosaicItemCycle from '../../src/components/cycle/MosaicItem';
// import MosaicItemPost from '../../src/components/post/MosaicItem';
// import MosaicItemWork from '../../src/components/work/MosaicItem';

type Item = (CycleMosaicItem & { type: string }) | WorkMosaicItem | (PostMosaicItem & { type: string });

type ItemCycle = CycleMosaicItem & { type: string };
type ItemPost = PostMosaicItem & { type: string };

// | WorkMosaicItem | ;

const Mediatheque: NextPage = () => {
  const [session] = useSession();
  const [id, setId] = useState<string>('');
  const [idSession, setIdSession] = useState<string>('');
  const router = useRouter();
  const [cycles, setCycles] = useState<ItemCycle[]>([]);
  const [posts, setPosts] = useState<ItemPost[]>([]);
  const [savedForLater, setSavedForLater] = useState<Item[]>([]);
  const [readOrWatched, setReadOrWatched] = useState<Item[]>([]);
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>();
  const queryClient = useQueryClient();
  const { t } = useTranslation('mediatheque');
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // if (!s?.user) {
  //   router?.push('/');
  //   window.location.href = '/';
  // }

  useEffect(() => {
    // const s = session as unknown as Session;
    // if (s && s.user) setId(s.user.id.toString());
    setId(router.query.id as string);
    if (session) setIdSession((session as unknown as Session).user.id.toString());
  }, [session, router]);

  const { /* isLoading, isError, error, */ data: user } = useUsers({ id });
  const { /* isLoading, isError, error, */ data: dataUserSession } = useUsers({ id: idSession });
  const [userSession, setUserSession] = useState();
  const [preparingData, setPreparingData] = useState<boolean>(true);

  const prepareData = (): void => {
    setPreparingData(true);
    if (user && id) {
      const s = session as unknown as Session;
      const ifbm = s ? user.followedBy.findIndex((i: User) => i.id === s.user.id) !== -1 : false;
      setIsFollowedByMe(() => ifbm);
      if (user.dashboardType !== 1) {
        if (user.id !== s.user.id) {
          if (user.dashboardType === 3) {
            router.push('/');
            return;
          }
          if (user.dashboardType === 2 && !ifbm) {
            router.push('/');
            return;
          }
        }
      }

      let C: ItemCycle[] = [];
      const JC: ItemCycle[] = [];
      let P: ItemPost[] = [];
      let FW: Item[] = [];
      let FC: Item[] = [];
      let FP: Item[] = [];
      let RW: Item[] = [];
      if (user.cycles && user.cycles.length) {
        C = user.cycles.map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' }));
      }
      if (user.joinedCycles && user.joinedCycles.length) {
        user.joinedCycles.reduce((p: ItemCycle[], c: Item) => {
          if (c.creatorId !== parseInt(id, 10)) {
            // otherwise will be already on C
            p.push({ ...c, type: 'cycle' } as ItemCycle);
          }
          return p;
        }, JC);
        // .filter((c: CycleMosaicItem) => c.creatorId !== parseInt(id, 10))
        // .map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' }));
      }
      if (user.posts && user.posts.length) {
        P = user.posts.map((p: PostMosaicItem) => ({ ...p, type: 'post' }));
      }

      if (user.favWorks && user.favWorks.length) {
        FW = user.favWorks;
      }
      if (user.favCycles && user.favCycles.length) {
        FC = user.favCycles.map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' }));
      }
      if (user.favPosts && user.favPosts.length) {
        FP = user.favPosts.map((p: PostMosaicItem) => ({ ...p, type: 'post' }));
      }

      if (user.ratingWorks && user.ratingWorks.length) {
        RW = user.ratingWorks.map((w: RatingOnWork & { work: WorkMosaicItem }) => w.work!);
      }
      setCycles(() => [...C, ...JC]);
      setPosts(() => [...P]);
      setSavedForLater(() => [...FC, ...FP, ...FW]);
      setReadOrWatched(() => [...RW]);
    }
    setPreparingData(false);
  };

  useEffect(() => {
    prepareData();
  }, [user, id, session]);

  useEffect(() => {
    if (dataUserSession) {
      dataUserSession.following = dataUserSession.following.map((f: UserMosaicItem) => ({ ...f, type: 'user' }));
      dataUserSession.followedBy = dataUserSession.followedBy.map((f: UserMosaicItem) => ({ ...f, type: 'user' }));

      setUserSession(dataUserSession);
    }
  }, [dataUserSession]);

  const { mutate: mutateFollowing } = useMutation<User>(
    async () => {
      const action = isFollowedByMe ? 'disconnect' : 'connect';
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followedBy: {
            [`${action}`]: [{ id: (session as unknown as Session).user.id }],
          },
        }),
      });
      const json = await res.json();

      // if (json.status === 'OK') {
      //   setIsFollowedByMe(!isFollowedByMe);
      // }
      return json;
    },
    {
      onMutate: () => {
        type UserFollow = User & { followedBy: User[]; following: User[] };
        const followingUser = queryClient.getQueryData<UserFollow>(['USERS', id]);
        const followedByUser = queryClient.getQueryData<UserFollow>(['USERS', idSession]);
        let followedBy: User[] = [];
        let following: User[] = [];
        if (followingUser && followedByUser)
          if (isFollowedByMe) {
            followedBy = followingUser.followedBy.filter((i: User) => i.id !== +idSession);
            following = followedByUser.following.filter((i: User) => i.id !== +id);
          } else {
            followedBy = [...followingUser.followedBy, followedByUser];
            following = [...followedByUser.following, followingUser];
          }
        queryClient.setQueryData(['USERS', id], { ...followingUser, followedBy });
        queryClient.setQueryData(['USERS', idSession], { ...followedByUser, following });
      },
    },
  );

  const seeAll = async (data: (Item | UserMosaicItem)[], q: string, showFilterEngine = true): Promise<void> => {
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      itemsFound: data,
      q,
      show: showFilterEngine,
    });

    router.push('/search');
  };

  const followHandler = async () => {
    const s = session;
    if (user && s!.user) {
      if (parseInt(id, 10) !== (s as unknown as Session).user.id) mutateFollowing();
    }
  };

  return (
    <SimpleLayout title={t('Mediatheque')}>
      {!preparingData && user && (
        <Card className={styles.userHeader}>
          <Card.Body>
            <Row>
              <Col>
                <img className={styles.avatar} src={user.image || '/assets/avatar.png'} alt={user.email} />
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
                {session && (session as unknown as Session).user!.id !== user.id && !isFollowedByMe && (
                  <Button onClick={followHandler}>{t('Follow')}</Button>
                )}

                {session && (session as unknown as Session).user!.id !== user.id && isFollowedByMe && (
                  <Button className={styles.unFollowBtn} onClick={followHandler}>
                    {t('Unfollow')}
                  </Button>
                )}
              </Col>
            </Row>
            {/* <BsCircleFill className={styles.infoCircle} /> */}
          </Card.Body>
        </Card>
      )}
      <h1 className={styles.title}>{t('Mediatheque')}</h1>
      <FilterEngine fictionOrNotFilter={false} geographyFilter={false} />

      <CarouselStatic
        onSeeAll={async () => seeAll(posts, t('Eurekas I created'))}
        title={t('Eurekas I created')}
        data={posts}
        iconBefore={<></>}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />

      <CarouselStatic
        onSeeAll={async () => seeAll(cycles, t('Cycles I created or joined'))}
        title={t('Cycles I created or joined')}
        data={cycles}
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

      {user && (
        <CarouselStatic
          onSeeAll={async () => seeAll(user!.following as UserMosaicItem[], t('Users I follow'), false)}
          title={`${t('Users I follow')}  `}
          data={user!.following as UserMosaicItem[]}
          iconBefore={<HiOutlineUserGroup />}
          // iconAfter={<BsCircleFill className={styles.infoCircle} />}
        />
      )}
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
