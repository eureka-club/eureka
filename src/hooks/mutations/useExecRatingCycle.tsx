"use client"

import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '@/src/components/forms/SignInForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CycleDetail } from '@/src/types/cycle';
import { useSession } from 'next-auth/react';
import { UserDetail } from '@/src/types/user';
import useUser from '@/src/hooks/useUser';

export interface ExecRatingPayload {
  doCreate:boolean;
  ratingQty:number;
}
interface MutateReturn{
  prevUser:UserDetail|undefined;
  prevcycle:CycleDetail|undefined;
}
interface Props{
  cycle:CycleDetail;
}

const useExecRating = (props:Props)=>{
  const {cycle} = props;
  const queryClient = useQueryClient();
  const {data:session,status} = useSession();
  const { data: user } = useUser(session?.user?.id||0, {
    enabled:!!session?.user?.id
  });

  const { show } = useModalContext();

  const openSignInModal = () => {
    show(<SignInForm />);
  };
    
  return useMutation(
    {
      mutationFn:async ({ doCreate, ratingQty }:ExecRatingPayload) => {
        if (session && cycle) {
          const res = await fetch(`/api/cycle/${cycle.id}/rating`, {
            method: doCreate ? 'POST' : 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              qty: ratingQty,
              doCreate,
            }),
          });
          return res.json();
        }
        openSignInModal();
        return null;
      },
      onMutate:async (payload: ExecRatingPayload) => {
        let prevUser =undefined;
        let prevCycle =undefined;
        if (cycle && session && user) {
          const cacheKey = ['CYCLE',`${cycle.id}`];
          await queryClient.cancelQueries({queryKey:['USER', `${session.user.id}`]});
          await queryClient.cancelQueries({queryKey:cacheKey});
          
          prevUser = queryClient.getQueryData<UserDetail>(['USER', `${session.user.id}`]);
          prevCycle = queryClient.getQueryData<CycleDetail>(cacheKey);
      
          let ratingCycles = user.ratingCycles
          let ratings = cycle.ratings;
      
          if (!payload.doCreate) {
            ratingCycles = ratingCycles.filter((i) => i.cycleId !== cycle.id);
            ratings = ratings.filter((i) => i.userId != session.user.id);
          } 
          else {
            ratingCycles?.push({cycleId:cycle.id,qty:payload.ratingQty});
            ratings.push({ userId: +user.id, qty:payload.ratingQty });
          }
          queryClient.setQueryData(cacheKey, { ...cycle, ratings });
          queryClient.setQueryData(['USER', `${user.id}`], { ...user, ratingCycles });
        }
        return { prevUser, prevCycle };
      },
      onSettled:(_, error, __, context) => {
        const cacheKey = ['CYCLE',`${cycle.id}`];
        if (error && context) {
          if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
          if ('prevCycle' in context) queryClient.setQueryData(cacheKey, context?.prevCycle);
        }
        queryClient.invalidateQueries({queryKey:['USER', `${session?.user.id}`]});
        queryClient.invalidateQueries({queryKey:cacheKey});
      },
    },
  );
}


export default useExecRating