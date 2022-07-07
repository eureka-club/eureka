import { NextPage } from 'next';
import Head from "next/head";
import { Col, Row, Spinner } from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router'
import useMySaved from '@/src/useMySaved'
import { CycleMosaicItem } from '@/src/types/cycle';
import { PostMosaicItem } from '@/src/types/post';
import { WorkMosaicItem } from '@/src/types/work';
import { isCycleMosaicItem, isPostMosaicItem, isWorkMosaicItem } from '@/src/types';
import CMI from '@/components/cycle/MosaicItem'
import PMI from '@/components/post/MosaicItem'
import WMI from '@/components/work/MosaicItem'

interface Props{
}

const MySaved: NextPage<Props> = () => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router.push('/')
  const sfl = useMySaved(session?+session?.user.id:0)
  // const [SFL,setSFL] = useState(sfl)
  // useEffect(()=>{
  //   if(sfl)setSFL(sfl)
  // },[sfl])
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
    <article className='mt-4'>
      {
      isLoadingSession 
        ? <Spinner animation="grow"/>
        : session ? (
          <>
          <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('mySaved')}</h1>
            <Row>
              {sfl.map(c=>
                <Col key={c.id} xs={12} sm={6} lg={3}>
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
export default MySaved;
