import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import Notifier from '@/src/lib/Notifier'
import { useQueryClient } from 'react-query';
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
  
};

const NotificationContext = createContext<ContextType>({
  notifier: undefined
});

const useNotificationContext = (): ContextType => useContext(NotificationContext);

interface Props {
  children: JSX.Element;
}

const NotificationProvider: React.FC<Props> = ({children}) => {
  const queryClient = useQueryClient()
  const [session] = useSession();
  const [notifier, setNotifier] = useState<Notifier>();

  useEffect(()=>{
    if(session && !notifier){
      const user = (session as unknown as Session).user;
      setNotifier((res) => {
        if(user){
          
          return new Notifier(user.id);
        }
        return undefined;
      });

      globalThis.addEventListener('notify',()=>{
        console.log('dispatched notify, updating user session');
        if(session){
          queryClient.invalidateQueries(['USER', user.id.toString()]);
        }
      });

    }

  },[session, notifier, queryClient]);

  return <NotificationContext.Provider value={{
    notifier
  }}>{children}</NotificationContext.Provider>
};
export {NotificationProvider, useNotificationContext};
