import { GetServerSideProps,NextPage } from 'next';
import Head from "next/head";
import { Button, ButtonGroup, Col, Row, Spinner } from 'react-bootstrap';
import { dehydrate, QueryClient } from 'react-query';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getSession, useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

import useMyCycles, { getMyCycles } from '@/src/useMyCycles';
import CMI from '@/src/components/cycle/NewMosaicItem';
import {useRouter} from 'next/router'
import { BiArrowBack } from 'react-icons/bi';

interface Props{
  id:number;
}

const MyCycles: NextPage<Props> = ({id}) => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router.push('/')
  const {data:dataCycles} = useMyCycles(id);
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
    <article className='mt-4' data-cy="my-cycles">
      <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      {
      isLoadingSession 
        ? <Spinner animation="grow"/>
        : session ? (
          <>
          <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('myCycles')}</h1>
            <Row>
              {dataCycles?.cycles.map(c=>
                <Col key={c.id} xs={12} sm={6} lg={3} className='mb-5 d-flex justify-content-center  align-items-center'>
                  <CMI cycleId={c.id} size='md' />
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
  let id = 0
  if(ctx.query && ctx.query.slug){
    const slug = ctx.query.slug.toString()
    const li = slug.split('-').slice(-1)
    id = parseInt(li[0])
  }
  let res = {
    props:{
      id,
      dehydrateState:dehydrate(qc)
    }
  }
  if(!session)return res;
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;

  await qc.fetchQuery(['MY-CYCLES',id],()=>getMyCycles(id,8,origin));
  
  res = {
    props:{
      id,
      dehydrateState:dehydrate(qc)
    }
  }
  return res;
}

export default MyCycles;
