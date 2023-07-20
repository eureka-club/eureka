import {} from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { EditWorkClientPayload, WorkMosaicItem } from '@/src/types/work';

const useUpdateWork = ()=>{
  const queryClient = useQueryClient();
  const {data:session} = useSession();
    
  return useMutation(
    async (payload:EditWorkClientPayload) => {debugger;
      if (session && payload) {
        const res = await fetch(`/api/work/${payload.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return res.json();
      }
      return null;
    },
    {
      onMutate:async (payload: EditWorkClientPayload) => {
        let prevWork = null;
        if (payload && session) {
          const cacheKey = ['WORK',`${payload.id}`];
          await queryClient.cancelQueries(cacheKey);
          prevWork = queryClient.getQueryData<WorkMosaicItem>(cacheKey);
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
        queryClient.invalidateQueries(cacheKey);
      },
    },
  );
}


export default useUpdateWork;