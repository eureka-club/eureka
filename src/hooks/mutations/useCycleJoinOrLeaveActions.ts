import {} from 'react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { CycleMosaicItem } from '@/src/types/cycle';
import { UserMosaicItem } from '@/src/types/user';
import useTranslation from 'next-translate/useTranslation';
import {useNotificationContext} from '@/src/useNotificationProvider';
import useCycleJoinRequests,{setCycleJoinRequests,removeCycleJoinRequest} from '@/src/useCycleJoinRequests'

type ctx = {
    ss: UserMosaicItem[] | undefined;
    ck: string[];
} | undefined;

const useJoinUserToCycleAction = (user:UserMosaicItem,cycle:CycleMosaicItem,participants:UserMosaicItem[],onSettledCallback?:(_data:any,error:any,_variable:any,context:ctx)=>void)=>{
    const {t} = useTranslation('common');
    const {notifier} = useNotificationContext();
    const queryClient = useQueryClient();
    const whereCycleParticipants = {
        OR:[
            {cycles: { some: { id: cycle?.id } }},//creator
            {joinedCycles: { some: { id: cycle?.id } }},//participants
        ], 
    };

    return useMutation(
        async () => {      
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
                   toast.success( t(json.message))
          }
    
        },
        {
          onMutate: async () => {
            const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
            await queryClient.cancelQueries(ck);
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
            if(user){
              queryClient.invalidateQueries(['USER', `${user.id}`]);
              queryClient.invalidateQueries(['CYCLE',`${cycle?.id}`]);
              queryClient.invalidateQueries(ck)
            }
            queryClient.invalidateQueries(['USER', `${user.id}`, 'cycles-join-requests']);
            if(onSettledCallback)
                onSettledCallback(_data,error,_variable,context);
          },
        },
      );

}

const useLeaveUserFromCycleAction = (user:UserMosaicItem,cycle:CycleMosaicItem,participants:UserMosaicItem[]) => {
    const {t} = useTranslation('common');
    const queryClient = useQueryClient();
    const {notifier} = useNotificationContext();
    const whereCycleParticipants = {
        OR:[
            {cycles: { some: { id: cycle?.id } }},//creator
            {joinedCycles: { some: { id: cycle?.id } }},//participants
        ], 
    };

    return useMutation(
      async () => {
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
            notificationToUsers,
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
              toUsers:notificationToUsers,
              data:{message:notificationMessage}
            });
          }
        }
        
      },
      {
        onMutate: async () => {
            const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
            await queryClient.cancelQueries(ck);
            const ss = queryClient.getQueryData<UserMosaicItem[]>(ck)
            return {ss,ck}
  
        },
        onSettled(_data,error,_variable,context) {
            const {ck,ss} = context as {ss:UserMosaicItem[],ck:string[]}
            if(error){
            queryClient.setQueryData(ck,ss)
            }
            if(user){
            queryClient.invalidateQueries(['USER', `${user.id}`]);
            queryClient.invalidateQueries(['CYCLE', `${cycle?.id}`]);
            queryClient.invalidateQueries(ck)
            }
            queryClient.invalidateQueries(['USER', `${user.id}`, 'cycles-join-requests'])
        },
      },
    );

}

export {useJoinUserToCycleAction,useLeaveUserFromCycleAction};