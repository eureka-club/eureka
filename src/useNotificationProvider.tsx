import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import Notifier from '@/src/lib/Notifier'

import {User} from '@prisma/client';
import { Session } from '@/src/types';
import { NotifierRequest } from '@/src/types';
import { NotifierResponse } from '@/src/types';
import { useSession } from 'next-auth/client';
// import { useGlobalEventsContext } from './useGlobalEventsContext';
// useEffect(()=>{
//   setSocketIO(new SocketIO([+id],(data)=>{
//     console.log('ver',data.message);
//     // alert(data.message)
//     setGlobalModals((res)=>({
//       ...res,
//       showToast: {
//         show: true,
//         type: 'info',
//         title: t(`common:Notification`),
//         message: data.message,
//       }
//     }))
//   }))
// },[id]);

export type ContextType = {
  notifier?: Notifier;
  
  // setCallback: Dispatch<SetStateAction<((res: NotifierResponse) => void) | undefined>>;
};


/* const getSocketIO = (callback: (res: NotifierResponse ) => void): void => {
  // const si = new SocketIO()
  // return new SocketIO(toUsers,(data)=>{
  //   console.log('ver',data.message);
  //   callback(data);
  // },fromUser);
  console.log('showing -> fromUser', fromUser);
}
 */
const NotificationContext = createContext<ContextType>({
  // setCallback: (res => {
  //   return ()=>{console.log('dummy notifier callback -> ',res)};
  // }),
  notifier: undefined
});

const useNotificationContext = (): ContextType => useContext(NotificationContext);

interface Props {
  children: JSX.Element;
}

const NotificationProvider: React.FC<Props> = ({children}) => {
  const [session] = useSession();
  const [user, setUser] = useState<User>();
  const [notifier, setNotifier] = useState<Notifier>();
  const [callback, setCallback] = useState<(res: NotifierResponse) => void>();
  // const gec = useGlobalEventsContext()
  
  useEffect(()=>{
    if(session && !notifier){
      const user = (session as unknown as Session).user;
      // setUser(res => (session as unknown as Session).user);
      setNotifier((res) => {
        if(user){
          
          return new Notifier(user.id);
        }
        return undefined;
      })
    }
  },[session, notifier]);

  return <NotificationContext.Provider value={{
    // setCallback,
    notifier
  }}>{children}</NotificationContext.Provider>
};
export {NotificationProvider, useNotificationContext};
