import { FunctionComponent, SyntheticEvent,MouseEvent, FC } from 'react';
import { useRouter } from 'next/router';
import styles from './UserAvatar.module.css';
import slugify from 'slugify'
// import useUserSumary from '@/src/useUserSumary';
// import { UserSumary } from '@/src/types/UserSumary';
import { Avatar, Box, BoxProps, RatingProps } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { AZURE_STORAGE_URL } from '@/src/constants';
import { Size } from '@/src/types';
import { LocalImage } from '@prisma/client';
interface Props extends BoxProps {
  userId: string|number;
  name:string;
  image?:string;
  photos?:LocalImage[];
  // showName?: boolean;
  // showFullName?: boolean;
  size?: Size;
  // className?: string;
}

const getMediathequeSlug = (name:string,id:string|number)=>{
  if(name){
    const s =`${name}`
    const slug = `${slugify(s,{lower:true})}-${id}` 
    return slug
  }
  return ''
}

// interface UserNameProps{
//   name:string;
//   showFullName:boolean;
// }
// const UserName:FunctionComponent<UserNameProps> = ({name,showFullName}) => {
//   let res = '';
//   if(name){
//     const truncateName = name?.slice(0,9);
//     if (showFullName) {
//       res = name!;
//     } else if (truncateName && truncateName!.length + 3 < name?.length!) {
//       res = `${truncateName}...`;
//     } else res = `${name}`;
//   }
//   return <span className='ms-2'>{res}</span>
// };

const UserAvatar: FunctionComponent<Props> = ({
  name,
  userId,
  image,
  photos,
  size = 'medium',
  ...others
}) => {
  const router = useRouter();
  let width='3rem';
  
  switch(size){
    case 'small': width='2rem'; break;
    case 'large': width='4rem'; break;
  }

  const onLoadImgError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };
  
  const onClick = (e:MouseEvent<HTMLAnchorElement>,name:string,userId:string|number)=>{
    e.stopPropagation()
    router.push(`/mediatheque/${getMediathequeSlug(name,userId)}`)
  }
  const photo = photos?.length ? photos[0].storedFile : null;
  return (
    <>
      {(name&&userId) && (
        <Box className={`${styles[size]} cursor-pointer`} {...others}>
            <a onClick={(e)=>onClick(e,name,userId)} className={`text-secondary ${styles.link} d-flex align-items-center`}>
              <Avatar 
                  sx={{width,height:width,bgcolor:'var(--color-primary)'}} 
                  alt={name!}
                  src={
                      photo
                        ? `${AZURE_STORAGE_URL}/users-photos/${photo}`
                        : image!
                  }>
                  <AccountCircle sx={{width,height:width}}/>
              </Avatar>
              {/* {
                showName 
                  ?  <UserName name={name} showFullName={showFullName}/>
                  : <></>

              } */}
            </a>
        </Box>
      )}
    </>
  );
};

export default UserAvatar;
