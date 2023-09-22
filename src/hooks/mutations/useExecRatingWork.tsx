import {} from 'react';
import { useModalContext } from '@/src/useModal';
import SignInForm from '@/src/components/forms/SignInForm';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { UserMosaicItem } from '@/src/types/user';
import useUser from '@/src/useUser';
import { WorkMosaicItem } from '@/src/types/work';
import useTranslation from 'next-translate/useTranslation';

export interface ExecRatingPayload {
  doCreate:boolean;
  ratingQty:number;
}
interface Props{
  work:WorkMosaicItem;
}

const useExecRating = (props:Props)=>{
  const {work} = props;
  const queryClient = useQueryClient();
  const {data:session} = useSession();
  const { data: user } = useUser(session?.user?.id||0, {
    enabled:!!session?.user?.id
  });
  const {lang} = useTranslation();
  const { show } = useModalContext();

  const openSignInModal = () => {
    show(<SignInForm />);
  };
    
  return useMutation(
    async ({ doCreate, ratingQty }:ExecRatingPayload) => {
      if (session && work) {
        const res = await fetch(`/api/work/${work.id}/rating?language=${lang}`, {
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
    {
      onMutate:async (payload: ExecRatingPayload) => {
        let prevUser =undefined;
        let prevWork =undefined;
        if (work && session && user) {
          const cacheKey = ['WORK',`${work.id}`];
          await queryClient.cancelQueries(['USER', `${session.user.id}`]);
          await queryClient.cancelQueries(cacheKey);
          
          prevUser = queryClient.getQueryData<UserMosaicItem>(['USER', `${session.user.id}`]);
          prevWork = queryClient.getQueryData<WorkMosaicItem>(cacheKey);
      
          let ratingWorks = user.ratingWorks
          let ratings = work.ratings;
      
          if (!payload.doCreate) {
            ratingWorks = ratingWorks.filter((i) => i.workId !== work.id);
            ratings = ratings.filter((i) => i.userId != session.user.id);
          } 
          else {
            ratingWorks?.push({workId:work.id,work,qty:payload.ratingQty});
            ratings.push({ userId: +user.id, qty:payload.ratingQty });
          }
          queryClient.setQueryData(cacheKey, { ...work, ratings });
          queryClient.setQueryData(['USER', `${user.id}`], { ...user, ratingWorks });
        }
        return { prevUser, prevWork };
      },
      onSettled:(_, error, __, context) => {
        const cacheKey = ['WORK',`${work.id}`];
        if (error && context) {
          if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
          if ('prevWork' in context) queryClient.setQueryData(cacheKey, context?.prevWork);
        }
        queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
        queryClient.invalidateQueries(cacheKey);
      },
    },
  );
}


export default useExecRating