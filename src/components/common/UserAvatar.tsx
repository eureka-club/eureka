import { FunctionComponent, SyntheticEvent } from 'react';

import Link from 'next/link';
import { Spinner } from 'react-bootstrap';
import { User } from '@prisma/client';
// import { Session } from '../../types';
import styles from './UserAvatar.module.css';
import { useUsers } from '../../useUsers';

interface Props {
  user: { id: number | null; name: string | null; image: string | null };
  showName?: boolean;
  size?: 'md' | 'sm' | 'xs';
  className?: string;
}

const UserAvatar: FunctionComponent<Props> = ({ user, size = 'md', showName = true, className = '' }) => {
  const onLoadImgError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };

  return (
    <>
      {/* {isLoading && <Spinner size="sm" animation="grow" variant="secondary" />} */}
      {user && (
        <span className={`${className} ${styles.cycleCreator} ${styles[size]}`}>
          <Link href={`/mediatheque/${user.id}`}>
            <a>
              <img
                onError={onLoadImgError}
                src={user.image || '/img/default-avatar.png'}
                alt="creator avatar"
                className={`${styles.cycleCreatorAvatar} mr-2`}
              />
              {showName && user.name}
            </a>
          </Link>
        </span>
      )}
    </>
  );
};

export default UserAvatar;
