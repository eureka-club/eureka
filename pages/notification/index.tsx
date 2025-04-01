import React from 'react'
import SimpleLayout from "@/src/components/layouts/SimpleLayout";
import { ListGroup, Spinner } from 'react-bootstrap';
import useNotifications from '@/src/useNotifications';
import { useSession } from 'next-auth/react';
import MosaicItemNotification from '@/src/components/notification/MosaicItem';

const Notifications: React.FC = () =>{
    const {data:session, status} = useSession();
    const isLoadingSession = status === "loading"
    
    const userId=session?.user.id!

    const {data} = useNotifications(userId,{
        enabled:!!userId,
        take:-1//get all
    });
    const{notifications,total}=data??{notifications:[],total:0};

    return <SimpleLayout>
        <>
            {isLoadingSession && <Spinner animation="grow" variant="info" />}
            {!isLoadingSession && <ListGroup>
                {notifications?.map((n)=><ListGroup.Item key={n.notification.id}><MosaicItemNotification notification={n} /></ListGroup.Item>)}
            </ListGroup>}
        </>
    </SimpleLayout>
}
export default Notifications;
