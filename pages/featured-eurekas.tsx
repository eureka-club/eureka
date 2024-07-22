import { GetServerSideProps,NextPage } from 'next';
import Head from "next/head";
import { Col, Row } from 'react-bootstrap';
import { dehydrate, QueryClient } from 'react-query';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import useTranslation from 'next-translate/useTranslation';
import {getbackOfficeData} from '@/src/useBackOffice'
import useFeaturedEurekas,{ getFeaturedEurekas } from '@/src/useFeaturedEurekas';
import PMI from '@/src/components/post/MosaicItem';
import {useRouter} from 'next/router'
import { getSession } from 'next-auth/react';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import { Grid} from '@mui/material';

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
    <ButtonsTopActions/>
    <article className='mt-4' data-cy="my-cycles">

        <>
          <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('Featured Eurekas')}</h1>
            <Grid  container spacing={4} direction="row" justifyContent="center" alignItems="center"
                      alignContent={'center'}>
              {dataCycles?.posts.map(c=>
                <Grid item justifyContent="center" alignItems="center"
                alignContent={'center'} key={c.id}>
                  <PMI postId={c.id} />
                </Grid>
              )}
            </Grid>
            </>

          </article>
    </SimpleLayout>
  </>
};
export const getServerSideProps:GetServerSideProps= async (ctx)=>{
  const session = await getSession(ctx);
  const qc = new QueryClient();
  const {NEXT_PUBLIC_WEBAPP_URL:origin}=process.env;
  
  const bod = await getbackOfficeData(ctx.locale!)
  if(bod && bod?.CyclesExplorePage){
    const ids = bod?.CyclesExplorePage.split('').map(i=>+i)
    await qc.fetchQuery(['CYCLES','INTERESTED'],()=>getFeaturedEurekas(session?.user.id!,ctx.locale!,ids,8));
  }
  return {
    props:{
      session,
      dehydrateState:dehydrate(qc)
    }
  };
}

export default InterestedCycles;
