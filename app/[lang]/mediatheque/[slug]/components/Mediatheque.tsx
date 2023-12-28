"use client"

import { Session } from "@/src/types";
import { useParams, usePathname } from "next/navigation";
import { FC, useState, useEffect, SyntheticEvent, useCallback, MouseEvent } from "react";
import { Alert, Button, Spinner, Card, Row, Col, ButtonGroup } from "react-bootstrap";
import { AiOutlineEnvironment } from 'react-icons/ai';
import toast from 'react-hot-toast';
import useCycle from '@/src/hooks/useCycle';
import useUsers, { getUsers } from '@/src/hooks/useUsers';
import { useJoinUserToCycleAction } from '@/src/hooks/mutations/useCycleJoinOrLeaveActions';
import { useModalContext } from '@/src/hooks/useModal';
import { CycleMosaicItem } from "@/src/types/cycle";
import { useIsFetching } from "@tanstack/react-query";
import { UserMosaicItem } from "@/src/types/user";
import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";
import useMyPosts, { getMyPosts } from '@/src/hooks/useMyPosts';
import useMyCycles, { getMyCycles } from '@/src/hooks/useMyCycles';
import { PostMosaicItem } from "@/src/types/post";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '@prisma/client';
import { useNotificationContext } from '@/src/hooks/useNotificationProvider';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import LocalImageComponent from '@/src/components/LocalImage';
import { BiArrowBack } from 'react-icons/bi';
import TagsInput from '@/src/components/forms/controls/TagsInput';
import styles from './Mediatheque.module.css';
import { isAccessAllowed } from '@/src/lib/utils';
import FilterEngine from '@/src/components/FilterEngine';
import PostsCreated from './PostsCreated';
import CyclesJoined from './CyclesJoined'; 
import SavedForLater from './SavedForLater'; 
import useUser from "@/src/hooks/useUser";
import getUserIdFromSlug from "@/src/getUserIdFromSlug";

interface Props{
    session:Session | null;
    
}
const Mediatheque:FC<Props>=({session})=>{
    const {slug} = useParams<{slug:string,lang:string}>();
    const id = getUserIdFromSlug(slug);

    const {data:user} = useUser(id,{enabled:id!=-1});

    const{dict,langs}=useDictContext();
    const router = useRouter();
    const { notifier } = useNotificationContext();

    const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false);
    // const { data: dataPosts } = useMyPosts(user!.id);
    
    // const [posts, setPosts] = useState<PostMosaicItem[]>();
    //console.log(dataPosts?.posts, 'posts')

    // const { data: dataCycles } = useMyCycles(session?.user.language || langs,user!.id);
    // const [cycles, setCycles] = useState<CycleMosaicItem[]>();
    //console.log(dataCycles?.cycles, 'cycles')

    // useEffect(() => {
    //     if (dataPosts?.posts) {
    //         setPosts(dataPosts.posts);
    //     }
    // }, [dataPosts?.posts]);

    // useEffect(() => {
    //     if (dataPosts?.posts && dataCycles?.cycles) {
    //         setCycles(dataCycles?.cycles);
    //     }
    // }, [dataPosts?.posts, dataCycles?.cycles]);

    // useEffect(() => {
    //     if (dataPosts?.posts && dataCycles?.cycles) {
    //         if (user) {
    //             const ifbm =
    //                 user && user.followedBy ? user.followedBy.findIndex((i) => i.id === session?.user.id) !== -1 : false;
    //             setIsFollowedByMe(ifbm);
    //         }
           
    //     }
    // }, [dataPosts?.posts, dataCycles?.cycles, user]);


    const { mutate: mutateFollowing, isPending: isLoadingMutateFollowing } = useMutation<User>({
        mutationFn: async () => {
            const userSession = session!.user; //user session
            const id = user!.id; //mediateca user

            const action = isFollowedByMe ? 'disconnect' : 'connect';

            const notificationMessage = `userStartFollowing!|!${JSON.stringify({
                userName: userSession.name,
            })}`;
            const form = new FormData();
            form.append(
                'followedBy',
                JSON.stringify({
                    [`${action}`]: [{ id: userSession.id }],
                }),
            );
            form.append(
                'notificationData',
                JSON.stringify({
                    notificationMessage,
                    notificationContextURL: `/mediatheque/${userSession.id}`,
                    notificationToUsers: [id],
                }),
            );

            const res = await fetch(`/api/user/${id}`, {
                method: 'PATCH',
                body: form,
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
        },  //TODO TO CHECk
        // onMutate: async () => {
        //     await queryClient.cancelQueries(['USER', id]);
        //     await queryClient.cancelQueries(['USER', userSession.id]);

        //     type UserFollow = User & { followedBy: User[]; following: User[] };
        //     const followingUser = queryClient.getQueryData<UserFollow>(['USER', id]);
        //     const followedByUser = queryClient.getQueryData<UserFollow>(['USER', session?.user.id]);
        //     setIsFollowedByMe((p) => !p);
        // },
        // onError: async (err, data, context: any) => {
        //     queryClient.setQueryData(['USER', id], context.followingUser);
        //     queryClient.setQueryData(['USER', userSession.id], context.followedByUser);
        // },
        // onSettled: async () => {
        //     queryClient.invalidateQueries(['USER', id]);
        //     queryClient.invalidateQueries(['USER', userSession.id]);
        // },
    }
        
    );


    const followHandler = async () => {
        const s = session;
        if (user && s) {
            if (user.id !== s.user.id) {
                mutateFollowing();
            }
        }
    };

    const goTo = useCallback(
        (path: string) => {
            if (user) {
                const sts = `${user.name || user.id.toString()}-${user.id}`;
                router.push(`/user/${slugify(sts, { lower: true })}/${path}`);
            } else router.push(`/`);
        },
        [router, user],
    );

    const renderCountry = () => {
        if (user && user.countryOfOrigin)
            return (
                <em>
                    <AiOutlineEnvironment /> {`${t(dict,`${user.countryOfOrigin}`)}`}
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
        return isLoadingMutateFollowing; //isLoadingUser ||
    };

    const getReadOrWatchedTotal = () => {
        if (user) return user.readOrWatchedWorks.length;
    };

    const getReadCurrentYear = () => {
        if (user) {
            if (user.readOrWatchedWorks.length) return user.readOrWatchedWorks.filter(x => ['book', 'fiction-book'].includes(x.work!.type) && x.year === dayjs().year()).length;
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
        const sts = `${user!.name || user!.id.toString()}-${user!.id}`;
        if (tab && year)
            router.push(`/user/${slugify(sts, { lower: true })}/my-read-or-watched?tabKey=${tab}&year=${year}`)
        else
            router.push(`/user/${slugify(sts, { lower: true })}/my-read-or-watched`)
    };





    return (
        <article data-cy="mediatheque">
            <ButtonGroup className="mt-1 mt-md-3 mb-1">
                <Button variant="primary text-white" onClick={() => router.back()} size="sm">
                    <BiArrowBack />
                </Button>
            </ButtonGroup>
            { user && (
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
                                    {/*<div className="mt-3 d-sm-block d-md-none">
                      <UnclampText isHTML={false} text={user.aboutMe || ''} clampHeight="6rem" />
                    </div>*/}
                                    <TagsInput className="d-none d-md-flex flex-row" tags={user.tags || ''} readOnly label="" />
                                </Col>
                                <Col className="mt-2 d-grid gap-2 d-md-flex align-items-start  justify-content-md-end d-lg-block">
                                    {session && session.user!.id == user.id && (
                                        <Button className="btn-eureka" onClick={() => router.push('/profile')}>
                                            {t(dict,'editProfile')}
                                        </Button>
                                    )}
                                    {session && session.user!.id !== user.id && !isFollowedByMe && (
                                        <Button
                                            data-cy="follow-btn"
                                            className="btn-eureka"
                                            onClick={followHandler}
                                            disabled={isPending()}
                                        >
                                            {t(dict,'Follow')}
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
                                            {t(dict,'Unfollow')}
                                            {isPending() && <Spinner className="ms-2" animation="grow" variant="info" size="sm" />}
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                            {/* <BsCircleFill className={styles.infoCircle} /> */}
                        </Card.Body>
                    </Card>
                    {isAccessAllowed(session!, user, false, isFollowedByMe) && (
                        <>
                            <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t(dict,'Mediatheque')}</h1>
                            <FilterEngine fictionOrNotFilter={false} geographyFilter={false} />
                            <section className="d-flex flex-column flex-lg-row">
                                <Col xs={12} lg={2} className="me-2">
                                    <h2 onClick={(e) => goToReadOrWatched(e, null, null)} className="text-secondary text-center  cursor-pointer" style={{ textDecoration: "underline" }}>{`${t(dict,'readOrWatchedWorks')}`}</h2>
                                    <h2 className="text-secondary text-center fs-5">{`(${getReadOrWatchedTotal()})`}</h2>
                                    <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation">
                                        <h2 className="p-1 m-0 text-wrap text-center fs-6 cursor-pointer" style={{ textDecoration: "underline" }} onClick={(e) => goToReadOrWatched(e, 'books', dayjs().year().toString())}>
                                            {`${t(dict,'readOrWatchedBooks').toLocaleUpperCase()} ${dayjs().year()}`}
                                        </h2>
                                        <h2 className="p-1 m-0 text-wrap text-center fs-5">{`(${getReadCurrentYear()})`}</h2>
                                    </section>
                                    <section className="mt-5 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation">
                                        <h2 className="p-1 m-0 text-wrap text-center fs-6 cursor-pointer" style={{ textDecoration: "underline" }} onClick={(e) => goToReadOrWatched(e, 'movies', dayjs().year().toString())}>
                                            {`${t(dict,'readOrWatchedMovies').toLocaleUpperCase()} ${dayjs().year()}`}
                                        </h2>
                                        <h2 className="p-1 m-0 text-wrap text-center fs-5">{`(${getWatchedCurrentYear()})`}</h2>
                                    </section>
                                </Col>
                                <Col xs={12} lg={10} className="mt-5 mt-lg-0">
                                    <section className="ms-0 ms-lg-5">
                                        <PostsCreated goTo={goTo} />
                                        <CyclesJoined goTo={goTo} />
                                        <SavedForLater goTo={goTo} />

                                        {/*<ReadOrWatched user={user} id={id.toString()} goTo={goTo} t={t} />*/}
                                        {/* <UsersFollowed user={user} goTo={goTo} t={t} /> */}
                                    </section>
                                </Col>
                            </section>
                        </>
                    )}
                </section>
            )}
      </article>
    )
   
}
export default Mediatheque;