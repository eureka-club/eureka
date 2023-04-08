import React, {MouseEvent, useEffect,useState} from 'react'
import {Button, Spinner} from 'react-bootstrap'
import { BiTrash, BiEdit } from 'react-icons/bi';
import {useSession} from 'next-auth/react'
import { User } from '@prisma/client';

interface Props{
    creatorId:number;
    actions:{
        edit: (e:MouseEvent<HTMLButtonElement>) => Promise<void>;
        editOnSmallScreen: (e:MouseEvent<HTMLButtonElement>) => Promise<void>;
    }
}
const ActionsBar:React.FC<Props> = ({actions,creatorId}) =>{
    const {data:session,status} = useSession();
    const isLoading = status == 'loading'
    
    if(session && session.user.id == creatorId)
        return <aside data-cy="actions-bar" className="ms-auto">
                <Button className="d-none d-md-block m-0 p-0 text-warning" size="sm" variant="link" onClick={actions.edit}>
                    <BiEdit />
                </Button>
                <Button className="d-block d-md-none m-0 p-0 text-warning" variant="link" onClick={actions.editOnSmallScreen}>
                    <BiEdit />
                </Button>
            </aside>
    if(isLoading)
        return <Spinner animation='grow' size='sm' />
    return <></>
}
export default ActionsBar;