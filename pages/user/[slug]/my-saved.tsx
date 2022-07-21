import { NextPage, GetServerSideProps } from 'next';
import Head from "next/head";
import { Button, ButtonGroup, Col, Row, Spinner } from 'react-bootstrap';
import { QueryClient, dehydrate } from 'react-query';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router'
import useMySaved from '@/src/useMySaved'
import {getUser} from '@/src/useUser';
import { CycleMosaicItem } from '@/src/types/cycle';
import { PostMosaicItem } from '@/src/types/post';
import { WorkMosaicItem } from '@/src/types/work';
import { isCycleMosaicItem, isPostMosaicItem, isWorkMosaicItem } from '@/src/types';
import CMI from '@/components/cycle/MosaicItem'
import PMI from '@/components/post/MosaicItem'
import WMI from '@/components/work/MosaicItem'
import { BiArrowBack } from 'react-icons/bi';
import {getSession} from 'next-auth/react'

interface Props{
  id:number;
}

const MySaved: NextPage<Props> = ({id}) => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router.push('/')
  const sfl = useMySaved(id)

  const renderSFL = (i:CycleMosaicItem|PostMosaicItem|WorkMosaicItem)=>{
    if(isCycleMosaicItem(i))return <CMI cycleId={i.id}/>
    if(isPostMosaicItem(i))return <PMI postId={i.id}/>
    if(isWorkMosaicItem(i))return <WMI workId={i.id}/>
  }
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
    <article className='mt-4' data-cy="my-saved">
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
          <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('mySaved')}</h1>
            <Row>
              {sfl.map(c=>
                <Col key={c.id} xs={12} sm={6} lg={3} className='mb-5 d-flex justify-content-center  align-items-center'>
                  {renderSFL(c)}
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
  await qc.fetchQuery(['USER',id.toString()],()=>getUser(id));
  
  res = {
    props:{
      id,
      dehydrateState:dehydrate(qc)
    }
  }
  return res;
}

export default MySaved;
