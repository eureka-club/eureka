import { createContext, useContext, useEffect, useState } from 'react';
import Notifier from '@/src/lib/Notifier'
import { useQueryClient } from '@tanstack/react-query';;
import { useSession } from 'next-auth/react';

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
  const {data:session} = useSession();
  const [notifier, setNotifier] = useState<Notifier>();

  useEffect(()=>{
    if(session && !notifier){
      const user = session.user;
      setNotifier((res) => {
        if(user){
          
          return new Notifier(user.id);
        }
        return undefined;
      });

      globalThis.addEventListener('notify',()=>{
        console.log('dispatched notify, updating user session');
        if(session){
          queryClient.invalidateQueries({queryKey:['USER', user.id.toString()]});
        }
      });

    }

  },[session, notifier, queryClient]);

  return <NotificationContext.Provider value={{
    notifier
  }}>{children}</NotificationContext.Provider>
};
export {NotificationProvider, useNotificationContext};
