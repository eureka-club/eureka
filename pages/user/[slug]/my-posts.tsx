import { NextPage } from 'next';
import Head from "next/head";
import {GetServerSideProps} from 'next'
import { dehydrate, QueryClient } from 'react-query';
import { Col, Row, Spinner } from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getSession, useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

import useMyPosts,{getMyPosts} from '@/src/useMyPosts';
import PMI from '@/src/components/post/MosaicItem';
import {useRouter} from 'next/router'

interface Props{
}

const MyPosts: NextPage<Props> = () => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router.push('/')
  const {data:dataPosts} = useMyPosts(session);
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
    <article className='mt-4'>
      {
      isLoadingSession 
        ? <Spinner animation="grow"/>
        : session ? (
          <>
          <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('myPosts')}</h1>
            <Row>
              {dataPosts?.posts.map(c=>
                <Col key={c.id} xs={12} sm={6} lg={3}>
                  <PMI postId={c.id} />
                </Col>
              )}
            </Row>
            </>
        ) : ''
      }
          </article>
    </SimpleLayout>
  </>
};
export const getServerSideProps:GetServerSideProps= async (ctx)=>{
  const qc = new QueryClient();
  const session = await getSession({ctx})
  let res = {
    props:{
      dehydrateState:dehydrate(qc)
    }
  }
  if(!session)return res;
  const id = session.user.id;
  await qc.fetchQuery(['MY-POSTS',id],()=>getMyPosts(id,8));
  
  res = {
    props:{
      dehydrateState:dehydrate(qc)
    }
  }
  return res;
}
export default MyPosts;
