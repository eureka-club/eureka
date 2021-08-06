import { useQuery } from 'react-query';
// import { useAtom } from 'jotai';
// import globalSearchEngineAtom from './atoms/searchEngine';
// import { UserDetail } from './types/user';

const fetchUsers = async (id: string) => {
  if (!id) return null;
  const res = await fetch(`/api/user${id ? `?id=${id}` : ''}`);
  const { data } = await res.json();
  return data; // .map((i: { code: string; label: string }) => ({ code: i.code, label: i.label }));
};

const useUsers = (id: string) => {
  return useQuery(['USERS', id], () => fetchUsers(id), {
    staleTime: 1000 * 60 * 60,
  });
};

export { useUsers, fetchUsers };
