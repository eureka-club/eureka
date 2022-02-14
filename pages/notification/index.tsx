import React, { useEffect, useState } from 'react'
import SimpleLayout from "@/src/components/layouts/SimpleLayout";
import { ListGroup, Spinner } from 'react-bootstrap';
import useNotifications from '@/src/useNotifications';
import { useSession } from 'next-auth/react';
import { Session } from '@/src/types';
import MosaicItemNotification from '@/src/components/notification/MosaicItem';

import {v4} from 'uuid'
const Notifications: React.FC = () =>{

    const {data:sd,status} = useSession();
    const [session, setSession] = useState<Session>(sd as Session);
    useEffect(()=>{
        if(sd)
        setSession(sd as Session)
    },[sd])

    
    const {data:notidications} = useNotifications(session?.user.id,{
        enabled:!!session?.user.id
    });

    return <SimpleLayout>
        <>
            {(status=='loading') && <Spinner animation="grow" variant="info" />}
            {!(status=='loading') && <ListGroup>
                {notidications?.map((n)=><ListGroup.Item key={v4()}><MosaicItemNotification notification={n} /></ListGroup.Item>)}
            </ListGroup>}
        </>
    </SimpleLayout>
}
export default Notifications;
