import { FunctionComponent, SyntheticEvent,MouseEvent, useState, useEffect} from 'react';
import useUser from '@/src/useUser'
import { useRouter } from 'next/router';
import styles from './UserAvatar.module.css';
import LocalImageComponent from '@/src/components/LocalImage'
import { UserSumary } from '@/src/types/user';
import slugify from 'slugify'
import useUserSumary from '@/src/useUserSumary';
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
debugger;
  const renderUserName = () => {
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
  const onClick = (e:MouseEvent<HTMLAnchorElement>,user:UserSumary)=>{
    e.stopPropagation()
    router.push(`/mediatheque/${getMediathequeSlug(user)}`)
  }
  return (
    <>
      {user && (
        <section className={`fs-6 ${styles[size]} cursor-pointer ${className}`}>
            <a onClick={(e)=>onClick(e,user)} className={`text-secondary ${styles.link} d-flex align-items-center`}>

                {(!user?.photos || !user?.photos.length) ?
                <img
                onError={onLoadImgError}
                className={`${styles.cycleCreatorAvatar}`}
                src={user.image || '/img/default-avatar.png'}
                alt={user.name||''}
              /> : <LocalImageComponent className={`rounded rounded-circle`} width={width} height={height} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />}
                 {renderUserName()}
            </a>
        </section>
      )}
    </>
  );
};

export default UserAvatar;
