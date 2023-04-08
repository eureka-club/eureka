import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import {BsFillCircleFill} from 'react-icons/bs'
import router from 'next/router';

import { getNotificationMessage } from '@/src/lib/utils';
import { NotificationMosaicItem } from '../../types/notification';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  notification: NotificationMosaicItem;
  className?:string;
}

const MosaicItem: FunctionComponent<Props> = ({ notification, className = '' }) => {
  const { t } = useTranslation('notification');

  const notificationOnClick = () => { 
    //router.push(notification.notification.contextURL).then(() => window.scrollTo(0, 0));
  };

  const formatMessage = (message:string) => {
    return getNotificationMessage(message, (key,payload) => t(key,payload));
  }

  const dateInfo = () => {
    return dayjs().to(notification.notification.createdAt);//TODO integration with i18n
  }

  return (
    <section className={`${className} cursor-pointer d-flex justify-content-between p-1 mb-3`} onClick={notificationOnClick}>
      {notification && <>
      <aside>
        <p>{formatMessage(notification.notification.message)}</p>
        <em className="text-muted">
          {dateInfo()}
        </em>  
      </aside>
        <aside className="">
          <BsFillCircleFill className="text-primary" />
        </aside>
      </>}
    </section>
  );
};

export default MosaicItem;
