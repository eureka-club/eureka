import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
import { GiBrain } from 'react-icons/gi';
import { BsBookmark, BsBookmarkFill, BsEye, BsEyeFill } from 'react-icons/bs';
import classnames from 'classnames';
import { FiShare2, FiStar, FiTrash2 } from 'react-icons/fi';
import { IoMdStarOutline, IoMdStar, IoMdStarHalf } from 'react-icons/io';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';
import { useAtom } from 'jotai';
import Rating from 'react-rating';
import { Container, Row, Col, OverlayTrigger, Popover, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Cycle, User, Work, Post } from '@prisma/client';

import { useUsers } from '../../useUsers';
import globalModalsAtom from '../../atoms/globalModals';
// import Notification from '../ui/Notification';

import { WEBAPP_URL } from '../../constants';
import { CycleDetail } from '../../types/cycle';
import { PostDetail } from '../../types/post';
import { WorkDetail } from '../../types/work';
import { MySocialInfo, isCycle, isWork, Session, isPost } from '../../types';
import styles from './UserAvatar.module.css';


interface Props {
  user: User;
  size?: 'sm' | 'xs';
}

const UserAvatar: FunctionComponent<Props> = ({ user, size = 'sm' }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];

  return (
    <>
      {user && (
        <div className={`${styles.cycleCreator} ${styles[size]}`}>
          <Link href={`/mediatheque/${user.id}`}>
            <a>
              <img
                src={user.image || '/img/default-avatar.png'}
                alt="creator avatar"
                className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
              />
              {user.name}
            </a>
          </Link>
        </div>
      )}
    </>
  );
};

export default UserAvatar;
