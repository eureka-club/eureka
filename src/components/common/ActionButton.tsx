import classNames from 'classnames';
import { Button, Dropdown } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { FunctionComponent, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { FiShare2 } from 'react-icons/fi';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import useTranslation from 'next-translate/useTranslation';
import { WEBAPP_URL } from '../../constants';
import { isWork, isCycle } from '../../types';
import styles from './ActionButton.module.css';

interface Props {
  level: any;
  levelName: string;
  parent?: any;
  currentActions: { [key: string]: boolean };
  showCounts?: boolean;
}

const ActionButton: FunctionComponent<Props> = ({ level, levelName, parent, currentActions, showCounts = false }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const actions = [
    { name: 'like', fill: AiFillHeart, outlined: AiOutlineHeart },
    { name: 'fav', fill: BsBookmarkFill, outlined: BsBookmark },
  ];
  const { mutate: execAction, isSuccess: isActionSuccess } = useMutation(async (params: { [key: string]: string }) => {
    await fetch(`/api/${levelName}/${level.id}/${params.actionName}/`, { method: params.method });
  });

  const handleClickAction = (ev: MouseEvent<HTMLButtonElement>, actionName: string) => {
    ev.preventDefault();
    const method = currentActions[actionName] ? 'DELETE' : 'POST';
    execAction({ method, actionName });
  };

  useEffect(() => {
    if (isActionSuccess) router.replace(router.asPath);
  }, [isActionSuccess]);

  let customShare = '';
  if (levelName === 'cycle') customShare = t('cycleShare');
  else if (levelName === 'work') customShare = t('workShare');
  else if (isWork(parent)) customShare = t('postWorkShare');
  else if (isCycle(parent)) customShare = t('postCycleShare');
  const title = levelName === 'post' ? parent.title : level.title;
  const shareText = `${customShare} "${title}" ${t('complementShare')}`;

  const urlShare = `${WEBAPP_URL}${router.asPath}`;

  return (
    <div className={styles['actions-container']}>
      {actions.map((action: { [key: string]: any }) => {
        const Icon = action[currentActions[action.name] ? 'fill' : 'outlined'];
        return (
          <span className={classNames(styles['actions-container'], styles[`action-${action.name}`])} key={action.name}>
            <Button
              variant="link-secondary"
              onClick={(ev: MouseEvent<HTMLButtonElement>) => handleClickAction(ev, action.name)}
              className={styles.actions}
            >
              <Icon />
            </Button>
            {showCounts && <span>{level[`${action.name}s`].length}</span>}
          </span>
        );
      })}
      {showCounts && (
        <Dropdown alignRight>
          <Dropdown.Toggle id="langSwitch" className={styles['toggle-share']}>
            <Button
              variant="outline-primary"
              onClick={(ev) => {
                ev.preventDefault();
              }}
            >
              <FiShare2 className={styles.actions} />
            </Button>
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles['icon-share']}>
            <Dropdown.Item>
              <TwitterShareButton url={urlShare} title={shareText} via="eurekamundus">
                <TwitterIcon size={32} round />
                {`${t('wayShare')} Twitter`}
              </TwitterShareButton>
            </Dropdown.Item>
            <Dropdown.Item>
              <FacebookShareButton url={urlShare} quote={shareText}>
                <FacebookIcon size={32} round />
                {`${t('wayShare')} Facebook`}
              </FacebookShareButton>
            </Dropdown.Item>
            <Dropdown.Item>
              <WhatsappShareButton url={urlShare} title={`${shareText} ${t('whatsappComplement')}`}>
                <WhatsappIcon size={32} round />
                {`${t('wayShare')} Whatsapp`}
              </WhatsappShareButton>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default ActionButton;
