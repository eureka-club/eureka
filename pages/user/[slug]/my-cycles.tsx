import { NextPage } from 'next';
import Head from "next/head";
import { Col, Row, Spinner } from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { GetAllByResonse } from '@/src/types';

import useMyCycles from '@/src/useMyCycles';
import CMI from '@/src/components/cycle/MosaicItem';
import {useRouter} from 'next/router'

interface Props{
}

const MyCycles: NextPage<Props> = () => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router.push('/')
  const {data:dataCycles} = useMyCycles(session);
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
          <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('myCycles')}</h1>
            <Row>
              {dataCycles?.cycles.map(c=>
                <Col key={c.id} xs={12} sm={6} lg={3}>
                  <CMI cycleId={c.id} />
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
export default MyCycles;
