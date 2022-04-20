import React, { useEffect, useState } from 'react'
import SimpleLayout from "@/src/components/layouts/SimpleLayout";
import { ListGroup, Spinner } from 'react-bootstrap';
import useNotifications from '@/src/useNotifications';
import { useSession } from 'next-auth/react';
// import { Session } from '@/src/types';
import MosaicItemNotification from '@/src/components/notification/MosaicItem';

import {v4} from 'uuid'
const Notifications: React.FC = () =>{
    const {data:session, status} = useSession();
    const isLoadingSession = status === "loading"
    const [userId,setUserId] = useState<number>(0);
    
    useEffect(()=>{
        if(session){
            const u = session.user;
            setUserId(u.id);
        }
    },[session]);

    const {data:notidications} = useNotifications(userId,{
        enabled:!!userId
    });

    return <SimpleLayout>
        <>
            {isLoadingSession && <Spinner animation="grow" variant="info" />}
            {!isLoadingSession && <ListGroup>
                {notidications?.map((n)=><ListGroup.Item key={v4()}><MosaicItemNotification notification={n} /></ListGroup.Item>)}
            </ListGroup>}
        </>
    </SimpleLayout>
}
export default Notifications;
