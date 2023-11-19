import axios from 'axios'
import { on } from 'events';

const instance = axios.create({
    baseURL:`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/mailchimp`
})
export interface MailchimpSubscribe{
    segment?:string;
    email_address:string;
    name:string;
}

export const subscribe_to_segment = async (props:MailchimpSubscribe)=>{
    const {segment='eureka-all-users',email_address,name} = props
    const url =`/segments/add_member`
    try{
        const fn_subscribe = ()=>{
            return new Promise<boolean>((resolve,reject)=>{
                instance.post(url,{segment,email_address})
                .then(r=>{
                    resolve(r.status==200/*&&r.data.status!='unsubscribed'*/);
                })
                .catch(e=>{
                    console.error(e);
                    resolve(false);
                });
            });
        }
        const member = await get_member({email_address})
        if(member){
            const res = await fn_subscribe()
            return res;
        }
        else{
            const rnm = await add_member({email_address,name})
            if(rnm){
                const res = await fn_subscribe()
                return res
            }
        }
    }
    catch(e){
        console.error(e)
    }
}

export interface MailchimpUnsubscribe{
    segment?:string;
    email_address:string;
}

export const unsubscribe_from_segment = async (props:MailchimpUnsubscribe)=>{
    const {segment='eureka-all-users',email_address} = props
    const url =`/segments/remove_member`
    try{
        const res = await instance.delete(url,{params:{
          segment,email_address
        }})
        return res;
    }
    catch(e){
        console.error(e)
    }
}

export interface MailchimpListMember{
    list_id?:string;
    email_address:string;
}
export const get_member = async (props:MailchimpListMember)=>{
    const {list_id,email_address} = props
    const url =`/list/get_member`
    try{
        const m = await instance.get(url,{params:{
          list_id,email_address
        }});
        return m.data?.member;
    }
    catch(e){
        console.error(e)
        throw e
    }
}

export interface MailchimpListAddMember{
    list_id?:string;
    email_address:string;
    name:string;
    tags?:string[];
    status?:string;
}
export const add_member = async (props:MailchimpListAddMember)=>{
    const {list_id,email_address,name,status} = props
    const url =`/list/add_member`
    try{
        const res = await instance.post(url,{params:{
          list_id,email_address,status,name
        }})
        return res.data?.member??null
    }
    catch(e){
        console.error(e)
        throw e
    }
}


