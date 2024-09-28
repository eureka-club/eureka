import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import {BsFillCircleFill} from 'react-icons/bs'
import { getNotificationMessage } from '@/src/lib/utils';
import { NotificationSumary } from '../../types/notification';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Stack, Typography } from '@mui/material';
import { Circle } from '@mui/icons-material';
import UserMosaicItem from "../user/MosaicItem";
import UserAvatar from '../common/UserAvatar';

dayjs.extend(relativeTime)

interface Props {
  notification: NotificationSumary;
  // className?:string;
}

const MosaicItem: FunctionComponent<Props> = ({ notification }) => {
  const { t } = useTranslation('notification');

  // const notificationOnClick = () => { 
  //   //router.push(notification.notification.contextURL).then(() => window.scrollTo(0, 0));
  // };

  const formatMessage = (message:string) => {
    return getNotificationMessage(message, (key,payload) => t(key,payload));
  }

  const dateInfo = () => {
    return dayjs().to(notification.notification.createdAt);//TODO integration with i18n
  }
return <Stack direction={'row'} gap={.5}>
          <UserAvatar size='small' userId={notification.notification.fromUser.id} />
          <Stack direction={'column'} gap={.25}>
            <Stack direction={'row'} alignItems={'center'} gap={.5}>
              <aside>
                <Typography>{formatMessage(notification.notification.message)}</Typography>
              </aside>
              <Circle sx={{
                fontSize:'.6rem',
                ...!notification.viewed 
                  ? {color:'var(--color-primary-raised)'}
                  : {color:'lightgray'}
              }}/>
            </Stack>
            <Typography>{dateInfo()}</Typography>
          </Stack>
      </Stack>
};

export default MosaicItem;
