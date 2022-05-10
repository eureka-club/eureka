import React from 'react';
import { Session } from '@/src/types';
import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import ResetPassForm from '../src/components/forms/ResetPassForm';
import dayjs from 'dayjs';
import {prisma} from '@/src/lib/prisma';
import { Router, useRouter } from 'next/router';

interface Props{
  userId:string;
  email:string;
}
const ResetPassPage: NextPage<Props> = ({userId,email}) => {
  const { t } = useTranslation('PasswordRecovery');
  const router = useRouter();
  if(!userId)router.push('/login');
  return (
    <SimpleLayout title={t('resetPassword1')} showNavBar={false}>
         <ResetPassForm userId={userId} email={email}/>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req,query,res}) => {
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
  return {props:{userId:null,email:null}}
}

export default ResetPassPage;
