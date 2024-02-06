"use client"

import {} from 'react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '@/src/components/forms/SignInForm';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UserDetail } from '@/src/types/user';
import useUser from '@/src/hooks/useUser';
import { PostDetail } from '@/src/types/post';

export interface ExecReactionPayload {
  doCreate:boolean;
  emoji:string;
  unified:string;
}
interface MutateReturn{
  prevUser:UserDetail|undefined;
  prevPost:PostDetail|undefined;
}
interface Props{
  post:PostDetail;
  cacheKey:string[]|[string,string];
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
    {
      mutationFn:async ({ doCreate, emoji,unified }:ExecReactionPayload) => {
        if (session && post) {
          // const doDelete = post.reactions.findIndex(r=>r.userId==session.user.id && r.emoji == emoji) !== -1;
          const res = await fetch(`/api/post/${post.id}/reaction`, {
            method: doCreate ? 'POST' : 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emoji,
              unified,
              doCreate,
            }),
          });
          return res.json();
        }
        openSignInModal();
        return null;
      },
      onMutate:async (payload: ExecReactionPayload) => {
        let prevUser =undefined;
        let prevPost =undefined;
        if (post && session && user) {
          const ck = ['POST',`${post.id}`];
          // const ck = cacheKey || ['POST',`${post.id}`];
          
          await queryClient.cancelQueries({queryKey:['USER', `${session.user.id}`]});
          await queryClient.cancelQueries({queryKey:ck});
          
          prevUser = queryClient.getQueryData<UserDetail>(['USER', `${session.user.id}`]);
          prevPost = queryClient.getQueryData<PostDetail>(ck);
      
          let reactionsPost = user.reactions;
          let reactions = post.reactions;
          if (!payload.doCreate) {
            const idx_in_user = user.reactions.findIndex((i)=>i.postId==post.id && i.unified==payload.unified);
            const idx_in_post = post.reactions.findIndex((i) => i.userId == session.user.id && i.unified==payload.unified);
            user.reactions.splice(idx_in_user,1);
            post.reactions.splice(idx_in_post,1);
          }   
          else {
            reactionsPost?.push({postId:post.id,unified:payload.unified,emoji:payload.emoji});
            reactions.push({ userId: +user.id,unified:payload.unified, emoji:payload.emoji,createdAt:new Date() });
          }
          queryClient.setQueryData(ck, { ...post, reactions });
          queryClient.setQueryData(['USER', `${user.id}`], { ...user, reactions:reactionsPost });
        }
        return { prevUser, prevPost };
      },
      onSettled:(_, error, __, context) => {
        const ck =  ['POST',`${post.id}`];
        // const ck = cacheKey || ['POST',`${post.id}`];
        if (error && context) {
          if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
          if ('prevPost' in context) queryClient.setQueryData(ck, context?.prevPost);
        }
        queryClient.invalidateQueries({queryKey:['USER', `${session?.user.id}`]});
        queryClient.invalidateQueries({queryKey:ck});
      },
    },
  );
}


export default usePostReactionCreateOrEdit