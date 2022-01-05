import { FunctionComponent, SyntheticEvent, useState, useEffect } from 'react';
import {Session} from '@/src/types'
import Pusher from 'pusher-js'
interface Props {
  session: Session;
  callback: (data:Record<string,any>)=>void;
}

const Notification: FunctionComponent<Props> = ({
  session,
  callback
}) => {
  useEffect(()=>{
    Pusher.logToConsole = true;
    
    var pusher = new Pusher('5093c051cfd50ada97e5', {
      cluster: 'sa1'
    });debugger;

    var channel = pusher.subscribe(`my-channel-${session.user.id}`);
    channel.bind('my-event', function(data: Record<string, any>) {
      alert(JSON.stringify(data));
      callback(data);
    });
  },[]);
  return <></>
};

export default Notification;
