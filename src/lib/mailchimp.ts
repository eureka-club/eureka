import axios from 'axios'

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
          instance.post(url,{segment,email_address})
          .then(onSuccess??console.log)
          .catch(onFailure??console.error)
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
          instance.delete(url,{params:{
            segment,email_address
          }})
          .then(onSuccess??console.log)
          .catch(onFailure??console.error)
}