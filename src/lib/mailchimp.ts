import axios from 'axios'
import { on } from 'events';

const instance = axios.create({
    baseURL:`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/mailchimp`
})
export interface MailchimpSubscribe{
    segment?:string;
    email_address:string;
    onSuccess?:(res:Record<string,any>)=>Promise<void>;
    onFailure?:(err:Record<string,any>)=>Promise<void>
}

export const subscribe_to_segment = (props:MailchimpSubscribe)=>{
    const {segment='eureka-all-users',email_address,onSuccess,onFailure} = props
    const url =`/segments/add_member`
    try{
        get_member({
            email_address,
            onSuccess:async (res)=>{
                const fn_subscribe = async ()=>instance.post(url,{segment,email_address})
                .then(onSuccess??console.log)
                .catch(onFailure??console.error)

                if(res.data){
                    const {member} = res.data
                    if(member){
                        await fn_subscribe()
                    }
                    else{
                        const rnm = await add_member({email_address})
                        if(rnm){
                            await fn_subscribe()
                        }
                    }
                }
            },
            onFailure:async (e)=>console.error(e)
        })
    }
    catch(e){
        console.error(e)
    }
}

export interface MailchimpUnsubscribe{
    segment?:string;
    email_address:string;
    onSuccess?:(res:Record<string,any>)=>Promise<void>;
    onFailure?:(err:Record<string,any>)=>Promise<void>
}

export const unsubscribe_from_segment = (props:MailchimpUnsubscribe)=>{
    const {segment='eureka-all-users',email_address,onSuccess,onFailure} = props
    const url =`/segments/remove_member`
    try{
        instance.delete(url,{params:{
          segment,email_address
        }})
        .then(onSuccess??console.log)
        .catch(onFailure??console.error)
    }
    catch(e){
        console.error(e)
    }
}

export interface MailchimpListMember{
    list_id?:string;
    email_address:string;
    onSuccess?:(res:Record<string,any>)=>Promise<void>;
    onFailure?:(err:Record<string,any>)=>Promise<void>
}
export const get_member = (props:MailchimpListMember)=>{
    const {list_id,email_address,onSuccess,onFailure} = props
    const url =`/list/get_member`
    try{
        instance.get(url,{params:{
          list_id,email_address
        }})
        .then(onSuccess??console.log)
        .catch(onFailure??console.error)
    }
    catch(e){
        console.error(e)
        throw e
    }
}

export interface MailchimpListMember{
    list_id?:string;
    email_address:string;
    tags?:string[];
    status?:string;
    onSuccess?:(res:Record<string,any>)=>Promise<void>;
    onFailure?:(err:Record<string,any>)=>Promise<void>
}
export const add_member = async (props:MailchimpListMember)=>{
    const {list_id,email_address,status,onSuccess,onFailure} = props
    const url =`/list/add_member`
    try{
        const res = await instance.post(url,{params:{
          list_id,email_address,status
        }})
        return res.data.member??null
    }
    catch(e){
        console.error(e)
        throw e
    }
}


