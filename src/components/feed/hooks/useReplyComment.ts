import { WEBAPP_URL } from "@/src/constants"
import { useSession } from "next-auth/react";
import { QueryClient, useMutation } from "react-query"

export const useReplyComment = (page_id:string|number) => {
    const ck = ['LAST3_COMMENTS',`${page_id}`];
    const{data:session}=useSession()
    const qc = new QueryClient();
    const{mutate,isLoading,isError,isSuccess}=useMutation({
        mutationFn: async ({comment_id,body}:{comment_id:string|number,body:string})=>{
            if(session?.user){
                const url =`${WEBAPP_URL}/api/hyvor_talk/comment/${comment_id}/reply`;
                const fr = await fetch(url,{
                    method:'POST',
                    body:JSON.stringify({body,sso_id:session?.user.id})
                })
                if(fr.ok){
                    const{data:comment}=await fr.json();
                }
            }
        },
        async onSettled(data, error, variables, context) {
            if(!error)
                await qc.invalidateQueries(ck);
        },
    })
    return {mutate,isLoading,isError,isSuccess}
}