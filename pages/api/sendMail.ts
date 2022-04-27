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
    const {to,subject,text,html,from_name} = req.body;
    
    const message = {
      from_email: process.env.EMAILING_FROM,
      from_name: from_name||'EUREKA',
      subject,
      ...text && {text},
      ...html && {html},
      to
    };
    
    const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.EMAIL_SERVER_PASS);
    const response = await mailchimp.messages.send({message});
    console.log(response);
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
