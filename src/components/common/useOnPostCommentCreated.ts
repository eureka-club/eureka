import { WEBAPP_URL } from "@/src/constants";
import { useSession } from "next-auth/react";

 export const useOnPostCommentCreated =  (postId:number|string)=>{
  const {data:session}=useSession();
    const dispatch = async (comment:any)=>{
      const url = `${WEBAPP_URL}/api/hyvor_talk/onCommentCreated/post`;
      const fr = await fetch(url,{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          postId,
          url:comment.url,
          commentText:comment.content_html,
          commentURL:`/post/${postId}?ht-comment-id=${comment.id}`,
          page_id:comment.page_id,
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