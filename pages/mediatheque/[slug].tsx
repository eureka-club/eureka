import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import { useQueryClient, useMutation, dehydrate, QueryClient } from 'react-query';
import { useState, useEffect, SyntheticEvent } from 'react';

import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
import { /* BsCircleFill, */ BsBookmark, BsEye } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import LocalImageComponent from '@/src/components/LocalImage'
import { HiOutlineUserGroup } from 'react-icons/hi';

import { User } from '@prisma/client';
import styles from './index.module.css';
import useUser from '@/src/useUser';

import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import FilterEngine from '../../src/components/FilterEngine';
import TagsInput from '../../src/components/forms/controls/TagsInput';

import CarouselStatic from '../../src/components/CarouselStatic';

import { WorkMosaicItem /* , WorkWithImages */ } from '../../src/types/work';
import { UserMosaicItem /* , UserDetail, WorkWithImages */ } from '../../src/types/user';
import UnclampText from '../../src/components/UnclampText';
import { useNotificationContext } from '@/src/useNotificationProvider';
import useMyPosts,{getMyPosts} from '@/src/useMyPosts';
import useMyCycles,{getMyCycles} from '@/src/useMyCycles';
import useMySaved from '@/src/useMySaved';
import slugify from 'slugify'
import { PostMosaicItem } from '@/src/types/post';
import { CycleMosaicItem } from '@/src/types/cycle';


interface Props{
  id:number;
}
const Mediatheque: NextPage<Props> = ({id}) => {
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"
  const [idSession, setIdSession] = useState<string>('');
  const router = useRouter();
  const {notifier} = useNotificationContext();
  
  const queryClient = useQueryClient();
  const { t } = useTranslation('mediatheque');
 
  useEffect(() => {
    if (session) setIdSession(session.user.id.toString());
  }, [session, router]);

  const { /* isError, error, */ data: user, isLoading: isLoadingUser, isSuccess: isSuccessUser } = useUser(+id,{
    enabled:!!+id
  });

  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false);
  

  const {data:dataPosts} = useMyPosts(id)
  const [posts,setPosts] = useState(dataPosts?.posts);

  useEffect(()=>{
    if(dataPosts?.posts){
      setPosts(dataPosts.posts)
    }
  },[dataPosts?.posts])

  const {data:dataCycles} = useMyCycles(id);
  const [cycles,setCycles] = useState(dataCycles?.cycles);

  useEffect(()=>{
    if(dataCycles?.cycles){
      setCycles(dataCycles?.cycles)
    }
  },[dataCycles?.cycles])

  const SFL = useMySaved(id)

  useEffect(() => {
    if(user){
      const ifbm = (user && user.followedBy) ? user.followedBy.findIndex((i) => i.id === session?.user.id) !== -1 : false
      setIsFollowedByMe(ifbm)
    }
    if (isSuccessUser && id && !user) {
      queryClient.invalidateQueries(['USER', `${id}`]);
    }
  }, [user, id, isSuccessUser]);


  const isAccessAllowed = () => {
    if (!isLoadingUser && user && user.id) {
      if (!user.dashboardType || user.dashboardType === 1) return true;
      if (!isLoadingSession) {
        // if (!session) return false;
        if (session) {
          const s = session;
          if (user.id === s.user.id) return true;
          if (user.dashboardType === 2 && isFollowedByMe) return true;
          if (user.dashboardType === 3 && user.id === s.user.id) return true;
        }
      }
    }
    return false;
  };

  const { mutate: mutateFollowing, isLoading: isLoadingMutateFollowing } = useMutation<User>(
    async () => {
      const user = session!.user;
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
        notificationContextURL:`/mediatheque/${idSession}`,
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
        setIsFollowedByMe(p=>!p)
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
    if (user && s) {
      if (id !== s.user.id) {
        mutateFollowing();

      }
    }
  };
  
  const goTo = (path:string)=>{
    if(user){
      const sts = `${user.name||id.toString()}-${id}`
      router.push(`/user/${slugify(sts,{lower:true})}/${path}`) 
    }
    else router.push(`/`)
  }
  
  const postsCreated = () => {
    if (user && posts && posts.length) {
      return (
        <CarouselStatic
          cacheKey={['MY-POSTS',id.toString()]}
          className="mb-5"
          onSeeAll={()=>goTo('my-posts')}
          title={t('common:myPosts')}
          data={posts}
          mosaicBoxClassName="pb-1"
        />
      );
    }
    return '';
  };

  const cyclesJoined = () => {
    return (cycles && cycles.length) 
    ? <CarouselStatic
        cacheKey={['MY-CYCLES',id.toString()]}
        onSeeAll={()=>goTo('my-cycles')}
        title={t('common:myCycles')}
        data={cycles}
      />
    : <></>;
  };
  
  const readOrWatched = () => {
    if (user && user.ratingWorks && user.ratingWorks.length) {
      const RW = user.ratingWorks.map((w) => w.work as WorkMosaicItem);

      return (
        <CarouselStatic
          cacheKey={['MEDIATHEQUE-WATCHED',`USER-${user.id}`]}
          onSeeAll={()=>goTo('my-books-movies')}
          title={t(`common:myBooksMovies`)}
          data={RW}
          iconBefore={<BsEye />}

          // iconAfter={<BsCircleFill className={styles.infoCircle} />}
        />
      );
    }
    return '';
  };
  
  const savedForLater = () => {
    if (SFL)
      return (
        <CarouselStatic
          cacheKey={['MEDIATHEQUE-SAVED',`USER-${user!.id}`]}
          onSeeAll={()=>goTo('my-saved')}
          title={t('common:mySaved')}
          data={[...SFL.favPosts,...SFL.favCycles,...SFL.favWorks] as PostMosaicItem[]|CycleMosaicItem[]|WorkMosaicItem[]}
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
          cacheKey={['MEDIATHEQUE-FOLLOWING',`USER-${user.id}`]}
          onSeeAll={()=>goTo('my-users-followed')}
          title={`${t('common:myUsersFollowed')}  `}
          data={user!.following as UserMosaicItem[]}
          iconBefore={<HiOutlineUserGroup />}
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
      if(!user?.photos || !user?.photos.length)
        return <img
        onError={avatarError}
        className='avatar'
        src={user.image || '/img/default-avatar.png'}
        alt={user.name||''}
      />;
      return <>      
      <div className='d-flex d-md-none mb-2'><LocalImageComponent className="rounded rounded-circle" /* className='avatar' */ width={65} height={65} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} /></div>
      <div className='d-none d-md-flex'><LocalImageComponent className="rounded rounded-circle" /* className='avatar' */ width={160} height={160} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} /></div>

      </>
    }
    return '';
  };

  const isPending = () => {
    return isLoadingSession || isLoadingUser || isLoadingMutateFollowing;
  }

  return (
    <SimpleLayout title={t('Mediatheque')}>
      <article data-cy="mediatheque">
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
                      {session && session.user!.id == user.id && (
                      <Button className='text-white rounded-pill' onClick={()=>router.push('/profile')}>
                        {t('editProfile')}
                      </Button>
                    )}
                    {session && session.user!.id !== user.id && !isFollowedByMe && (
                      <Button 
                        data-cy="follow-btn" 
                        className='text-white rounded-pill' 
                        onClick={followHandler} 
                        disabled={isPending()}
                      >
                        {t('Follow')}
                        {isPending() && <Spinner animation="grow" variant="info" size="sm" />}
                      </Button>
                    )}

                    {session && session.user!.id !== user.id && isFollowedByMe && (
                      <Button
                        data-cy="follow-btn"
                        variant="button border-primary text-primary fs-6"
                        className="w-80 rounded-pill"
                        onClick={followHandler}
                        disabled={isPending()}
                      >
                        {t('Unfollow')}
                        {isPending() && <Spinner animation="grow" variant="info" size="sm" />}
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
      </article>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const session = await getSession(ctx);

  if(!session){
    return {
      props:{
      dehydratedState: dehydrate(queryClient),
    }}
  }
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL
  
  let id = 0;
  if(ctx.query && ctx.query.slug){
    const slug = ctx.query.slug.toString()
    const li = slug.split('-').slice(-1)
    id = parseInt(li[0])
    const {posts} = await getMyPosts(id!,8,origin);
    await queryClient.prefetchQuery(['MY-POSTS',id], ()=>posts);
    posts.forEach(p=>{
      queryClient.setQueryData(['POST',`${p.id}`], ()=>p)
    })
  
    const {cycles} = await getMyCycles(id!,8,origin);
    await queryClient.prefetchQuery(["MY-CYCLES"],()=>cycles)
    cycles.forEach(c=>{
      queryClient.setQueryData(['CYCLE',c.id], ()=>c)
    })
  
    return {
      props: {
        id,
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
  return {props:{}}

};

export default Mediatheque;
