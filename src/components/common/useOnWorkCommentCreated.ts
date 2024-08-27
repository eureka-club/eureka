import { WEBAPP_URL } from "@/src/constants";
import { useSession } from "next-auth/react";

 export const useOnWorkCommentCreated =  (workId:number)=>{
  const {data:session}=useSession();
    const dispatch = async (comment:any)=>{
      const url = `${WEBAPP_URL}/api/hyvor_talk/onCommentCreated/work`;
      const fr = await fetch(url,{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          workId,
          url:comment.url,
          commentText:comment.content_html,
          commentURL:`/work/${workId}?ht-comment-id=${comment.id}`,
          user:{id:session?.user.id,name:session?.user.name,email:session?.user.email},
          parent_id:comment.parent_id,
        })
      });
      if(fr.ok){
        const res = await fr.json();
        return res;
      }
    }
    return {dispatch};
}