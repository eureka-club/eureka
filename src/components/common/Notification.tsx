import { FunctionComponent, SyntheticEvent, useState, useEffect } from 'react';
import {Session} from '@/src/types'
import {io} from 'socket.io-client'
import {WEBAPP_URL} from '@/src/constants'
interface Props {
  session: Session;
  callback: (data:Record<string,any>)=>void;
}

const Notification: FunctionComponent<Props> = ({
  session,
  callback
}) => {
  useEffect(()=>{
    debugger;
    // console.log(WEBAPP_URL)
    const socket = io("http://localhost:4000/",{
      // withCredentials: true,
      extraHeaders: {
      "session-id": session.user.id.toString()
      }
    });

    socket.on('connection',(data)=>{
      console.log(data);
    });

    

    // socket.on(`notify-${session.user.id}`, (data) => {
    //   alert(JSON.stringify(data));
    //   callback(data);
    // });

    
  },[]);
  return <></>
};

export default Notification;
