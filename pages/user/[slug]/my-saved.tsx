import { NextPage, GetServerSideProps } from 'next';
import Head from "next/head";
import { Spinner,Tab,Tabs } from 'react-bootstrap';
import { QueryClient, dehydrate } from 'react-query';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router'
import useMySaved from '@/src/useMySaved'
import {getUser} from '@/src/useUser';
import CMI from '@/src/components/cycle/MosaicItem'
import PMI from '@/src/components/post/MosaicItem'
import WMI from '@/components/work/MosaicItem'
import {getSession} from 'next-auth/react'
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import Masonry from '@mui/lab/Masonry';
import { Box } from '@mui/material';

interface Props{
  id:number;
}

const RenderPosts = ({favPosts}:{favPosts:{id:number}[]})=>{
  return  <Masonry columns={{xs:1,sm:3,md:3,lg:4}} spacing={1}>
  {
  favPosts.map(p=>
    <Box key={p.id}>
      <PMI postId={p.id} sx={{
        'img':{
          width:'100%',
          height:'auto',
        }
      }} />
    </Box>
  )??<></>}
  </Masonry>
}

const RenderCycles = ({favCycles}:{favCycles:{id:number}[]})=>{
  return <Masonry columns={{xs:1,sm:3,md:3,lg:4}} spacing={1}>
  {
    favCycles?.map(c=><Box key={c.id}>
      <CMI  cycleId={c.id} />
    </Box>)!
  }
</Masonry>
}

const RenderWorks = ({favWorks}:{favWorks:{id:number}[]})=>{
  return  <Masonry columns={{xs:1,sm:3,md:3,lg:5}} spacing={1}>
  {favWorks.map(c=>
      <Box key={c.id}>
        <WMI workId={c.id } sx={{
                          'img':{
                            width:'100%',
                            height:'auto',
                          }
                        }} />
      </Box>
  )}
  </Masonry>
}

const MySaved: NextPage<Props> = ({id}) => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router?.push('/')
  const sfl = useMySaved(id)

  // const renderSFL = (i:CycleDetail|PostDetail|WorkDetail)=>{
  //   if(isCycleMosaicItem(i))return <CMI cycleId={i.id}/>
  //   if(isPostMosaicItem(i))return <PMI postId={i.id}/>
  //   if(isWorkMosaicItem(i))return <WMI workId={i.id}/>
  // }
  
  
  
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
        <RenderPosts favPosts={sfl.favPosts}/>
      </Tab> : ''}
      {sfl.favCycles.length ? <Tab eventKey="cycles" title={t('cycles')}>
        <RenderCycles favCycles={sfl.favCycles}/>
      </Tab> : ''}
      {sfl.favWorks.length ? <Tab eventKey="works" title={t('works')}>
        <RenderWorks favWorks={sfl.favWorks}/>
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
