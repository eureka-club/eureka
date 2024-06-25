import { Locale } from "i18n-config";
// import { useQuery } from "react-query";
import { WEBAPP_URL } from "../constants";
// import { useRouter } from "next/router";

export const getDict = async (namespace:string,locale?:Locale):Promise<Record<string,string>|undefined> => {
    if(namespace){
        const url = `${WEBAPP_URL}/api/translation/getDict`;
        const fr = await fetch(url,{
            method:'post',
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                locale,
                namespace
            })
        });
        if(fr.ok){
            const dict = await fr.json();
            return dict;
        }
    }
    return undefined;
}
export const dict = (k:string,json:Record<string,string>|null,specs?:Record<string,any>)=>{
    if(json){
        let val = json[k];
        if(specs){
            const specsEntries = Object.entries(specs);
            if(specsEntries.length){
            let i = 0;
            for(;i<specsEntries.length;i++){
                const re=new RegExp(`{{${specsEntries[i][0]}}}`);
                const vr = val.replace(re,specsEntries[i][1]);
                val = vr ?? val;
            }
            }
        }
        return val;
    }
    return k;
}
// const useGetDict = (namespace:string,locale:Locale)=>{
//     const staleTime= 1000 * 60 * 60;
//     const queryKey=`translation-dict-${namespace}-${locale}`
//     return useQuery({
//         queryKey,
//         queryFn:()=>getDict(namespace,locale),
//         staleTime
//     });
// }
// export const useTranslation = (namespace:string)=>{
//     const router=useRouter();
//     //TODO will change when we update to next 13 
//     const locale=router.defaultLocale??'pt';
//     //TODO will change when we update to next 13 

//     const {data:json} = useGetDict(namespace,locale as Locale);
//     const t = (key:string,specs?:Record<string,any>)=>dict(key,json??{},specs)
//     return {t}
// }