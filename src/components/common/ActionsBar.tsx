import React, {MouseEvent, useEffect,useState} from 'react'
import {Button, Spinner} from 'react-bootstrap'
import { BiTrash, BiEdit } from 'react-icons/bi';
import {useSession} from 'next-auth/client'
import { User } from '@prisma/client';
import { Session } from '@/src/types';

interface Props{
    creatorId:number;
    actions:{
        edit: (e:MouseEvent<HTMLButtonElement>) => Promise<void>;
        // remove: (e:MouseEvent<HTMLButtonElement>) => Promise<void>;
    }
}
const ActionsBar:React.FC<Props> = ({actions,creatorId}) =>{
    const [session,isLoading] = useSession();
    const [user,setUser] = useState<User>();
    useEffect(()=>{
        if(session){
            setUser((session as unknown as Session).user);
        }
    },[session])
    if(user && user.id == creatorId)
        return <aside data-cy="actions-bar" className="ms-auto">
                <Button className="m-0 p-0 text-warning" size="sm" variant="link" onClick={actions.edit}>
                    <BiEdit />
                </Button>
                {/* <Button className="m-0 p-0 text-danger" variant="link" onClick={actions.remove}>
                    <BiTrash />
                </Button> */}
            </aside>
    if(isLoading)
        return <Spinner animation='grow' size='sm' />
    return <></>
}
export default ActionsBar;