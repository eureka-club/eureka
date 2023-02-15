import {} from 'react';
import { useModalContext } from '@/src/useModal';
import SignInForm from '@/src/components/forms/SignInForm';

import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { UserMosaicItem } from '@/src/types/user';
import useUser from '@/src/useUser';
import { PostMosaicItem } from '@/src/types/post';

export interface ExecReactionPayload {
  doCreate:boolean;
  emoji:string;
}
interface MutateReturn{
  prevUser:UserMosaicItem|undefined;
  prevPost:PostMosaicItem|undefined;
}
interface Props{
  post:PostMosaicItem;
}

const usePostReactionCreateOrEdit = (props:Props)=>{
  const {post} = props;
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
    async ({ doCreate, emoji }:ExecReactionPayload) => {
      if (session && post) {
        const res = await fetch(`/api/post/${post.id}/reaction`, {
          method: doCreate ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emoji,
            doCreate,
          }),
        });
        return res.json();
      }
      openSignInModal();
      return null;
    },
    {
      onMutate:async (payload: ExecReactionPayload) => {
        let prevUser =undefined;
        let prevPost =undefined;
        if (post && session && user) {
          const cacheKey = ['POST',`${post.id}`];
          await queryClient.cancelQueries(['USER', `${session.user.id}`]);
          await queryClient.cancelQueries(cacheKey);
          
          prevUser = queryClient.getQueryData<UserMosaicItem>(['USER', `${session.user.id}`]);
          prevPost = queryClient.getQueryData<PostMosaicItem>(cacheKey);
      
          let reactionsPost = user.reactions;
          let ratings = post.reactions;
      
          if (!payload.doCreate) {
            reactionsPost = reactionsPost.filter((i) => i.postId !== post.id);
            ratings = ratings.filter((i) => i.userId != session.user.id);
          } 
          else {
            reactionsPost?.push({postId:post.id,emoji:payload.emoji});
            ratings.push({ userId: +user.id, emoji:payload.emoji });
          }
          queryClient.setQueryData(cacheKey, { ...post, ratings });
          queryClient.setQueryData(['USER', `${user.id}`], { ...user, reactionsPost });
        }
        return { prevUser, prevPost };
      },
      onSettled:(_, error, __, context) => {
        const cacheKey = ['POST',`${post.id}`];
        if (error && context) {
          if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
          if ('prevPost' in context) queryClient.setQueryData(cacheKey, context?.prevPost);
        }
        queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
        queryClient.invalidateQueries(cacheKey);
      },
    },
  );
}


export default usePostReactionCreateOrEdit