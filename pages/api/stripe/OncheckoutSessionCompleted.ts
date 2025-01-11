import {prisma} from '@/src/lib/prisma';
const bcrypt = require('bcryptjs');
import { WEBAPP_URL } from "@/src/constants";
import { addParticipant } from "@/src/facades/cycle";
import { sendMail} from "@/src/facades/mail";

export const OncheckoutSessionCompleted=async (email:string,userName:string,cycleId:number,cycleTitle:string,customerId?:string,productId?:string)=>{
    let user=await prisma.user.findFirst({where:{email}});
    let newUser=false;
    if(!user){
      const password = await bcrypt.hash(email, 8);
      user = await prisma.user.create({
        data:{
          email,
          password
        }
      });
      newUser=true;
    }
    await prisma.subscription.create({
      data:{
        status:'paid',
        userId:user.id,
        cycleId,
        customerId:customerId!,
        productId,
      }
    });

    await addParticipant(cycleId,user?.id);
    const next=encodeURIComponent(`/cycle/${cycleId}`);
    const identifier=encodeURIComponent(`${email}`);
    
    const html = newUser
      ? `
        <h5>${userName}, sua assinatura no clube ${cycleTitle}, foi concluída com sucesso.</h5>
        <a href="${WEBAPP_URL}/profile?next=${next}&identifier=${identifier} style="ext-decoration: underline;color: orange;">Você deve completar seu registro para acessar o clube.</a>
      `
      : `<h5>${userName}, sua assinatura no clube <a href="${process.env.NEXTAUTH_URL}/cycle/${cycleId}">${cycleTitle}</a>, foi concluída com sucesso.</h5>`;

    await sendMail({
      from:process.env.EMAILING_FROM!,
      to:[{email}],
      subject:`Assinatura no clube "${cycleTitle}", concluída com sucesso`,
      html
    });
  }