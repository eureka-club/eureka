import { FunctionComponent, SyntheticEvent,useEffect} from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { Spinner } from 'react-bootstrap';
//import { UserWhitPhoto } from '@/src/types/user';
import useUser from '@/src/useUser'

import styles from './UserAvatar.module.css';
import LocalImageComponent from '@/src/components/LocalImage'
interface Props {
  userId: number;
  showName?: boolean;
  showFullName?: boolean;
  size?: 'md' | 'sm' | 'xs';
  className?: string;
}

const UserAvatar: FunctionComponent<Props> = ({
  userId,
  size = 'md',
  showName = true,
  className = '',
  showFullName = false,
}) => {

  const onLoadImgError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };
 const {data:user} = useUser(userId,{
    enabled:!!userId
  })
   

  const renderUserName = () => {
    let res = '';
    if (showName) {
      const truncateName = user?.name?.slice(0, 16);
      if (showFullName) {
        res = user?.name!;
      } else if (truncateName!.length + 3 < user?.name?.length!) {
        res = `${truncateName}...`;
      } else res = `${user?.name}`;
    }
    return <span>{res}</span>;
  };
  return (
    <>
      {user && (
        <span className={`fs-6 ${styles.cycleCreator} ${className} ${styles[size]}`}>
          <Link href={`/mediatheque/${user.id}`}>
            <a className={`text-secondary ${styles.link}`}>

                {(!user?.photos || !user?.photos.length) ?
         <img
        onError={onLoadImgError}
        className={`${styles.cycleCreatorAvatar} me-2`}
        src={user.image || '/img/default-avatar.png'}
        alt={user.name||''}
      /> : <LocalImageComponent className={`${styles.cycleCreatorAvatar} me-2`} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />}
              {renderUserName()}
            </a>
          </Link>
        </span>
      )}
    </>
  );
};

export default UserAvatar;
