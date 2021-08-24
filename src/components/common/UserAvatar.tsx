import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { useSession } from 'next-auth/client';
import Link from 'next/link';

import { User } from '@prisma/client';
import { Session } from '../../types';
import styles from './UserAvatar.module.css';

interface Props {
  user: User;
  size?: 'sm' | 'xs';
}

const UserAvatar: FunctionComponent<Props> = ({ user, size = 'sm' }) => {
  // const { t } = useTranslation('common');
  // const router = useRouter();
  // const [session] = useSession() as [Session | null | undefined, boolean];

  return (
    <>
      {user && (
        <span className={`${styles.cycleCreator} ${styles[size]}`}>
          <Link href={`/mediatheque/${user.id}`}>
            <a>
              <img
                src={user.image || '/img/default-avatar.png'}
                alt="creator avatar"
                className={`${styles.cycleCreatorAvatar} mr-2`}
              />
              {user.name}
            </a>
          </Link>
        </span>
      )}
    </>
  );
};

export default UserAvatar;
