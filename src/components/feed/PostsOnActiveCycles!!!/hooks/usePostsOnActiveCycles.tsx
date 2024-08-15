import { WEBAPP_URL } from "@/src/constants";
import { PostOnActiveCycle } from "@/src/types/post";
import { useQuery } from "react-query";

export const getPostsOnActiveCycles = async ():Promise<PostOnActiveCycle[]|undefined>=>{
    const url = `${WEBAPP_URL}/api/post/onActiveCycles`;
    const fr = await fetch(url);
    if(fr.ok){
        const {posts} = await fr.json();
        return posts;
    }
    return undefined;
}
interface Options {
    staleTime?: number;
    enabled?: boolean;
  }
export const usePostsOnActiveCycles = (options?:Options)=>{
    const { staleTime, enabled } = options || {
        staleTime: 1000 * 60 * 60,
        enabled: true,
      };
      return useQuery<any[] | undefined>(['POSTS','ON CYCLE', 'ACTIVES'], () => getPostsOnActiveCycles(), {
        staleTime,
        enabled,
      });
}