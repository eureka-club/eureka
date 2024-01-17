
import { FunctionComponent,useState, useEffect } from 'react';
import { Card, Row, Col,Spinner,Button,Tooltip } from 'react-bootstrap';
import { AiOutlineEnvironment,AiOutlineUserAdd,AiOutlineUserDelete,AiOutlineUser } from 'react-icons/ai';
import { useQueryClient, useMutation} from '@tanstack/react-query';;
import { useNotificationContext } from '@/src/useNotificationProvider';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import styles from './MosaicItem.module.css';
import UserAvatar from '../common/UserAvatar';
import { UserMosaicItem } from '../../types/user';
import TagsInput from '../forms/controls/TagsInput';
import LocalImageComponent from '@/src/components/LocalImage';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import toast from 'react-hot-toast'
import slugify from 'slugify'
import { useDictContext } from '@/src/hooks/useDictContext';

interface Props {
  user: UserMosaicItem;
  showSocialInteraction?: boolean;
  className?:string;
  MosaicDetailed?:boolean
  // showButtonLabels?: boolean;
  // showShare?: boolean;
}
const getMediathequeSlug = (user:UserMosaicItem)=>{
  if(user){
    const s =`${user.name}`
    const slug = `${slugify(s,{lower:true})}-${user.id}` 
    return slug
  }
  return ''
}
const openUserMediatheque = (user:UserMosaicItem) => {

  router.push(`/mediatheque/${getMediathequeSlug(user)}`).then(() => window.scrollTo(0, 0));
};



const MosaicItem: FunctionComponent<Props> = ({ user, showSocialInteraction = false, className = '',MosaicDetailed = false }) => {
  const { t, dict } = useDictContext();
  const { id, name, countryOfOrigin /* image*/  , tags  } = user;
  const {data:session} = useSession();
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false);
  const [tagsToShow, setTagsToShow] = useState<string>('');
  const {notifier} = useNotificationContext();
  const queryClient = useQueryClient();
  

  useEffect(() => {
    if(user){
      const ifbm = (user && user.followedBy) ? user.followedBy.findIndex((i) => i.id === session?.user.id) !== -1 : false
      setIsFollowedByMe(ifbm)
    }
    if(tags){
      if(tags.split(',').length > 3 )
           setTagsToShow(tags.split(",").slice(0,3).join());
      else
            setTagsToShow(tags);
    }
   
  }, [user,tags]);

  const { mutate: mutateFollowing, isPending: isLoadingMutateFollowing } = useMutation<User>(
    {
      mutationFn:async () => {
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
          notificationContextURL:`/mediatheque/${session?.user.id}`,
          notificationToUsers:[id]
        }))
        
        const res = await fetch(`/api/user/${id}`, {
          method: 'PATCH',
          body:form,
        });
        if(res.ok){
          const json = await res.json();
          if(notifier)
            notifier.notify({
              toUsers:[+id],
              data:{message:notificationMessage}
            });
          toast.success( t(dict,'OK'));
          return json;
        }
        else{
          toast.error(res.statusText);
          return null;
        }
      },
      onMutate: async () => {
        await queryClient.cancelQueries({queryKey:['USER', id]});
        await queryClient.cancelQueries({queryKey:['USER', session?.user.id]});

        type UserFollow = User & { followedBy: User[]; following: User[] };
        const followingUser = queryClient.getQueryData<UserFollow>(['USER', id]);
        const followedByUser = queryClient.getQueryData<UserFollow>(['USER', session?.user.id]);
        setIsFollowedByMe(p=>!p)

        return { followingUser, followedByUser };
      },
      onError: (err, data, context: any) => {
        queryClient.setQueryData(['USER', id], context.followingUser);
        queryClient.setQueryData(['USER', session?.user.id], context.followedByUser);
      },

      onSettled: () => {
        queryClient.invalidateQueries({queryKey:['USER', id]});
        queryClient.invalidateQueries({queryKey:['USER', session?.user.id]});
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


  return <>
    {!MosaicDetailed ? <Card className={`${styles.container} ${className}`} onClick={() => openUserMediatheque(user)} data-cy={`mosaic-item-user-${user.id}`}>
      <Row className='d-flex flex-row'>
        <Col xs={3} md={3}>
          <section>
            <UserAvatar width={42} height={42} user={user} userId={user.id} showName={false} />
          </section>
          {/* <img src={image || '/assets/avatar.png'} alt="User Avatar" /> */}
        </Col>
        <Col xs={9} md={9}>
          <h6>{name || 'unknown'}</h6>
          {countryOfOrigin && (
            <em>
              <AiOutlineEnvironment /> {t(dict,`countries:${countryOfOrigin}`)}
            </em>
          )}
          {/* <TagsInput tags={tags || ''} readOnly label="" /> */}
        </Col>
      </Row>

      {/* {session && showSocialInteraction && (
        <Card.Footer className="text-muted">
          {user && <SocialInteraction showButtonLabels={false} showCounts={false} entity={user} />}
        </Card.Footer>
      )} */}
    </Card> : <Card className={`border border-2 mosaic`} data-cy={`mosaic-item-user-${user.id}`}>
        <div className='d-flex justify-content-end mt-2 me-2'>
         {session && session.user!.id == user.id && ((<OverlayTrigger
          key='right'
          placement='right'
          overlay={
            <Tooltip id={`tooltip-right`}>
             Edit Profile
            </Tooltip>
          }
        >
          <Button className='rounded rounded-5' size='sm'  onClick={()=>router.push('/profile')} style={{width:'2.7em',height:'2.8em'}}> <span className='fs-5 text-white'><AiOutlineUser className='text-white mb-1 me-1'/></span></Button>
        </OverlayTrigger>))}
          { session && session.user!.id !== user.id && !isFollowedByMe &&  (<OverlayTrigger
          key='right'
          placement='right'
          overlay={
            <Tooltip id={`tooltip-right`}>
             Follow
            </Tooltip>
          }
        >          
          <Button className='rounded rounded-5' size='sm' disabled={isLoadingMutateFollowing}  onClick={followHandler} style={{width:'2.8em',height:'2.8em'}} > <span className='fs-5 '><AiOutlineUserAdd className='text-white mb-1 me-1'/></span></Button>
        </OverlayTrigger>)}

         { session && session.user!.id !== user.id && isFollowedByMe && (<OverlayTrigger
          key='right'
          placement='right'
          overlay={
            <Tooltip id={`tooltip-right`}>
             Unfollow
            </Tooltip>
          }
        >
          <Button variant="button" className='border-primary text-primary rounded rounded-5 ' size='sm'  disabled={isLoadingMutateFollowing}  onClick={followHandler}  style={{width:'2.8em',height:'2.8em'}} > <span className='fs-5 mb-2'><AiOutlineUserDelete className=' mb-1 me-1'/></span></Button>
        </OverlayTrigger>)}
        
        </div>
        <div className='d-flex flex-row justify-content-center  px-3' >
           {(!user?.photos || !user?.photos.length) ?
               <img
                className={`rounded rounded-circle ${styles.avatar}`}
                src={user.image||''}
                alt={user.name||''}
               // style={{width:'110px',height:'110px'}}
              />:
           <LocalImageComponent  className={`rounded rounded-circle ${styles.avatar}`} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />}   
        </div>
        <div className='mt-1 d-flex flex-column justify-content-center align-items-center'>
          <h6 className='text-secondary cursor-pointer' onClick={() => openUserMediatheque(user)} >{name || 'unknown'}</h6>
          <TagsInput className='mt-0 px-4 text-center' tags={tagsToShow || ''} readOnly br={true} label="" />
        </div>
    </Card>}</>
  
};

export default MosaicItem;
