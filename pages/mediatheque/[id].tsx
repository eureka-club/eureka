// import { flatten, zip } from 'lodash';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
// import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import { /* GetStaticProps, */ NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useQueryClient, useMutation } from 'react-query';
// import { dehydrate } from 'react-query/hydration';
import { useState, useEffect /* , ReactElement */ } from 'react';

// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { Spinner, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
import { /* BsCircleFill, */ BsBookmark, BsEye } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';

import { /* RatingOnCycle, */ RatingOnWork, User } from '@prisma/client';
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
// type ItemPost = PostMosaicItem & { type: string };

// | WorkMosaicItem | ;

const Mediatheque: NextPage = () => {
  const [session, isLoadingSession] = useSession();
  const [id, setId] = useState<string>('');
  const [idSession, setIdSession] = useState<string>('');
  const router = useRouter();
  // const [cycles, setCycles] = useState<ItemCycle[]>([]);
  // const [posts, setPosts] = useState<ItemPost[]>([]);
  // const [savedForLater, setSavedForLater] = useState<Item[]>([]);
  // const [readOrWatched, setReadOrWatched] = useState<Item[]>([]);
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

  const { /* isError, error, */ data: user, isLoading: isLoadingUser, isSuccess: isSuccessUser } = useUsers({ id });

  useEffect(() => {
    if (isSuccessUser && id && !user) {
      queryClient.invalidateQueries(['USERS', `${id}`]);
    }
  }, [user, id, isSuccessUser]);

  // const { /* isLoading, isError, error, */ data: dataUserSession } = useUsers({ id: idSession });
  // const [/* userSession, */ setUserSession] = useState();
  // const [preparingData, setPreparingData] = useState<boolean>(false);
  // const [isAccessAllowed, setIsAccessAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.id && session) {
      const s = session as unknown as Session;
      const ifbm = s ? user.followedBy.findIndex((i: User) => i.id === s.user.id) !== -1 : false;
      setIsFollowedByMe(() => ifbm);
    }
  }, [user, session]);

  const isAccessAllowed = () => {
    if (!isLoadingUser && user && user.id) {
      if (!user.dashboardType || user.dashboardType === 1) return true;
      if (!isLoadingSession) {
        // if (!session) return false;
        if (session) {
          const s = session as unknown as Session;
          if (user.id === s.user.id) return true;
          if (user.dashboardType === 2 && isFollowedByMe) return true;
          if (user.dashboardType === 3 && user.id === s.user.id) return true;
        }
      }
    }
    return false;
  };

  // useEffect(() => {
  //   if (isAccessAllowed()) prepareData();
  // }, [isAccessAllowed]);

  // useEffect(() => {
  //   if (dataUserSession) {
  //     dataUserSession.following = dataUserSession.following.map((f: UserMosaicItem) => ({ ...f, type: 'user' }));
  //     dataUserSession.followedBy = dataUserSession.followedBy.map((f: UserMosaicItem) => ({ ...f, type: 'user' }));

  //     setUserSession(dataUserSession);
  //   }
  // }, [dataUserSession]);

  const { mutate: mutateFollowing, isLoading: isLoadingMutateFollowing } = useMutation<User>(
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
      onMutate: async () => {
        await queryClient.cancelQueries(['USERS', id]);
        await queryClient.cancelQueries(['USERS', idSession]);

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
        return { followingUser, followedByUser };
      },
      onError: (err, data, context: any) => {
        queryClient.setQueryData(['USERS', id], context.followingUser);
        queryClient.setQueryData(['USERS', idSession], context.followedByUser);
      },

      onSettled: () => {
        queryClient.invalidateQueries(['USERS', id]);
        queryClient.invalidateQueries(['USERS', idSession]);
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

  const postsCreated = () => {
    if (user && user.posts && user.posts.length) {
      const P = user.posts.map((p: PostMosaicItem) => ({ ...p, type: 'post' }));
      return (
        <CarouselStatic
          className="mb-5"
          onSeeAll={async () => seeAll(P, t('Eurekas I created'))}
          title={t('Eurekas I created')}
          data={P}
          iconBefore={<></>}
          // iconAfter={<BsCircleFill className={styles.infoCircle} />}
        />
      );
    }
    return '';
  };

  const cyclesJoined = () => {
    const C: ItemCycle[] = [];
    if (user && user.cycles && user.cycles.length) {
      C.push(...user.cycles.map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' })));
    }
    if (user && user.joinedCycles && user.joinedCycles.length) {
      const JC: ItemCycle[] = [];
      user.joinedCycles.reduce((p: ItemCycle[], c: Item) => {
        if (c.creatorId !== parseInt(id, 10)) {
          // otherwise will be already on C
          p.push({ ...c, type: 'cycle' } as ItemCycle);
        }
        return p;
      }, JC);
      C.push(...JC);
      C.sort((f: CycleMosaicItem, s: CycleMosaicItem) => {
        const fCD = dayjs(f.createdAt);
        const sCD = dayjs(s.createdAt);
        if (fCD.isAfter(sCD)) return -1;
        if (fCD.isSame(sCD)) return 0;
        return 1;
      });
    }

    return C.length ? (
      <CarouselStatic
        onSeeAll={async () => seeAll(C, t('Cycles I created or joined'))}
        title={t('Cycles I created or joined')}
        data={C}
        iconBefore={<></>}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />
    ) : (
      ``
    );
  };

  const readOrWatched = () => {
    if (user && user.ratingWorks && user.ratingWorks.length) {
      const RW = user.ratingWorks.map((w: RatingOnWork & { work: WorkMosaicItem }) => w.work!);

      return (
        <CarouselStatic
          onSeeAll={async () => seeAll(RW, t(`Movies/books i've watched/read`))}
          title={t(`Movies/books i've watched/read`)}
          data={RW}
          iconBefore={<BsEye />}

          // iconAfter={<BsCircleFill className={styles.infoCircle} />}
        />
      );
    }
    return '';
  };

  const savedForLater = () => {
    const SFL: ItemCycle[] = [];
    if (user && user.favWorks && user.favWorks.length) {
      SFL.push(...user.favWorks);
    }
    if (user && user.favCycles && user.favCycles.length) {
      SFL.push(...user.favCycles.map((c: CycleMosaicItem) => ({ ...c, type: 'cycle' })));
    }
    if (user && user.favPosts && user.favPosts.length) {
      SFL.push(...user.favPosts.map((p: PostMosaicItem) => ({ ...p, type: 'post' })));
    }
    SFL.sort((f: CycleMosaicItem, s: CycleMosaicItem) => {
      const fCD = dayjs(f.createdAt);
      const sCD = dayjs(s.createdAt);
      if (fCD.isAfter(sCD)) return -1;
      if (fCD.isSame(sCD)) return 0;
      return 1;
    });
    if (SFL.length)
      return (
        <CarouselStatic
          onSeeAll={async () => seeAll(SFL, t('Saved for later of forever'))}
          title={t('Saved for later of forever')}
          data={SFL}
          iconBefore={<BsBookmark />}
          // iconAfter={<BsCircleFill className={styles.infoCircle} />}
        />
      );
    return '';
  };

  const usersFollowed = () => {
    if (user && user.following && user.following.length) {
      return (
        <CarouselStatic
          onSeeAll={async () => seeAll(user!.following as UserMosaicItem[], t('Users I follow'), false)}
          title={`${t('Users I follow')}  `}
          data={user!.following as UserMosaicItem[]}
          iconBefore={<HiOutlineUserGroup />}
          // iconAfter={<BsCircleFill className={styles.infoCircle} />}
        />
      );
    }
    return '';
  };

  const renderAccessInfo = () => {
    if (!(isLoadingUser || isLoadingSession)) {
      if (user) {
        const aa = isAccessAllowed();
        if (user.dashboardType === 3 && !aa)
          return <Alert variant="warning">{t('secretMediathequeNotification')}</Alert>;
        if (!aa) return <Alert variant="warning">{t('notAuthorized')}</Alert>;
      }
    }
    return '';
  };

  return (
    <SimpleLayout title={t('Mediatheque')}>
      <>
        {!(isLoadingUser || isLoadingSession) && user && (
          <section>
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
                      <Button onClick={followHandler} disabled={isLoadingMutateFollowing}>
                        {t('Follow')}
                        {isLoadingMutateFollowing && <Spinner animation="grow" variant="info" size="sm" />}
                      </Button>
                    )}

                    {session && (session as unknown as Session).user!.id !== user.id && isFollowedByMe && (
                      <Button
                        className={styles.unFollowBtn}
                        onClick={followHandler}
                        disabled={isLoadingMutateFollowing}
                      >
                        {t('Unfollow')}
                        {isLoadingMutateFollowing && <Spinner animation="grow" variant="info" size="sm" />}
                      </Button>
                    )}
                  </Col>
                </Row>
                {/* <BsCircleFill className={styles.infoCircle} /> */}
              </Card.Body>
            </Card>
            {isAccessAllowed() && (
              <>
                <h1 className="text-dark mb-2">{t('Mediatheque')}</h1>
                <FilterEngine fictionOrNotFilter={false} geographyFilter={false} />
                {postsCreated()}

                {cyclesJoined()}

                {readOrWatched()}

                {savedForLater()}

                {usersFollowed()}
              </>
            )}
          </section>
        )}
        {renderAccessInfo()}
        {(isLoadingUser || isLoadingSession) && <Spinner animation="grow" variant="info" />}
        {isSuccessUser && id && !user && <Spinner animation="grow" variant="info" />}
      </>
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
