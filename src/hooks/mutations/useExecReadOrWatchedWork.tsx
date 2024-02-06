"use client"

import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '@/src/components/forms/SignInForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UserDetail } from '@/src/types/user';
import useUser from '@/src/useUser';
import { WorkDetail } from '@/src/types/work';
import useTranslation from 'next-translate/useTranslation';
import { useParams } from 'next/navigation';
import useReadOrWatchedWorks from '../useReadOrWatchedWorks';
import { useDictContext } from '../useDictContext';

export interface ExecReadOrWatchedWorkPayload {
  doCreate: boolean;
  year: number;
}
interface Props{
  work:WorkDetail;
  notLangRestrict?:boolean
}

const useExecReadOrWatchedWork = (props: Props) => {
  const{lang}=useParams<{lang:string}>()!;
  const { work,notLangRestrict } = props;
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { data: user } = useUser(session?.user?.id || 0, {
    enabled: !!session?.user?.id,
  });
  const {data:roww}=useReadOrWatchedWorks(user?.id!);
  const readOrWatchedWorks = roww as {work:WorkDetail,year:any}[];
  const {dict} = useDictContext();
  const { show } = useModalContext();

  const openSignInModal = () => {
    show(<SignInForm />);
  };

  return useMutation(
    {
      mutationFn:async ({ doCreate, year }: ExecReadOrWatchedWorkPayload) => {
        if (session && work) {
          const res = await fetch(`/api/work/${work.id}/readOrWatched`, {
            method: doCreate ? 'POST' : 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              year: year,
              doCreate,
            }),
          });
          return res.json();
        }
        openSignInModal();
        return null;
      },
      onMutate: async (payload: ExecReadOrWatchedWorkPayload) => {
        let prevUser = undefined;
        let prevWork = undefined;
        let cacheKey = undefined;
        if (work && session && user) {
          cacheKey = notLangRestrict ? ['WORK', `${work.id}`] : ['WORK', `${work.id}-${lang}`];
          await queryClient.cancelQueries({queryKey:['USER', `${session.user.id}`]});
          await queryClient.cancelQueries({queryKey:cacheKey});

          prevUser = queryClient.getQueryData<UserDetail>(['USER', `${session.user.id}`]);
          prevWork = queryClient.getQueryData<WorkDetail>(cacheKey);

          let readOrWatchedUser = readOrWatchedWorks;
          let readOrWatchedWork = work.readOrWatchedWorks;

          if (!payload.doCreate) {
            readOrWatchedUser = readOrWatchedUser?.filter((i) => i.work.id !== work.id);
            readOrWatchedWork = readOrWatchedWork?.filter((i) => i.userId != session.user.id);
          } else {
            readOrWatchedUser?.push({ work, year: payload.year });
            readOrWatchedWork.push({ userId: +user.id, workId: +work.id, year: payload.year });
          }
          queryClient.setQueryData(cacheKey, { ...work, readOrWatchedWork });
          queryClient.setQueryData(['USER', `${user.id}`], { ...user, readOrWatchedUser });
        }
        return { prevUser, prevWork, cacheKey };
      },
      onSettled: (_, error, __, context) => {
        if (error && context) {
          queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser!);
          queryClient.setQueryData(context?.cacheKey!, context?.prevWork!);
        }
        queryClient.invalidateQueries({queryKey:['USER', `${session?.user.id}`]});
        queryClient.invalidateQueries({queryKey:context?.cacheKey!});
      },
    },
  );
};


export default useExecReadOrWatchedWork;