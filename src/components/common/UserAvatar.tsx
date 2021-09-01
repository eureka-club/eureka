import { FunctionComponent } from 'react';

import Link from 'next/link';
import { Spinner } from 'react-bootstrap';
// import { User } from '@prisma/client';
// import { Session } from '../../types';
import styles from './UserAvatar.module.css';
import { useUsers } from '../../useUsers';

interface Props {
  userId: number;
  showName?: boolean;
  size?: 'sm' | 'xs';
}

const UserAvatar: FunctionComponent<Props> = ({ userId, size = 'sm', showName = true }) => {
  // const { t } = useTranslation('common');
  // const router = useRouter();
  // const [session] = useSession() as [Session | null | undefined, boolean];

  const { data: user, isLoading } = useUsers(`${userId}`);
  return (
    <>
      {isLoading && <Spinner size="sm" animation="grow" variant="secondary" />}
      {!isLoading && user && (
        <span className={`${styles.cycleCreator} ${styles[size]}`}>
          <Link href={`/mediatheque/${userId}`}>
            <a>
              <img
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
