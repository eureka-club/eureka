import {} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CycleDetail, CycleSumary } from '@/src/types/cycle';
import { UserMosaicItem } from '@/src/types/user';
import {useNotificationContext} from '@/src/hooks/useNotificationProvider';
import {setCycleJoinRequests,removeCycleJoinRequest} from '@/src/hooks/useCycleJoinRequests'
import { subscribe_to_segment, unsubscribe_from_segment } from '@/src/lib/mailchimp';

import { useDictContext } from '../useDictContext';
import { Session } from '@/src/types';

type ctx = {
    ss: UserMosaicItem[] | undefined;
    ck: string[];
} | undefined;

const useJoinUserToCycleAction = (session:Session,cycle:CycleDetail|CycleSumary,participants:UserMosaicItem[],onSettledCallback?:(_data:any,error:any,_variable:any,context:ctx)=>void)=>{
    // const {t} = useDictContext();
    const {notifier} = useNotificationContext();
    const queryClient = useQueryClient();
    const whereCycleParticipants = {
        OR:[
            {cycles: { some: { id: cycle?.id } }},//creator
            {joinedCycles: { some: { id: cycle?.id } }},//participants
        ], 
    };
    const{t,dict}=useDictContext()
    
    return useMutation(
        {
          mutationFn:async () => {  
            if(session){
              const{user}=session;
              let notificationMessage = `userJoinedCycle!|!${JSON.stringify({
                userName: user?.name,
                cycleTitle: cycle?.title,
              })}`;
              const notificationToUsers = (participants || []).map(p=>p.id);
              if(cycle?.creatorId) notificationToUsers.push(cycle?.creatorId);
        
              const res = await fetch(`/api/cycle/${cycle!.id}/join`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  notificationMessage,
                  notificationContextURL: `/cycle/${cycle!.id}?tabKey=participants`,
                  notificationToUsers,
                }),
              });
              if (!res.ok) {
                toast.success(res.statusText)
              }
              else if(res.ok){
                setCycleJoinRequests({userId:user.id,cycleId:cycle!.id})
                const json = await res.json();
                if(notifier){
                  notifier.notify({
                    toUsers:notificationToUsers,
                    data:{message:notificationMessage}
                  });
                }
                if(cycle?.access == 2)
                  toast.success( t(dict,json.message))
                await subscribe_to_segment({
                  segment:`ciclo-${cycle.id}-pax`,
                  email_address:user.email!,
                  name:user.name||'unknown'
                })       
              }
            }    
      
          },
          onMutate: async () => {
            const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
            await queryClient.cancelQueries({queryKey:ck});
            const ss = queryClient.getQueryData<UserMosaicItem[]>(ck)
            return {ss,ck};    
          },
          onSettled(_data,error,_variable,context) {
            const {ck,ss} = context as {ss:UserMosaicItem[],ck:string[]}
            if(error){
              // setIsCurrentUserJoinedToCycle(false);
              // setCountParticipants(res=>res?res-1:undefined)
              queryClient.setQueryData(ck,ss)
            }
            if(session?.user){
              queryClient.invalidateQueries({queryKey:['USER', `${session?.user.id}`]});
              queryClient.invalidateQueries({queryKey:['CYCLE',`${cycle?.id}`]});
              queryClient.invalidateQueries({queryKey:ck})
              queryClient.invalidateQueries({queryKey:['USER', `${session?.user.id}`, 'cycles-join-requests']});
            }
            if(onSettledCallback)
                onSettledCallback(_data,error,_variable,context);
          },
        },
      );

}

const useLeaveUserFromCycleAction = (user:UserMosaicItem,cycle:CycleDetail|CycleSumary,participants:UserMosaicItem[],onSettledCallback?:(_data:any,error:any,_variable:any,context:ctx)=>void)=>{
    // const {t} = useDictContext();
    const queryClient = useQueryClient();
    const {notifier} = useNotificationContext();
    const whereCycleParticipants = {
        OR:[
            {cycles: { some: { id: cycle?.id } }},//creator
            {joinedCycles: { some: { id: cycle?.id } }},//participants
        ], 
    };

    return useMutation(
      {
        mutationFn:async () => {
          let notificationMessage = `userLeftCycle!|!${JSON.stringify({
            userName: user?.name,
            cycleTitle: cycle?.title,
          })}`;
          const notificationToUsers = (participants || []).filter(p=>p.id!==user?.id).map(p=>p.id);
          if(cycle?.creatorId) notificationToUsers.push(cycle?.creatorId);
    
          const res = await fetch(`/api/cycle/${cycle!.id}/join`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              notificationMessage,
              notificationContextURL: `/cycle/${cycle!.id}?tabKey=participants`,
              notificationToUsers:[cycle.creatorId],
            })
          });
          if(!res.ok){
            toast.error(res.statusText)        
          }
          else{
            await removeCycleJoinRequest(user.id,cycle!.id)
            const json = await res.json();
            if(notifier){
              notifier.notify({
                toUsers:[cycle.creatorId],
                data:{message:notificationMessage}
              });
            }
            await unsubscribe_from_segment({
              segment:`ciclo-${cycle.id}-pax`,
              email_address:user.email! 
            }) 
          }
          
        },
        onMutate: async () => {
            const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
            await queryClient.cancelQueries({queryKey:ck});
            const ss = queryClient.getQueryData<UserMosaicItem[]>(ck)
            return {ss,ck}
  
        },
        onSettled(_data,error,_variable,context) {
            const {ck,ss} = context as {ss:UserMosaicItem[],ck:string[]}
            if(error){
            queryClient.setQueryData(ck,ss)
            }
            if(user){
            queryClient.invalidateQueries({queryKey:['USER', `${user.id}`]});
            queryClient.invalidateQueries({queryKey:['CYCLE', `${cycle?.id}`]});
            queryClient.invalidateQueries({queryKey:ck});
            }
            queryClient.invalidateQueries({queryKey:['USER', `${user.id}`, 'cycles-join-requests']});
             queryClient.invalidateQueries({queryKey:['USER', `${user.id}`, 'cycles-join-requests']});
            if(onSettledCallback)
                onSettledCallback(_data,error,_variable,context);
        },
      },
    );

}

export {useJoinUserToCycleAction,useLeaveUserFromCycleAction};