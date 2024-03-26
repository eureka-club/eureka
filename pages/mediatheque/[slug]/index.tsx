import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useQueryClient, useMutation, dehydrate, QueryClient } from 'react-query';
import { useState, useEffect, SyntheticEvent, useCallback, MouseEvent } from 'react';
import { Spinner, Card, Row, Col, Button } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
import LocalImageComponent from '@/src/components/LocalImage';
import { User } from '@prisma/client';
import styles from './index.module.css';
import useUser, { getUser } from '@/src/useUser';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import FilterEngine from '@/src/components/FilterEngine';
import TagsInput from '@/src/components/forms/controls/TagsInput';
import { useNotificationContext } from '@/src/useNotificationProvider';
import useMyPosts, { getMyPosts } from '@/src/useMyPosts';
import useMyCycles, { getMyCycles } from '@/src/useMyCycles';
import slugify from 'slugify';
import { Session } from '@/src/types';
import PostsCreated from './PostsCreated';
import CyclesJoined from './CyclesJoined';
import SavedForLater from './SavedForLater';
import { isAccessAllowed } from '@/src/lib/utils';
import RenderAccessInfo from './RenderAccessInfo';
import dayjs from 'dayjs';
import { PostDetail } from '@/src/types/post';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import useFilterMediatheque from '@/src/components/useFilterMediatheque';
import { Box, Stack } from '@mui/material';

interface Props {
  id: number;
  session: Session;posts:PostDetail[]
}
const Mediatheque: NextPage<Props> = ({ id, session }) => {
  const router = useRouter();
  const { notifier } = useNotificationContext();
  const queryClient = useQueryClient();
  const { t } = useTranslation('mediatheque');
  const {FilterMediatheque,filtersChecked}=useFilterMediatheque();

  const {
    data: user,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
  } = useUser(id, {
    enabled: !isNaN(id),
  });
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false);

  const { data: postsData } = useMyPosts(id); 
  // const [posts, setPosts] = useState(dataPosts?.posts);

  const { data:cyclesData } = useMyCycles(id);
  // const [cycles, setCycles] = useState(dataCycles?.cycles);

  // useEffect(() => {
  //   if (posts && dataCycles?.cycles) {
  //     setCycles(dataCycles?.cycles);
  //   }
  // }, [posts, dataCycles?.cycles]);

  useEffect(() => {
    if (postsData?.posts?.length && cyclesData?.cycles?.length) {
      if (user) {
        const ifbm =
          user && user.followedBy ? user.followedBy.findIndex((i) => i.id === session?.user.id) !== -1 : false;
        setIsFollowedByMe(ifbm);
      }
      if (isSuccessUser && id && !user) {
        queryClient.invalidateQueries(['USER', `${id}`]);
      }
    }
  }, [postsData?.posts, cyclesData?.cycles, user, id, isSuccessUser]);

  const { mutate: mutateFollowing, isLoading: isLoadingMutateFollowing } = useMutation<User>(
    async () => {
      const user = session!.user;
      const action = isFollowedByMe ? 'disconnect' : 'connect';

      const notificationMessage = `userStartFollowing!|!${JSON.stringify({
        userName: user.name,
      })}`;
      const form = new FormData();
      form.append(
        'followedBy',
        JSON.stringify({
          [`${action}`]: [{ id: user.id }],
        }),
      );
      form.append(
        'notificationData',
        JSON.stringify({
          notificationMessage,
          notificationContextURL: `/mediatheque/${session.user.id}`,
          notificationToUsers: [id],
        }),
      );

      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        // headers: { 'Content-Type': 'application/json' },
        body: form,
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
      if (res.ok) {
        const json = await res.json();
        if (notifier)
          notifier.notify({
            toUsers: [+id],
            data: { message: notificationMessage },
          });
        return json;
      } else {
        return null;
      }
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(['USER', id]);
        await queryClient.cancelQueries(['USER', session.user.id]);

        type UserFollow = User & { followedBy: User[]; following: User[] };
        const followingUser = queryClient.getQueryData<UserFollow>(['USER', id]);
        const followedByUser = queryClient.getQueryData<UserFollow>(['USER', session.user.id]);
        setIsFollowedByMe((p) => !p);
        // let followedBy: User[] = [];
        // let following: User[] = [];
        // if (followingUser && followedByUser)
        //   if (isFollowedByMe) {
        //     followedBy = followingUser.followedBy.filter((i: User) => i.id !== +idSession);
        //     following = followedByUser.following.filter((i: User) => i.id !== +id);
        //   } else {
        //     followedBy = [...followingUser.followedBy, followedByUser];
        //     following = [...followedByUser.following, followingUser];
        //   }
        // queryClient.setQueryData(['USER', id], { ...followingUser, followedBy });
        // queryClient.setQueryData(['USER', idSession], { ...followedByUser, following });

        return { followingUser, followedByUser };
      },
      onError: (err, data, context: any) => {
        queryClient.setQueryData(['USER', id], context.followingUser);
        queryClient.setQueryData(['USER', session.user.id], context.followedByUser);
      },

      onSettled: () => {
        queryClient.invalidateQueries(['USER', id]);
        queryClient.invalidateQueries(['USER', session.user.id]);
      },
    },
  );

  const followHandler = async () => {
    const s = session;
    if (user && s) {
      if (id !== s.user.id) {
        mutateFollowing();
      }
    }
  };

  const goTo = useCallback(
    (path: string) => {
      if (user) {
        const sts = `${user.name || id.toString()}-${id}`;
        router.push(`/user/${slugify(sts, { lower: true })}/${path}`);
      } else router.push(`/`);
    },
    [router, user],
  );

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

  const renderAvatar = () => {
    if (user) {
      if (!user?.photos || !user?.photos.length)
        return (
          <img
            onError={avatarError}
            className="avatar"
            src={user.image || '/img/default-avatar.png'}
            alt={user.name || ''}
          />
        );
      return (
        <>
          <div className="d-flex d-md-none mb-2">
            <LocalImageComponent
              className="rounded rounded-circle"
              /* className='avatar' */ width={65}
              height={65}
              filePath={`users-photos/${user.photos[0].storedFile}`}
              alt={user.name || ''}
            />
          </div>
          <div className="d-none d-md-flex">
            <LocalImageComponent
              className="rounded rounded-circle"
              /* className='avatar' */ width={160}
              height={160}
              filePath={`users-photos/${user.photos[0].storedFile}`}
              alt={user.name || ''}
            />
          </div>
        </>
      );
    }
    return '';
  };

  const isPending = () => {
    return isLoadingUser || isLoadingMutateFollowing;
  };

 const getReadOrWatchedTotal = () => {
    return user?.readOrWatchedWorks?.length;
  };

  const getReadCurrentYear = () => {
    if (user) {
      if (user.readOrWatchedWorks?.length) return user.readOrWatchedWorks.filter(x => ['book', 'fiction-book'].includes(x.work!.type) && x.year === dayjs().year()).length;
      else return 0;
    }
  };

  const getWatchedCurrentYear = () => {
    if (user) {
      if (user.readOrWatchedWorks.length)
        return user.readOrWatchedWorks.filter(
          (x) => ['movie', 'documentary'].includes(x.work!.type) && x.year === dayjs().year(),
        ).length;
      else return 0;
    }
  };

  const goToReadOrWatched = (e: MouseEvent<HTMLDivElement>, tab: string | null, year: string | null) => {
    e.preventDefault();
    const sts = `${user!.name || id.toString()}-${id}`;
    if (tab && year)
      router.push(`/user/${slugify(sts, { lower: true })}/my-read-or-watched?tabKey=${tab}&year=${year}`)
    else
      router.push(`/user/${slugify(sts, { lower: true })}/my-read-or-watched`)
  };

  return (
    <SimpleLayout title={t('Mediatheque')}>
        <ButtonsTopActions/>
      <article data-cy="mediatheque">
        {!isLoadingUser && user && (
          <section>
            <Card className="userHeader">
              <Card.Body>
                <Row className="d-flex flex-column flex-md-row">
                  <Col className="d-flex flex-column flex-sm-wrap align-items-start">
                    <div className="d-flex flex-nowrap">
                      {renderAvatar()}
                      <div className="ms-3 d-sm-block d-md-none">
                        <h2>{user.name}</h2>
                        {renderCountry()}
                      </div>
                    </div>
                    <TagsInput className="d-sm-flex d-md-none d-flex flex-row" tags={user.tags || ''} readOnly label="" />
                  </Col>
                  <Col className="col col-sm-12 col-md-8">
                    <div className="d-none d-md-block">
                      <h2>{user.name}</h2>
                      {renderCountry()}
                    </div>
                    <div className="">
                      <p className={styles.description}>{user.aboutMe}</p>
                    </div>
                    <TagsInput className="d-none d-md-flex flex-row" tags={user.tags || ''} readOnly label="" />
                  </Col>
                  <Col className="mt-2 d-grid gap-2 d-md-flex align-items-start  justify-content-md-end d-lg-block">
                    {session && session.user!.id == user.id && (
                      <Button className="btn-eureka" onClick={() => router.push('/profile')}>
                        {t('editProfile')}
                      </Button>
                    )}
                    {session && session.user!.id !== user.id && !isFollowedByMe && (
                      <Button
                        data-cy="follow-btn"
                        className="btn-eureka"
                        onClick={followHandler}
                        disabled={isPending()}
                      >
                        {t('Follow')}
                        {isPending() && <Spinner className="ms-2" animation="grow" variant="info" size="sm" />}
                      </Button>
                    )}

                    {session && session.user!.id !== user.id && isFollowedByMe && (
                      <Button
                        data-cy="follow-btn"
                        variant="button border-primary text-primary w-100"
                        onClick={followHandler}
                        disabled={isPending()}
                        style={{ width: '10em' }}
                      >
                        {t('Unfollow')}
                        {isPending() && <Spinner className="ms-2" animation="grow" variant="info" size="sm" />}
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {isAccessAllowed(session, user, isLoadingUser, isFollowedByMe) && (
              <Stack rowGap={6}>
                <Stack rowGap={1}>
                  <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('Mediatheque')}</h1>
                  <FilterMediatheque/>
                </Stack>
                  {/* <FilterEngine fictionOrNotFilter={false} geographyFilter={false} /> */}
                  <section className="d-flex flex-column flex-lg-row">
                    <Col xs={12} lg={2} className="me-2">
                      <h2 onClick={(e) => goToReadOrWatched(e, null, null)} className="text-secondary text-center  cursor-pointer" style={{ textDecoration: "underline" }}>{`${t('readOrWatchedWorks')}`}</h2>
                      <h2 className="text-secondary text-center fs-5">{`(${getReadOrWatchedTotal()})`}</h2>
                      <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation">
                        <h2 className="p-1 m-0 text-wrap text-center fs-6 cursor-pointer" style={{ textDecoration: "underline" }} onClick={(e) => goToReadOrWatched(e, 'books', dayjs().year().toString())}>
                          {`${t('readOrWatchedBooks').toLocaleUpperCase()} ${dayjs().year()}`}
                        </h2>
                        <h2 className="p-1 m-0 text-wrap text-center fs-5">{`(${getReadCurrentYear()})`}</h2>
                      </section>
                      <section className="mt-5 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation">
                        <h2 className="p-1 m-0 text-wrap text-center fs-6 cursor-pointer" style={{ textDecoration: "underline" }} onClick={(e) => goToReadOrWatched(e, 'movies', dayjs().year().toString())}>
                          {`${t('readOrWatchedMovies').toLocaleUpperCase()} ${dayjs().year()}`}
                        </h2>
                        <h2 className="p-1 m-0 text-wrap text-center fs-5">{`(${getWatchedCurrentYear()})`}</h2>
                      </section>
                    </Col>
                    <Col xs={12} lg={10} className="mt-5 mt-lg-0">
                      <section className="ms-0 ms-lg-5">
                        {
                          filtersChecked.post
                             ? <PostsCreated showSeeAll={postsData?.fetched!<postsData?.total!} posts={postsData?.posts?.slice(0, 6)!} user={user} goTo={goTo} id={id.toString()} t={t} />
                             : <></>
                        }
                        {
                          filtersChecked.cycle
                            ? <CyclesJoined showSeeAll={cyclesData?.fetched!<cyclesData?.total!} cycles={cyclesData?.cycles?.slice(0, 6)!} goTo={goTo} id={id.toString()} />
                            : <></>
                        }
                        <SavedForLater 
                          showCycles={filtersChecked.cycle} 
                          showPosts={filtersChecked.post} 
                          showBooks={filtersChecked.book} 
                          showMovies={filtersChecked.movie} 
                          user={user} goTo={goTo} t={t} id={id} />
                      </section>
                    </Col>
                  </section>
              </Stack>
            )}
          </section>
        )}
        <aside>
          <RenderAccessInfo
            session={session}
            user={user!}
            t={t}
            isLoadingUser={isLoadingUser}
            isFollowedByMe={isFollowedByMe}
          />
          {isLoadingUser && <Spinner animation="grow" variant="info" />}
          {isSuccessUser && id && !user && <Spinner animation="grow" variant="info" />}
        </aside>
      </article>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const session = await getSession(ctx);
  let id = 0;
  const take = 50;
  if (ctx.query && ctx.query.slug) {
    const slug = ctx.query.slug.toString();
    const li = slug.split('-').slice(-1);
    id = parseInt(li[0]);
    if (!session) {
      return {
        props: {
          id,
          dehydratedState: dehydrate(queryClient),
        },
      };
    }
    const { posts } = await getMyPosts(id!,session, take);

    await queryClient.prefetchQuery(['MY-POSTS'], () => posts);
    posts.forEach((p) => {
      queryClient.setQueryData(['POST', `${p.id}`], () => p);
    });

    const { cycles } = await getMyCycles(id!, take);
    await queryClient.prefetchQuery(['MY-CYCLES',id.toString()], () => cycles);
    cycles.forEach((c) => {
      queryClient.setQueryData(['CYCLE', c.id], () => c);
    });

    const user = await getUser(id);
    await queryClient.prefetchQuery(['USER', id.toString()], () => user);

    return {
      props: {
        session,
        id,posts,
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
  return { props: {} };
};
export default Mediatheque;
