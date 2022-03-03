import {Session} from '@/src/types'
import React, {useState, useEffect} from 'react'
import {ListGroup, Spinner, Button, OverlayTrigger, Popover} from 'react-bootstrap'

import {IoNotificationsCircleOutline} from 'react-icons/io5'
import {v4} from 'uuid'
import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import useUser from '@/src/useUser'
import {useMutation, useQueryClient} from 'react-query'
import {EditNotificationClientPayload} from '@/src/types/notification'
import {useAtom} from 'jotai'
import globalModals from '@/src/atoms/globalModals'
import styles from './Navbar.module.css';
import {getNotificationMessage} from '@/src/lib/utils'
import NotificationMosaicItem from '@/src/components/notification/MosaicItem'
interface Props {
    className?: string;
}

const NotificationsList: React.FC<Props> = ({className}) => {
    
    const [session] = useSession() as [Session | null | undefined, boolean];
    const router = useRouter();
    const { t } = useTranslation('notification');
    const [globalModalsState,setGlobalModalsState] = useAtom(globalModals)
    const queryClient = useQueryClient();

    const [userId,setUserId] = useState<number>();
    const {data:user,isLoading} = useUser(userId || 0,{
    enabled:!!userId
    });

    
    useEffect(()=>{
    if(session)
        setUserId(session.user.id);
    },[session])

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
          if(!res.ok){
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
          onMutate: async () => {
              if(user){
                const cacheKey = ['USER',user.id.toString()];
                const snapshot = queryClient.getQueryData(cacheKey);
                return { cacheKey, snapshot };        
              }
              return null;
          },
          onSettled: (_user, error, _variables, context) => {
            if (context) {
              const { cacheKey, snapshot } = context;
              if (error && cacheKey) {
                queryClient.setQueryData(cacheKey, snapshot);
              }
              if (context) queryClient.invalidateQueries(cacheKey);
            }
          },
        },
      );
    
    if(!user || !user.notifications)
      return <></>    
    const notificationOnClick = (e: React.MouseEvent<Element>,userId:number, notificationId:number, contextURL:string) => {
        e.preventDefault();
        if(user){
            const payload = {
                notificationId,
                userId,
                data:{
                    viewed: true,
                }
            }
            execEditNotification(payload);
        }
        //router.push(contextURL);
    }  

    const formatMessage = (message:string) => {
      return getNotificationMessage(message, (key,payload) => t(key,payload));
    }

    const viewAllNotificationsHandler = () => {
      if(user)
        router.push(`/notification`);
    };

    const notNewsNotifications = ()=>{
      return !user || !user.notifications.length;
    }

    const renderNotificationsList = ()=> {
        if(user){
          
          if(user.notifications.length){
            return <ListGroup as="ul">{user.notifications.slice(0,5).map((n)=>{
              return <ListGroup.Item
              key={v4()}
              as="li"
              className="d-flex justify-content-between align-items-start cursor-pointer"
              onClick={(e)=>notificationOnClick(e,n.userId,n.notificationId,n.notification.contextURL)}
            >
              <aside>
                <NotificationMosaicItem notification={n} />                
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
    return <section data-cy="notifications" className={`${className}`}>
        {/*isLoading && <Spinner animation="grow" variant="info" />*/}
        {!isLoading && user && <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose
      overlay={
        user.notifications.length ? <Popover id={`popover-positioned-bottom`} className="bg-primary">
          {/* <Popover.Header as="h3">{`Popover ${t('navbar:Notifications')}`}</Popover.Header> */}
          {/* <Popover.Body> */}
          {renderNotificationsList()}
          {/* </Popover.Body> */}
        </Popover> : <></>
      }
    >
      <Button variant="outline-light" className="text-dark border-0 " disabled={notNewsNotifications()}>
              <aside className="position-relative d-none d-md-inline-block">
                <IoNotificationsCircleOutline className={`${styles.navbarIconNav} ${notNewsNotifications() ? 'text-dark':'text-primary'}`}  />
                {user.notifications.length && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {user.notifications.length}
                  <span className="visually-hidden">unread messages</span>
                </span> || ''}
              </aside>
              <aside className="d-md-none position-relative">
                <IoNotificationsCircleOutline className={`${styles.navbarIconNav} ${notNewsNotifications() ? 'text-dark':'text-primary'}`} />
                {user.notifications.length && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {user.notifications.length}
                  <span className="visually-hidden">unread messages</span>
                </span>||''}
              </aside>
              <span className={`d-none d-lg-block ${styles.menuBottomInfo}`} style={{marginTop:'6px'}}>{t('navbar:Notifications')}</span>
    
                    </Button>
    </OverlayTrigger>}
          
        
    </section>
}

export default NotificationsList;