import {} from 'react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '@/src/components/forms/SignInForm';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { UserDetail } from '@/src/types/user';
import useUser from '@/src/useUser';
import { WorkDetail, WorkSumary } from '@/src/types/work';
import useTranslation from 'next-translate/useTranslation';

export interface ExecReadOrWatchedWorkPayload {
  doCreate: boolean;
  year: number;
}
interface Props{
  workId:number;
  notLangRestrict?:boolean
}

const useExecReadOrWatchedWork = (props: Props) => {
  const {lang} = useTranslation();
  const { workId,notLangRestrict=true } = props;
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { data: user } = useUser(session?.user?.id || 0, {
    enabled: !!session?.user?.id,
  });

  const { show } = useModalContext();

  const openSignInModal = () => {
    show(<SignInForm />);
  };

  return useMutation(
    async ({ doCreate, year }: ExecReadOrWatchedWorkPayload) => {
      if (session && workId) {
        const res = await fetch(`/api/work/${workId}/readOrWatched?lang=${lang}`, {
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
    {
      onMutate: async (payload: ExecReadOrWatchedWorkPayload) => {
        let prevUser = undefined;
        let prevWork = undefined;
        let cacheKey = undefined;
        if (workId && session && user) {
          cacheKey = ['WORK', `${workId}`];
          await queryClient.cancelQueries(['USER', `${session.user.id}`]);
          await queryClient.cancelQueries(cacheKey);

          prevUser = queryClient.getQueryData<UserDetail>(['USER', `${session.user.id}`]);
          prevWork = queryClient.getQueryData<WorkDetail>(cacheKey);

          let readOrWatchedUser = user.readOrWatchedWorks;
          // let readOrWatchedWork = work.readOrWatchedWorks;

          if (!payload.doCreate) {
            readOrWatchedUser = readOrWatchedUser.filter((i) => i.workId !== workId);
            // readOrWatchedWork = readOrWatchedWork.filter((i) => i.userId != session.user.id);
          } else {
            // readOrWatchedUser?.push({ workId: work.id, work, year: payload.year });
            // readOrWatchedWork.push({ userId: +user.id, workId: +work.id, year: payload.year });
          }
          // queryClient.setQueryData(cacheKey, { ...work, readOrWatchedWork });
          queryClient.setQueryData(['USER', `${user.id}`], { ...user, readOrWatchedUser });
        }
        return { prevUser, prevWork, cacheKey };
      },
      onSettled: (_, error, __, context) => {
        // const cacheKey = ['WORK', `${work.id}`];
        if (error && context) {
          queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser!);
          queryClient.setQueryData(context?.cacheKey!, context?.prevWork!);
        }
        queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
        queryClient.invalidateQueries(context?.cacheKey!);
      },
    },
  );
};


export default useExecReadOrWatchedWork;