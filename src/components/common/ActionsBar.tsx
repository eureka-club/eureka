import React, {MouseEvent, useEffect,useState} from 'react'
import {Button, Spinner} from 'react-bootstrap'
import { BiTrash, BiEdit } from 'react-icons/bi';
import {useSession} from 'next-auth/react'
import { User } from '@prisma/client';
import { Session } from '@/src/types';

interface Props{
    creatorId:string;
    actions:{
        edit: (e:MouseEvent<HTMLButtonElement>) => Promise<void>;
        // remove: (e:MouseEvent<HTMLButtonElement>) => Promise<void>;
    }
}
const ActionsBar:React.FC<Props> = ({actions,creatorId}) =>{
    const {data:sd,status} = useSession();
    const [session, setSession] = useState<Session>(sd as Session);
    useEffect(()=>{
        if(sd)
        setSession(sd as Session)
    },[sd])
    
    if((status=='loading'))
        return <Spinner animation='grow' size='sm' />
    
    if(session && session.user.id == creatorId)
        return <aside data-cy="actions-bar" className="ms-auto">
                <Button className="m-0 p-0 text-danger" size="sm" variant="link" onClick={actions.edit}>
                    <BiEdit />
                </Button>
                {/* <Button className="m-0 p-0 text-danger" variant="link" onClick={actions.remove}>
                    <BiTrash />
                </Button> */}
            </aside>
    return <></>
}
export default ActionsBar;