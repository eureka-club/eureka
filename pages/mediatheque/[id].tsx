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
import { useState, useEffect, SyntheticEvent } from 'react';

// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
import { /* BsCircleFill, */ BsBookmark, BsEye } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import LocalImageComponent from '@/src/components/LocalImage'
import { HiOutlineUserGroup } from 'react-icons/hi';

import { /* RatingOnCycle, */ RatingOnWork, User } from '@prisma/client';
import styles from './index.module.css';
import useUser from '@/src/useUser';

import globalSearchEngineAtom from '../../src/atoms/searchEngine';
import globalModalsAtom from '@/src/atoms/globalModals'

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
import UnclampText from '../../src/components/UnclampText';
import { useNotificationContext } from '@/src/useNotificationProvider';

// import MosaicItemCycle from '../../src/components/cycle/MosaicItem';
// import MosaicItemPost from '../../src/components/post/MosaicItem';
// import MosaicItemWork from '../../src/components/work/MosaicItem';
import SocketIO from '@/src/lib/Notifier'
import { route } from 'next/dist/server/router';
type Item = (CycleMosaicItem & { type: string }) | WorkMosaicItem | (PostMosaicItem & { type: string });

type ItemCycle = CycleMosaicItem & { type: string };
// type ItemPost = PostMosaicItem & { type: string };

// | WorkMosaicItem | ;

const Mediatheque: NextPage = () => {
  const [session, isLoadingSession] = useSession();
  const [id, setId] = useState<string>('');
  const [idSession, setIdSession] = useState<string>('');
  const router = useRouter();
  const {notifier} = useNotificationContext();
  // const [cycles, setCycles] = useState<ItemCycle[]>([]);
  // const [posts, setPosts] = useState<ItemPost[]>([]);
  // const [savedForLater, setSavedForLater] = useState<Item[]>([]);
  // const [readOrWatched, setReadOrWatched] = useState<Item[]>([]);
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>();
  const queryClient = useQueryClient();
  const { t } = useTranslation('mediatheque');
  const [socketIO,setSocketIO] = useState<SocketIO>();
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [globalModals, setGlobalModals] = useAtom(globalModalsAtom);
  // if (!s?.user) {
  //   router?.push('/');
  //   window.location.href = '/';
  // }

  /* useEffect(()=>{
    setSocketIO(new SocketIO([+id],(data)=>{
      console.log('ver',data.message);
      // alert(data.message)
      setGlobalModals((res)=>({
        ...res,
        showToast: {
          show: true,
          type: 'info',
          title: t(`common:Notification`),
          message: data.message,
        }
      }))
    }))
  },[id]);
 */
  useEffect(() => {
    // const s = session as unknown as Session;
    // if (s && s.user) setId(s.user.id.toString());
    setId(router.query.id as string);
    if (session) setIdSession((session as unknown as Session).user.id.toString());
  }, [session, router]);

  const { /* isError, error, */ data: user, isLoading: isLoadingUser, isSuccess: isSuccessUser } = useUser(+id,{
    enabled:!!+id
  });

  useEffect(() => {
    if (isSuccessUser && id && !user) {
      queryClient.invalidateQueries(['USER', `${id}`]);
    }
  }, [user, id, isSuccessUser]);


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
      const user = (session as unknown as Session).user;
      const action = isFollowedByMe ? 'disconnect' : 'connect';

      const notificationMessage = `userStartFollowing!|!${JSON.stringify({
        userName:user.name,
      })}`
      const form = new FormData()
      form.append('followedBy',JSON.stringify({
          [`${action}`]: [{ id: user.id }],
      }))
      form.append('notificationData',JSON.stringify({
        notificationMessage,
        notificationContextURL:router.asPath,
        notificationToUsers:[id]
      }))
      
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        // headers: { 'Content-Type': 'application/json' },
        body:form,
        // body: JSON.stringify({
        //   followedBy: {
        //     [`${action}`]: [{ id: user.id }],
        //   },
        //   ///notificationMessage,
        //   ///notificationContextURL: router.asPath,
        //   //notificationToUsers:[id],
        // }),
        //"userStartFollowing":"{{userName}} has started following you. Take a look at his/her Mediatheque too!""
      });
      if(res.ok){
        const json = await res.json();
        if(notifier)
          notifier.notify({
            toUsers:[+id],
            data:{message:notificationMessage}
          });
        return json;
      }
      else{
        return null;
      }
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(['USER', id]);
        await queryClient.cancelQueries(['USER', idSession]);

        type UserFollow = User & { followedBy: User[]; following: User[] };
        const followingUser = queryClient.getQueryData<UserFollow>(['USER', id]);
        const followedByUser = queryClient.getQueryData<UserFollow>(['USER', idSession]);
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
        queryClient.setQueryData(['USER', id], { ...followingUser, followedBy });
        queryClient.setQueryData(['USER', idSession], { ...followedByUser, following });
        return { followingUser, followedByUser };
      },
      onError: (err, data, context: any) => {
        queryClient.setQueryData(['USER', id], context.followingUser);
        queryClient.setQueryData(['USER', idSession], context.followedByUser);
      },

      onSettled: () => {
        queryClient.invalidateQueries(['USER', id]);
        queryClient.invalidateQueries(['USER', idSession]);
      },
    },
  );

  const followHandler = async () => {
    const s = session;
    if (user && s!.user) {
      if (parseInt(id, 10) !== (s as unknown as Session).user.id) mutateFollowing();
    }
  };

  const seeAll = async (data: (Item | UserMosaicItem)[], q: string, showFilterEngine = true): Promise<void> => {
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      itemsFound: data,
      q,
      show: showFilterEngine,
    });
    router.push(`/search?q=${q}`);
  };
  

  const postsCreated = () => {
    if (user && user.posts && user.posts.length) {
      const P = user.posts.map((p) => ({ ...p , type: 'post' }));
      return (
        <CarouselStatic
          className="mb-5"
          onSeeAll={async () => seeAll(P as Item[], t('Eurekas I created'))}
          title={t('Eurekas I created')}
          data={P as Item[]}
          iconBefore={<></>}
          mosaicBoxClassName="pb-1"
          // iconAfter={<BsCircleFill className={styles.infoCircle} />}
        />
      );
    }
    return '';
  };

  const cyclesJoined = () => {
    const C: ItemCycle[] = [];
    if (user && user.cycles && user.cycles.length) {
      const c1 = user.cycles.map((c) => ({ ...c, type: 'cycle' }));
      C.push(...(c1 as ItemCycle[]));
    }
    if (user && user.joinedCycles && user.joinedCycles.length) {
      const JC: ItemCycle[] = [];
      user.joinedCycles.reduce((p: ItemCycle[], c) => {
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
      const RW = user.ratingWorks.map((w) => (w as RatingOnWork & { work: WorkMosaicItem }).work!);

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
    const SFL: Item[] = [];
    if (user && user.favWorks && user.favWorks.length) {
      const w1 = user.favWorks as Item[];
      SFL.push(...w1);
    }
    if (user && user.favCycles && user.favCycles.length) {
      const c1 = user.favCycles.map((c) => ({ ...c, type: 'cycle' })) as Item[];
      SFL.push(...c1);
    }
    if (user && user.favPosts && user.favPosts.length) {
      const p1 = user.favPosts.map((p) => ({ ...p, type: 'post' })) as Item[];
      SFL.push(...p1);
    }
    SFL.sort((f: Item, s: Item) => {
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

  const renderCountry = () => {
    if (user && user.countryOfOrigin)
      return (
        <em>
          <AiOutlineEnvironment /> {`${t(`countries:${user.countryOfOrigin}`)}`}
        </em>
      );
    return '';
  };

  const avatarError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };

  const renderAvatar = ()=>{
    if(user){
      if(!user?.photos.length)
        return <img
        onError={avatarError}
        className='avatar'
        src={user.image || '/img/default-avatar.png'}
        alt={user.name||''}
      />;
      return <LocalImageComponent className='avatar' filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />
    }
    return '';
  };

  return (
    <SimpleLayout title={t('Mediatheque')}>
      <>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>

        {!(isLoadingUser || isLoadingSession) && user && (
          <section>
            <Card className='userHeader'>
              <Card.Body>
                <Row className='d-flex flex-column flex-md-row' >
                  <Col className='d-flex flex-column flex-sm-wrap align-items-start'>
                    <div className="d-flex flex-nowrap">
                       {renderAvatar()}
                        <div className='ms-3 d-sm-block d-md-none'>
                         <h2>{user.name}</h2>
                         {renderCountry()}
                         </div>
                      </div>
                    <TagsInput className='d-sm-block d-md-none' tags={user.tags || ''} readOnly label="" />
                  </Col>
                  <Col className='col col-sm-12 col-md-8'>
                    <div className='d-none d-md-block'>
                      <h2>{user.name}</h2>
                      {renderCountry()}
                    </div>
                    <div className='d-none d-md-block'>
                       <p className={styles.description}>{user.aboutMe}</p>
                    </div>
                    <div className='mt-3 d-sm-block d-md-none'>
                       <UnclampText isHTML={false} text={user.aboutMe || ''} clampHeight="6rem" />
                    </div>
                    <TagsInput className='d-none d-md-block' tags={user.tags || ''} readOnly label="" />
                  </Col>
                  <Col className='mt-2 d-grid gap-2 d-md-flex align-items-start  justify-content-md-end d-lg-block'>
                    {session && (session as unknown as Session).user!.id !== user.id && !isFollowedByMe && (
                      <Button className='text-white rounded-pill' onClick={followHandler} disabled={isLoadingMutateFollowing}>
                        {t('Follow')}
                        {isLoadingMutateFollowing && <Spinner animation="grow" variant="info" size="sm" />}
                      </Button>
                    )}

                    {session && (session as unknown as Session).user!.id !== user.id && isFollowedByMe && (
                      <Button
                        variant="button border-primary text-primary fs-6"
                        className="w-80 rounded-pill"
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
                <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('Mediatheque')}</h1>
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
        <aside>
          {renderAccessInfo()}
          {(isLoadingUser || isLoadingSession) && <Spinner animation="grow" variant="info" />}
          {isSuccessUser && id && !user && <Spinner animation="grow" variant="info" />}
        </aside>
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
