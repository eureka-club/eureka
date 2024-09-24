import { NextPage, GetServerSideProps } from 'next';
import Head from "next/head";
import { QueryClient, dehydrate } from 'react-query';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router'
import useMySaved from '@/src/useMySaved'
import {getUser} from '@/src/useUser';
import {getSession} from 'next-auth/react'
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import { TabPanelSwipeableViews } from '@/src/components/common/TabPanelSwipeableViews';
import { useState } from 'react';
import MyCyclesSaved from './MyCyclesSaved';
import MyPostsSaved from './MyPostsSaved';
import MyWorksSaved from './MyWorksSaved';
import {WorkSumary} from '@/src/types/work';
import Spinner from '@/src/components/Spinner';

interface Props{
  id:number;
}

const MySaved: NextPage<Props> = ({id}) => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router?.push('/')
  const sfl = useMySaved(id);

  const[indexActive,setindexActive]=useState(sfl.favCycles 
    ? 0 
    : sfl.favPosts
      ? 1
      : 2);

  return <>
    <Head>
        <meta property="og:title" content='Eureka'/>
        <meta property="og:description" content="Activa tu mente, transforma el mundo"/>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} />
        <meta property="og:type" content='website' />

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content="Eureka"></meta>
        <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} ></meta>
        <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} ></meta>  
    </Head>
    <SimpleLayout>
      <ButtonsTopActions/>
    <article className='mt-4' data-cy="my-saved">
      {
      isLoadingSession 
        ? <Spinner/>
        : session ? (
          <>
          <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('mySaved')}</h1>
          <TabPanelSwipeableViews 
            indexActive={indexActive}
            items={
              [
                {
                  label:t('cycles'),
                  content:<MyCyclesSaved favCycles={sfl.favCycles}/>
                },
                {
                  label:t('posts'),
                  content:<MyPostsSaved favPosts={sfl.favPosts}/>
                },
                {
                  label:t('works'),
                  content:<MyWorksSaved favWorks={sfl.favWorks as WorkSumary[]}/>
                }
              ]
            }
          />
            </>
        ) : ''
      }
          </article>
    </SimpleLayout>
  </>
};

export const getServerSideProps:GetServerSideProps = async (ctx)=>{
  const qc = new QueryClient();
  const session = await getSession({ctx})
  let id = 0
  if(ctx.query && ctx.query.slug){
    const slug = ctx.query.slug.toString()
    const li = slug.split('-').slice(-1)
    id = parseInt(li[0])
  }
  let res = {
    props:{
      id,
      session,
      dehydrateState:dehydrate(qc)
    }
  }
  if(!session)return res;
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  await qc.fetchQuery(['USER',id.toString()],()=>getUser(id));
  
  res = {
    props:{
      id,
      session,
      dehydrateState:dehydrate(qc)
    }
  }
  return res;
}

export default MySaved;
