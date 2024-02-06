"use client"

import {} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { EditWorkClientPayload, WorkDetail } from '@/src/types/work';

const useUpdateWork = ()=>{
  const queryClient = useQueryClient();
  const {data:session} = useSession();
    
  return useMutation(
    {
      mutationFn:async (payload:EditWorkClientPayload) => {
        if (session && payload) {
  
          const formData = new FormData();
  
          Object.entries(payload).forEach(([key, value]) => {
            if (value != null) {
              if(typeof(value) == 'object')
                formData.append(key, JSON.stringify(value));
              formData.append(key, value);
            }
          });
  
          const res = await fetch(`/api/work/${payload.id}`, {
            method: 'PATCH',
           // headers: { 'Content-Type': 'application/multipart' },
            body: formData,//JSON.stringify(payload),
          });
          return res.json();
        }
        return null;
      },
      onMutate:async (payload: EditWorkClientPayload) => {
        let prevWork = null;
        if (payload && session) {
          const cacheKey = ['WORK',`${payload.id}`];
          await queryClient.cancelQueries({queryKey:cacheKey});
          prevWork = queryClient.getQueryData<WorkDetail>(cacheKey);
          queryClient.setQueryData(cacheKey, { ...prevWork, ...payload });
        }
        return { prevWork };
      },
      onSettled:(payload, error, __, context) => {
        const cacheKey = ['WORK',`${payload.id}`];
        if (error && context) {
          if (('prevWork' in context) && context?.prevWork) 
            queryClient.setQueryData(cacheKey, context?.prevWork);
        }
        queryClient.invalidateQueries({queryKey:cacheKey});
      },
    },
  );
}


export default useUpdateWork;