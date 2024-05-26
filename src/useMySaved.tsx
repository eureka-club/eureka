import useUser from './useUser';


const useMySaved = (id:number) => {
  const {data:user} = useUser(id||0,{enabled:!!id});
  if(!user)return {
    favCycles:[],
    favPosts:[],
    favWorks:[]
  }
  const SFL={
    favCycles:user.favCycles?.length ? user.favCycles?.map((c) => ({ ...c, type: 'cycle' })) : [],
    favPosts:user.favPosts?.length ? user.favPosts?.map((p) => ({ ...p, type: 'post' })):[],
    favWorks:user.favWorks??[]
  };
  return SFL;
};

export default useMySaved;
