import { useMutation, useQueryClient } from "react-query"
import { WEBAPP_URL } from "./constants";
import { NotificationSumary } from "./types/notification";
import { useSession } from "next-auth/react";

export const useRemoveNotification = ()=>{
    const{data:session}=useSession();

    const qc = useQueryClient();
    const{data,mutate,isError,isLoading,isSuccess}=useMutation(
        async (payload:{id:number,callback:()=>void})=>{
            const{id}=payload;
            
            const url=`${WEBAPP_URL}/api/notification/${id}`;
            const fr=await fetch(url,{
                method:'delete',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({userId:session?.user.id})
            });
            if(fr.ok){
                const json=await fr.json();
                payload.callback();
            }
        },
        {
            async onMutate(payload){
                const{id}=payload;
                const userId=session?.user.id;

                const queryKey=['USER',`${userId}`,'NOTIFICATIONS'];
                await qc.cancelQueries({queryKey});
                let cn = qc.getQueryData<{news:number,total:number,notifications:NotificationSumary[]}>(queryKey);
                let notifications = cn?.notifications?.filter(n=>n.notification.id!=id);
                await qc.setQueryData(queryKey,{...cn,notifications});
                return {queryKey,id,userId,prevNotifications:cn}
            },
            onSettled: (_, error, __, context) => {
                if (error && context) {
                  qc.setQueryData(context?.queryKey, context?.prevNotifications);
                }
                qc.invalidateQueries(['USER', `${context?.userId}`]);
                qc.invalidateQueries(context?.queryKey);
              }
        }
    );
    return {mutate,data,isError,isLoading,isSuccess};
}