import React from 'react';
// import { Session } from '@/src/types';
import { NextPage, GetServerSideProps } from 'next';

import SimpleLayout from '../src/components/layouts/SimpleLayout';
import ResetPassForm from '../src/components/forms/ResetPassForm';
import {prisma} from '@/src/lib/prisma';
import { useRouter } from 'next/navigation';
import { getDictionary, t } from '@/src/get-dictionary';
import { Locale, i18n } from 'i18n-config';

interface Props{
  userId:string;
  email:string;
  dict:any
}
const ResetPassPage: NextPage<Props> = ({userId,email,dict}) => {
  const router = useRouter();
  if(!userId)router.push('/');
  return (
    <SimpleLayout title={t(dict,'resetPassword1')} showNavBar={false} showFooter={false}>
         <ResetPassForm userId={userId} email={email}/>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req,query,res,locale}) => {
  let email='';
  let password='';
  const redirect = ()=>{
    res.setHeader("location", "/");
        res.statusCode = 302;
        res.end();
  }
  const {hash} = query;
  if(!hash){
    redirect()
  }
  else{
    try{
      const base64Hash = Buffer.from(hash?.toString(),'base64').toString();
      [email,password] = base64Hash.split('!|!');
    
      const u = await prisma.user.findFirst({where:{
        email,
        password
      }})
      
      if(!u)redirect()
      return {
        props:{
          userId:u!.id,
          email:u!.email
        }
      }
      
    }
    catch(e){
      redirect()
    }   

  }
  const dictionary=await getDictionary(locale as Locale ?? i18n.defaultLocale);
  const dict={...dictionary['common'],...dictionary['PasswordRecovery']};
  return {props:{userId:null,email:null,dict}}
}

export default ResetPassPage;
