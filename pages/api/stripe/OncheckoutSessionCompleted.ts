import {prisma} from '@/src/lib/prisma';
const bcrypt = require('bcryptjs');
import { WEBAPP_URL } from "@/src/constants";
import { addParticipant } from "@/src/facades/cycle";
import { sendMail} from "@/src/facades/mail";

export const OncheckoutSessionCompleted=async (email:string,userName:string,cycleId:number,cycleTitle:string,customerId?:string,productId?:string)=>{
  console.log(`OncheckoutSessionCompleted: `,{
    email,
    userName,
    cycleId,
    cycleTitle,
    customerId,
    productId
  });
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
    let subscription = await prisma.subscription.findFirst({
      where:{
        cycle:{id:cycleId},
        user:{id:user?.id}
      }
    });
    if(!subscription)
      await prisma.subscription.create({
        data:{
          productId,
          status: "paid",
          cycle: {
            connect: {id:cycleId}
          },
          user:{
            connect:{id:user.id}
          }
        }
      });
    else{
      await sendMail({
        from:process.env.EMAILING_FROM!,
        to:[{email:process.env.DEV_EMAIL!},{email:process.env.EMAILING_FROM!}],
        subject:`User: ${user?.id} has paid once again for the subscription on clube: "${cycleTitle}"`,
        html:`
          <p>Customer: ${customerId}</p>
          <p>Email: ${email}</p>
          <p>Product: ${productId}</p>
          <p>Cycle: ${cycleId}</p>
        `
      });
    }

    await addParticipant(cycleId,user?.id);
    const next=encodeURIComponent(`/cycle/${cycleId}`);
    const identifier=encodeURIComponent(`${email}`);
    
    const html = newUser
      ? `
        <p>Agora você faz parte do Clube "Com Amor, Spinardi"!🌟</p>
        <p>
          Olá, ${user?.name??email}!
          <br/>
          Sua assinatura no Clube de Leitura, Cinema e Música "Com Amor, Spinardi" foi concluída com sucesso! 🎉
        </p>
        <p>
          Para começar a aproveitar todos os benefícios do Clube é só completar o seu registro na plataforma Eureka clicando no botão abaixo:
          <br/>
          <a href="${WEBAPP_URL}/profile?next=${next}&identifier=${identifier}" style="ext-decoration: underline">👉 Completar Registro</a>
        </p>
        <p>
          É rapidinho! Esse passo é necessário para acessar os materiais, e-mails, fórum de discussão etc. 
          <br/>
          Estamos muito felizes em ter você com a gente! Qualquer dúvida, estamos por aqui.
          <br/>
          <br/>
          Com carinho,
          <br/>
          Equipe Eureka
        </p>
      `
      : `
      <p>${user?.name??email}, sua assinatura no Clube de Leitura, ${cycleTitle}, foi concluída com sucesso.</p>
      <p>
        👉 Para acessar o Clube, é só clicar aqui: <a href="${process.env.NEXTAUTH_URL}/cycle/${cycleId}">${cycleTitle}</a>
        <br/>
        Lembre que você precisa fazer login na sua conta da Eureka para acessar o conteúdo 🙂  
        <br/>
        Qualquer dúvida estamos por aqui.
        <br/>
        Com carinho,
        <br/>
        <br/>
        Equipe Eureka
      </p>
      `;

    await sendMail({
      from:process.env.EMAILING_FROM!,
      to:[{email}],
      subject:`Assinatura no clube "${cycleTitle}", concluída com sucesso`,
      html
    });
  }