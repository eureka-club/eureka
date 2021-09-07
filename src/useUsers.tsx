import { useQuery } from 'react-query';
// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';
// import { UserDetail } from './types/user';
interface fetchProps {
  id: string;
  select?: Record<string, boolean>;
  include?: boolean;
}
const fetchUsers = async (props: fetchProps) => {
  const { id, select, include } = props;
  if (!id) return null;
  const s = encodeURIComponent(JSON.stringify({ select }));

  const res = await fetch(`/api/user/${id}?select=${s}&include=${include}`);
  const { data: user } = await res.json();
  return user; // .map((i: { code: string; label: string }) => ({ code: i.code, label: i.label }));
};

const useUsers = (props: fetchProps) => {
  const { id, select = undefined, include = true } = props;

  return useQuery(['USERS', id], () => fetchUsers({ id, select, include }), {
    staleTime: 1000 * 60 * 60,
  });
};

export { useUsers, fetchUsers };
