import {} from 'react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { CycleDetail, CycleSumary } from '@/src/types/cycle';
import { UserDetail } from '@/src/types/user';
import useTranslation from 'next-translate/useTranslation';
import {useNotificationContext} from '@/src/useNotificationProvider';
import {setCycleJoinRequests,removeCycleJoinRequest} from '@/src/useCycleJoinRequests'
import { subscribe_to_segment, unsubscribe_from_segment } from '@/src/lib/mailchimp';
import { UserSumary } from '@/src/types/UserSumary';

type ctx = {
    ss: UserDetail[] | undefined;
    ck: string[];
} | undefined;

const useJoinUserToCycleAction = (user:UserSumary,cycle:CycleSumary,participants:{id:number}[],onSettledCallback?:(_data:any,error:any,_variable:any,context:ctx)=>void)=>{
    const {t,lang} = useTranslation('common');
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
          if(cycle?.creator.id) notificationToUsers.push(cycle?.creator.id);
          if(cycle.access==4){
            const fr = await fetch('/api/stripe/checkout_sessions',{
              method:'POST',
              body:JSON.stringify({
                product_id:cycle.product_id,
                price:cycle.price,
                client_reference_id:user.id,
                customer_email: user.email,
                cycleId:cycle.id
              }),
              headers:{
                'Content-Type':'application/json'
              }
            });
            const {stripe_session_url} = await fr.json();
            window.location.href = stripe_session_url;
            return;
          }
          else{
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
              await subscribe_to_segment({
                segment:`ciclo-${cycle.id}-pax`,
                email_address:user.email!,
                name:user.name||'unknown'
              })       
            }
          }
        },
        {
          onMutate: async () => {
            const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
            await queryClient.cancelQueries(ck);
            const ss = queryClient.getQueryData<UserDetail[]>(ck)
            return {ss,ck};    
          },
          onSettled(_data,error,_variable,context) {
            const {ck,ss} = context as {ss:UserDetail[],ck:string[]}
            if(error){
              // setIsCurrentUserJoinedToCycle(false);
              // setCountParticipants(res=>res?res-1:undefined)
              queryClient.setQueryData(ck,ss)
            }
            if(user){
              queryClient.invalidateQueries(['USER', `${user.id}`]);
              queryClient.invalidateQueries(['CYCLE',`${cycle?.id}`]);
              queryClient.invalidateQueries([`cycles-of-interest-${lang}`]);
              queryClient.invalidateQueries(["MY-CYCLES",`${user.id}`]);

              
              queryClient.invalidateQueries(ck)
            }
            queryClient.invalidateQueries(['USER', `${user.id}`, 'cycles-join-requests']);
            if(onSettledCallback)
                onSettledCallback(_data,error,_variable,context);
          },
        },
      );

}

const useLeaveUserFromCycleAction = (user:UserSumary,cycle:CycleSumary,participants:{id:number}[],onSettledCallback?:(_data:any,error:any,_variable:any,context:ctx)=>void)=>{
    const {lang} = useTranslation('common');
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
        if(cycle?.creator.id) notificationToUsers.push(cycle?.creator.id);
  
        const res = await fetch(`/api/cycle/${cycle!.id}/join`, { 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notificationMessage,
            notificationContextURL: `/cycle/${cycle!.id}?tabKey=participants`,
            notificationToUsers:[cycle.creator.id],
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
              toUsers:[cycle.creator.id],
              data:{message:notificationMessage}
            });
          }
          await unsubscribe_from_segment({
            segment:`ciclo-${cycle.id}-pax`,
            email_address:user.email! 
          }) 
        }
        
      }, 
      {
        onMutate: async () => {
            const ck = ['USERS',JSON.stringify(whereCycleParticipants)];
            await queryClient.cancelQueries(ck);
            const ss = queryClient.getQueryData<UserDetail[]>(ck)
            return {ss,ck}
  
        },
        onSettled(_data,error,_variable,context) {
            const {ck,ss} = context as {ss:UserDetail[],ck:string[]}
            if(error){
            queryClient.setQueryData(ck,ss)
            }
            if(user){
            queryClient.invalidateQueries(['USER', `${user.id}`]);
            queryClient.invalidateQueries(['CYCLE', `${cycle?.id}`]);
            queryClient.invalidateQueries([`cycles-of-interest-${lang}`]);
            queryClient.invalidateQueries(["MY-CYCLES",`${user.id}`]);

            queryClient.invalidateQueries(ck)
            }
            queryClient.invalidateQueries(['USER', `${user.id}`, 'cycles-join-requests'])
             queryClient.invalidateQueries(['USER', `${user.id}`, 'cycles-join-requests']);
            if(onSettledCallback)
                onSettledCallback(_data,error,_variable,context);
        },
      },
    );

}

export {useJoinUserToCycleAction,useLeaveUserFromCycleAction};