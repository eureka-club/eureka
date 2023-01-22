import { FunctionComponent, useEffect } from 'react';
import {io} from 'socket.io-client'
interface Props {
  id: string;
  callback: (data:Record<string,any>)=>void;
}

const Notification: FunctionComponent<Props> = ({
  id,
  callback
}) => {
  useEffect(()=>{
    // console.log(WEBAPP_URL)
    const socket = io("http://localhost:4000/",{
      // withCredentials: true,
      extraHeaders: {
      "session-id": id
      }
    });

    socket.on('connection',(data)=>{
    });

    

    // socket.on(`notify-${session.user.id}`, (data) => {
    //   alert(JSON.stringify(data));
    //   callback(data);
    // });

    
  },[]);
  return <></>
};

export default Notification;
