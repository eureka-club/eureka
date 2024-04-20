import { WEBAPP_URL } from '@/src/constants';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: boolean|any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  if(req.method=='POST'){
    
    // const r = await send()
    // res.status(200).json({data:r})
    const {from,to,subject,text,html,from_name,template_name, template_content} = req.body;
    debugger;
    const global_merge_vars = template_content;
    const merge_vars = to.map((t:{email:string})=>({
      rcpt:t.email,
      vars:[{
        name:'redirect_merge_var',
        content:`${WEBAPP_URL}/policy/`
      }]
    }));
    const message = {
      from_email: from??process.env.EMAILING_FROM,
      from_name: from_name||'Eureka',
      subject,
      ...(!template_name && text) && {text},
      ...(!template_name && html) && {html},
      to,
      ...template_name && {global_merge_vars, merge_vars},
    };
    

    /*
    const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
  "YOUR_API_KEY"
);

const run = async () => {
  const response = await mailchimpClient.messages.sendTemplate({
    template_name: "template_name",
    template_content: [{}],
    message: {},
  });
  console.log(response);
};

run();

    
    */
    const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.EMAIL_SERVER_PASS);
    let response=undefined;
    if(template_name){
      response = await mailchimp.messages.sendTemplate({
        template_name,
        template_content,
        message,
      });
    }
    else{
      response = await mailchimp.messages.send({message});
    }
    if(response.isAxiosError){
      res.statusMessage = response.message;
      return res.status(500).json({data:null});
    }
    return res.status(200).json({data:response})
    // else if(response[0].status == "sent")
    // else {
    //   res.statusMessage = response[0].reject_reason;
    //   res.status(500).json({data:null});
    // }
   
  }
  if(req.method=='GET'){
    res.status(200).json({data:'ok'})
  }

  
}
