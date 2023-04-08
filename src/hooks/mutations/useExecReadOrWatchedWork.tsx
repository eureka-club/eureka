import {} from 'react';
import { useModalContext } from '@/src/useModal';
import SignInForm from '@/src/components/forms/SignInForm';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { UserMosaicItem } from '@/src/types/user';
import useUser from '@/src/useUser';
import { WorkMosaicItem } from '@/src/types/work';

export interface ExecReadOrWatchedWorkPayload {
  doCreate: boolean;
  year: number;
}
interface Props{
  work:WorkMosaicItem;
}

const useExecReadOrWatchedWork = (props: Props) => {
  const { work } = props;
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
    {
      onMutate: async (payload: ExecReadOrWatchedWorkPayload) => {
        let prevUser = undefined;
        let prevWork = undefined;
        if (work && session && user) {
          const cacheKey = ['WORK', `${work.id}`];
          await queryClient.cancelQueries(['USER', `${session.user.id}`]);
          await queryClient.cancelQueries(cacheKey);

          prevUser = queryClient.getQueryData<UserMosaicItem>(['USER', `${session.user.id}`]);
          prevWork = queryClient.getQueryData<WorkMosaicItem>(cacheKey);

          let readOrWatchedUser = user.readOrWatchedWorks;
          let readOrWatchedWork = work.readOrWatchedWorks;

          if (!payload.doCreate) {
            readOrWatchedUser = readOrWatchedUser.filter((i) => i.workId !== work.id);
            readOrWatchedWork = readOrWatchedWork.filter((i) => i.userId != session.user.id);
          } else {
            readOrWatchedUser?.push({ workId: work.id, work, year: payload.year });
            readOrWatchedWork.push({ userId: +user.id, workId: +work.id, year: payload.year });
          }
          queryClient.setQueryData(cacheKey, { ...work, readOrWatchedWork });
          queryClient.setQueryData(['USER', `${user.id}`], { ...user, readOrWatchedUser });
        }
        return { prevUser, prevWork };
      },
      onSettled: (_, error, __, context) => {
        const cacheKey = ['WORK', `${work.id}`];
        if (error && context) {
          if ('prevUser' in context) queryClient.setQueryData(['USER', `${session?.user.id}`], context?.prevUser);
          if ('prevWork' in context) queryClient.setQueryData(cacheKey, context?.prevWork);
        }
        queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
        queryClient.invalidateQueries(cacheKey);
      },
    },
  );
};


export default useExecReadOrWatchedWork;