import { NextPage, GetServerSideProps } from 'next';
import Head from "next/head";
import { Button, ButtonGroup, Col, Row, Spinner,Tab,Tabs } from 'react-bootstrap';
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
import CMI from '@/components/cycle/NewMosaicItem'
import PMI from '@/src/components/post/MosaicItem'
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

  // const renderSFL = (i:CycleMosaicItem|PostMosaicItem|WorkMosaicItem)=>{
  //   if(isCycleMosaicItem(i))return <CMI cycleId={i.id}/>
  //   if(isPostMosaicItem(i))return <PMI postId={i.id}/>
  //   if(isWorkMosaicItem(i))return <WMI workId={i.id}/>
  // }
  const renderPosts = ()=>{
    return <Row className='mt-5'>
    {sfl.favPosts.map(i=>
      <Col key={i.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
        <PMI postId={i.id} size='md'/>
      </Col>  
    )}
    </Row>
  }
  const renderCycles = ()=>{
    return <Row className='mt-5'>
    {sfl.favCycles.map(i=>
      <Col key={i.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
        <CMI cycleId={i.id} size='md'/>
      </Col>
    )}
    </Row>
  }
  const renderWorks = ()=>{
    return <Row className='mt-5'>
    {sfl.favWorks.map(c=>
        <Col key={c.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
          <WMI workId={c.id }  size='md'/>
        </Col>
    )}
    </Row>
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
           {/* language=CSS */}
    <style jsx global>
                  {`
                    .nav-tabs .nav-item.show .nav-link,
                    .nav-tabs .nav-link.active,
                    .nav-tabs .nav-link:hover {
                      background-color: var(--bs-primary);
                      color: white !important;
                      border: none !important;
                      border-bottom: solid 2px var(--bs-primary) !important;
                    }
                    .nav-tabs {
                      border: none !important;
                      border-bottom: solid 1px var(--bs-primary) !important;
                    }
                    .nav-link{
                        color:var(--bs-primary)
                    }
                  `}
                </style>
   
          <Tabs
      defaultActiveKey="posts"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      {sfl.favPosts.length ? <Tab eventKey="posts" title={t('posts')}>
        {renderPosts()}
      </Tab> : ''}
      {sfl.favCycles.length ? <Tab eventKey="cycles" title={t('cycles')}>
        {renderCycles()}
      </Tab> : ''}
      {sfl.favWorks.length ? <Tab eventKey="works" title={t('works')}>
        {renderWorks()}
      </Tab>:''}
    </Tabs>
            {/* <Row>
              {sfl.map(c=>
                <Col key={c.id} xs={12} sm={6} lg={3} className='mb-5 d-flex justify-content-center  align-items-center'>
                  {renderSFL(c)}
                </Col>
              )}
            </Row> */}
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
  await qc.fetchQuery(['USER',id.toString()],()=>getUser(id, origin));
  
  res = {
    props:{
      id,
      dehydrateState:dehydrate(qc)
    }
  }
  return res;
}

export default MySaved;
