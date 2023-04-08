import { GetServerSideProps,NextPage } from 'next';
import Head from "next/head";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { dehydrate, QueryClient } from 'react-query';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import useTranslation from 'next-translate/useTranslation';

import {getbackOfficeData} from '@/src/useBackOffice'
import useFeaturedEurekas,{ getFeaturedEurekas } from '@/src/useFeaturedEurekas';
import PMI from '@/src/components/post/MosaicItem';
import {useRouter} from 'next/router'
import { BiArrowBack } from 'react-icons/bi';

interface Props{
}

const InterestedCycles: NextPage<Props> = () => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:dataCycles} = useFeaturedEurekas()

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
        <>
          <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('Featured Eurekas')}</h1>
            <Row>
              {dataCycles?.posts.map(c=>
                <Col key={c.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
                  <PMI postId={c.id} />
                </Col>
              )}
            </Row>
            </>

          </article>
    </SimpleLayout>
  </>
};
export const getServerSideProps:GetServerSideProps= async (ctx)=>{
  const qc = new QueryClient();
  const {NEXT_PUBLIC_WEBAPP_URL:origin}=process.env;
  
  const bod = await getbackOfficeData(origin)
  if(bod && bod?.CyclesExplorePage){
    const ids = bod?.CyclesExplorePage.split('').map(i=>+i)
    await qc.fetchQuery(['CYCLES','INTERESTED'],()=>getFeaturedEurekas(ids,8,origin));
  }
  return {
    props:{
      dehydrateState:dehydrate(qc)
    }
  };
}

export default InterestedCycles;
