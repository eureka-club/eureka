// import {Session} from '@/src/types'
import React, { useState, useEffect } from 'react'
import { ListGroup, Button, } from 'react-bootstrap'

import { IoNotificationsCircleOutline } from 'react-icons/io5'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useMutation, useQueryClient } from 'react-query'
import { EditNotificationClientPayload, NotificationSumary } from '@/src/types/notification'
import { useAtom } from 'jotai'
import globalModals from '@/src/atoms/globalModals'
import styles from './NotificationsList.module.css';
import { getNotificationMessage } from '@/src/lib/utils'
import MosaicItem from '@/src/components/notification/MosaicItem'
import { UserDetail } from '../types/user'
import useNotifications from '../useNotifications'
interface Props {
  className?: string;
}

const NotificationsList: React.FC<Props> = ({ className }) => {

  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation('notification');
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModals)
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false)
  // const {data:user,isLoading} = useUser(userId || 0,{
  // enabled:!!userId
  // });
  useEffect(() => {
    if (session)
      setUserId(session.user.id);
  }, [session])

  const { data: notifications, isLoading } = useNotifications(userId, { enabled: !!userId })

  const [notVieweds, setNotVieweds] = useState<NotificationSumary[]>([])
  const [AllNotifications, setAllNotifications] = useState<NotificationSumary[]>([])

  useEffect(() => {
    if (notifications && notifications.length) {
      setNotVieweds(notifications?.filter(n => !n.viewed));
      setAllNotifications(notifications);
    }
  }, [notifications])

  const {
    mutate: execEditNotification,
    error: editNotificationError,
    isError,
    isLoading: isLoadingNotification,
    isSuccess,
  } = useMutation(
    async (payload: EditNotificationClientPayload) => {

      const res = await fetch(`/api/notification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'warning',
            title: t('common:Warning'),
            message: res.statusText
          }
        });
        return null;
      }
      return res.json();
    },
    {
      onMutate: async (vars) => {
        if (notVieweds) {
          const ck = ['USER', `${userId}`, 'NOTIFICATIONS'];
          queryClient.cancelQueries(ck)
          const ss = queryClient.getQueryData(ck);
          const idx = notVieweds.findIndex(n => n.notification.id == vars.notificationId)
          if (idx >= 0) {
            queryClient.setQueryData(ck, notVieweds.splice(idx, 1))
          }
          return { ck, ss };
        }
        return null;
      },
      onSettled: (_user, error, _variables, context) => {
        if (context) {
          interface ctx { ck: string[], ss: UserDetail }
          const { ck, ss } = context as ctx;
          if (error && ck) {
            queryClient.setQueryData(ck, ss);
          }
          if (context) queryClient.invalidateQueries(ck);
        }
      },
    },
  );

  const {
    mutate: execAllToVieweds,
    error: editExecAllToVieweds,
    isError: isErrorExecAllToVieweds,
    isLoading: isLoadingExecAllToVieweds,
    isSuccess: isSuccessExecAllToVieweds,
  } = useMutation(
    async () => {
      const res = await fetch(`/api/notification/check-all-vieweds?user=${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.json();
    },
    {
      onMutate: async (vars) => {
        const ck = ['USER', `${userId}`, 'NOTIFICATIONS'];
        const ss = queryClient.getQueryData(ck);
        return { ck, ss };
      },
      onSettled: (_user, error, _variables, context) => {
        if (context) {
          interface ctx { ck: string[], ss: UserDetail }
          const { ck, ss } = context as ctx;
          if (error && ck) {
            queryClient.setQueryData(ck, ss);
          }
          if (context) queryClient.invalidateQueries(ck);
        }
      },
    },
  );


  const notificationOnClick = (e: React.MouseEvent<Element>, userId: number, notificationId: number, contextURL: string) => {
    e.preventDefault();
    /*if (notificationId) {
       const payload = {
         notificationId,
         userId,
         data: {
           viewed: true,
         }
       }
       execEditNotification(payload);
     }*/
    router.push(contextURL);
  }

  const formatMessage = (message: string) => {
    return getNotificationMessage(message, (key, payload) => t(key, payload));
  }

  const viewAllNotificationsHandler = () => {
    if (notifications)
      router.push(`/notification`);
  };

  const checkAllToVieweds = () => {
    console.log(show, 'home')
    if (!show)
      execAllToVieweds()
    setShow(s => !s)
    console.log(show, 'final')

  };
  const notNewsNotifications = () => {
    return !notVieweds || !notVieweds.length;
  }

  const renderNotificationsList = () => {
    if (notVieweds) {

      if (AllNotifications.length) {
        return <ListGroup className='NotificationsList' as="ul">{AllNotifications.slice(0, 5).map((n, idx) => {
          return <ListGroup.Item
            key={`notification-${n.notification.id}`}
            as="li"
            className="d-flex justify-content-between align-items-start cursor-pointer"
            onClick={(e) => notificationOnClick(e, n.user.id, n.notification.id, n.notification.contextURL)}
          >
            <aside>
              <MosaicItem notification={n as NotificationSumary} />
            </aside>

          </ListGroup.Item>;
        })}
          <ListGroup.Item>
            <Button variant="link" className="text-primary" onClick={viewAllNotificationsHandler}>
              {t('viewAllNotifications')}
            </Button>
          </ListGroup.Item>
        </ListGroup>;
      }
    }
    return <></>;
  }
  return <section data-cy="notifications" className={`position-relative ${className}`}>
    {/* {!isLoading && notVieweds && <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose
      overlay={
        notVieweds.length ? <Popover id={`popover-positioned-bottom`} className="bg-primary">
          {renderNotificationsList()}
        </Popover> : <></>
      }
    > */}
    <Button
      variant="outline-light"
      className={`text-dark border-0 p-0 ${styles.langSwitch}`}
      //disabled={notNewsNotifications()}
      onClick={checkAllToVieweds} //poner accion aca , llamar a api para marcar todas vistas
    >
      <div>
        <aside className="position-relative d-none d-md-inline-block">
          <IoNotificationsCircleOutline className={`${styles.navbarIconNav} text-primary`} />
          {notVieweds.length && <span className="position-absolute mt-2 top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notVieweds.length}
            <span className="visually-hidden">unread messages</span>
          </span> || ''}
        </aside>


        <aside className="d-md-none position-relative me-3">
          <IoNotificationsCircleOutline className={`${styles.navbarIconNav} text-primary`} />
          {notVieweds.length && <span className="mt-2 position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notVieweds.length}
            <span className="visually-hidden">unread messages</span>
          </span> || ''}
        </aside>
        <span className={`d-none d-lg-block ${styles.menuBottomInfo}  ms-1`}>{t('navbar:Notifications')}</span>
      </div>
    </Button>
    {/* </OverlayTrigger>} */}

    {show && <div className="position-fixed botton-0 start-50">{renderNotificationsList()}</div>}

  </section>
}

export default NotificationsList;