import { FunctionComponent, SyntheticEvent, useState } from 'react';

import Link from 'next/link';
import { Spinner } from 'react-bootstrap';
import { User } from '@prisma/client';
// import { Session } from '../../types';
import styles from './UserAvatar.module.css';
import { useUsers } from '../../useUsers';

interface Props {
  user: { id: number | null; name: string | null; image: string | null };
  showName?: boolean;
  showFullName?: boolean;
  size?: 'md' | 'sm' | 'xs';
  className?: string;
}

const UserAvatar: FunctionComponent<Props> = ({
  user,
  size = 'md',
  showName = true,
  className = '',
  showFullName = false,
}) => {
  const onLoadImgError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };
  const [truncateName] = useState(user.name?.slice(0, 16));

  const renderUserName = () => {
    let res = '';
    if (showName) {
      if (showFullName) {
        res = user.name!;
      } else if (truncateName!.length < user.name!.length - 3) {
        res = `${truncateName}...`;
      } else res = `${truncateName}`;
    }
    return <span>{res}</span>;
  };
  return (
    <>
      {/* {isLoading && <Spinner size="sm" animation="grow" variant="info" />} */}
      {user && (
        <span className={`fs-6 ${className} ${styles.cycleCreator} ${styles[size]}`}>
          <Link href={`/mediatheque/${user.id}`}>
            <a className={`text-secondary ${styles.link}`}>
              <img
                onError={onLoadImgError}
                src={user.image || '/img/default-avatar.png'}
                alt="creator avatar"
                className={`${styles.cycleCreatorAvatar} mr-2`}
              />
              {renderUserName()}
            </a>
          </Link>
        </span>
      )}
    </>
  );
};

export default UserAvatar;
