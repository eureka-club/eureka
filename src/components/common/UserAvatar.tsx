import { FunctionComponent, SyntheticEvent,MouseEvent, FC } from 'react';
import { useRouter } from 'next/router';
import styles from './UserAvatar.module.css';
import slugify from 'slugify'
import useUserSumary from '@/src/useUserSumary';
import { UserSumary } from '@/src/types/UserSumary';
import { Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { AZURE_STORAGE_URL } from '@/src/constants';
interface Props {
  user?:UserSumary;
  userId?: number;
  showName?: boolean;
  showFullName?: boolean;
  size?: 'md' | 'sm' | 'xs' | 'xl';
  className?: string;
  width:number;
  height:number;
}

const getMediathequeSlug = (user:UserSumary)=>{
  if(user){
    const s =`${user.name}`
    const slug = `${slugify(s,{lower:true})}-${user.id}` 
    return slug
  }
  return ''
}

interface UserNameProps{
  user:any;
  showName:boolean;
  showFullName:boolean;
}
const UserName:FunctionComponent<UserNameProps> = ({user,showName,showFullName}) => {
  let res = '';
  if (showName) {
    if(user){
      const truncateName = user?.name?.slice(0,9);
      if (showFullName) {
        res = user?.name!;
      } else if (truncateName && truncateName!.length + 3 < user?.name?.length!) {
        res = `${truncateName}...`;
      } else res = `${user?.name}`;
    }
  }
  return <span className='ms-2'>{res}</span>
};

const UserAvatar: FunctionComponent<Props> = ({
  user:userItem,
  userId,
  size = 'md',
  showName = true,
  className = '',
  showFullName = false,
  width,
  height,
}) => {
  const router = useRouter()
  const onLoadImgError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };
  const {data} = useUserSumary(userId!,{
    enabled:!!userId && !userItem
  });
  const user = userItem??data;
  
  const onClick = (e:MouseEvent<HTMLAnchorElement>,user:UserSumary)=>{
    e.stopPropagation()
    router.push(`/mediatheque/${getMediathequeSlug(user)}`)
  }
  return (
    <>
      {user && (
        
        <section className={`${styles[size]} cursor-pointer ${className}`}>
            <a onClick={(e)=>onClick(e,user)} className={`text-secondary ${styles.link} d-flex align-items-center`}>
              <Avatar 
                  sx={{width,height,bgcolor:'var(--color-primary)'}} 
                  alt={user.name!}
                  src={
                      user.photos.length 
                        ? `${AZURE_STORAGE_URL}/users-photos/${user.photos[0].storedFile}`
                        : user.image!
                  }>
                  <AccountCircle sx={{width,height}}/>
              </Avatar>
              <UserName user={user} showName={showName} showFullName={showFullName}/>
            </a>
        </section>
      )}
    </>
  );
};

export default UserAvatar;
