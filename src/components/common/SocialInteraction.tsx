import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';
import { useMutation } from 'react-query';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';

import { WEBAPP_URL } from '../../constants';
import { CycleDetail } from '../../types/cycle';
import { PostDetail } from '../../types/post';
import { WorkDetail } from '../../types/work';
import { MySocialInfo, isCycle, isWork } from '../../types';
import styles from './SocialInteraction.module.css';

interface SocialInteractionClientPayload {
  socialInteraction: 'fav' | 'like';
  doCreate: boolean;
}

interface Props {
  entity: CycleDetail | PostDetail | WorkDetail;
  parent?: CycleDetail | WorkDetail | null;
  mySocialInfo: MySocialInfo;
  showCounts?: boolean;
}

const SocialInteraction: FunctionComponent<Props> = ({ entity, parent, mySocialInfo, showCounts = false }) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const shareUrl = `${WEBAPP_URL}${router.asPath}`;
  const shareTextDynamicPart = (() => {
    if (parent != null && isCycle(parent)) {
      return t('postCycleShare');
    }
    if (parent != null && isWork(parent)) {
      return t('postWorkShare');
    }
    if (isCycle(entity)) {
      return t('cycleShare');
    }
    if (isWork(entity)) {
      return t('workShare');
    }

    throw new Error('Invalid entity or parent');
  })();
  const shareText = `${shareTextDynamicPart} "${entity.title}" ${t('complementShare')}`;

  const { mutate: execSocialInteraction, isSuccess: isSocialInteractionSuccess } = useMutation(
    async ({ socialInteraction, doCreate }: SocialInteractionClientPayload) => {
      const entityEndpoint = (() => {
        if (parent != null) {
          return 'post';
        }
        if (isCycle(entity)) {
          return 'cycle';
        }
        if (isWork(entity)) {
          return 'work';
        }

        throw new Error('Unknown entity');
      })();

      return fetch(`/api/${entityEndpoint}/${entity.id}/${socialInteraction}`, {
        method: doCreate ? 'POST' : 'DELETE',
      });
    },
  );

  const handleFavClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'fav', doCreate: !mySocialInfo.favoritedByMe });
  };

  const handleLikeClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execSocialInteraction({ socialInteraction: 'like', doCreate: !mySocialInfo.likedByMe });
  };

  useEffect(() => {
    if (isSocialInteractionSuccess) {
      router.replace(router.asPath); // refresh page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocialInteractionSuccess]);

  return (
    <div className={styles.container}>
      <button className={styles.socialBtn} onClick={handleFavClick} type="button">
        {mySocialInfo.favoritedByMe ? <BsBookmarkFill /> : <BsBookmark />}
        {showCounts && entity.favs.length}
      </button>

      <button className={styles.socialBtn} onClick={handleLikeClick} type="button">
        {mySocialInfo.likedByMe ? <AiFillHeart /> : <AiOutlineHeart />}
        {showCounts && entity.likes.length}
      </button>

      <Dropdown>
        <Dropdown.Toggle id="langSwitch" className={styles['toggle-share']}>
          <FiShare2 className={styles.actions} />
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles['icon-share']}>
          <Dropdown.Item>
            <TwitterShareButton url={shareUrl} title={shareText} via="eurekamundus">
              <TwitterIcon size={32} round />
              {`${t('wayShare')} Twitter`}
            </TwitterShareButton>
          </Dropdown.Item>
          <Dropdown.Item>
            <FacebookShareButton url={shareUrl} quote={shareText}>
              <FacebookIcon size={32} round />
              {`${t('wayShare')} Facebook`}
            </FacebookShareButton>
          </Dropdown.Item>
          <Dropdown.Item>
            <WhatsappShareButton url={shareUrl} title={`${shareText} ${t('whatsappComplement')}`}>
              <WhatsappIcon size={32} round />
              {`${t('wayShare')} Whatsapp`}
            </WhatsappShareButton>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default SocialInteraction;
