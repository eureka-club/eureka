import { NextPage,GetServerSideProps } from 'next';
import Head from "next/head";
import { Button, ButtonGroup, Col, Row, Spinner } from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {find} from '@/src/facades/user'
import WMI from '@/src/components/work/MosaicItem';
import {useRouter} from 'next/router'
import useUser,{getUser} from '@/src/useUser';
import { BiArrowBack } from 'react-icons/bi';
import { UserMosaicItem } from '@/src/types/user';
import {QueryClient,dehydrate} from 'react-query'

interface Props{
  id:number
}

const MyBooksMovies: NextPage<Props> = ({id}) => {
  const { t } = useTranslation('common');
  const router = useRouter()
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  if(!isLoadingSession && !session)router.push('/')
  const {data:user} = useUser(id,{enabled:!!id})
  console.log(user,'user1111')
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
    <article className='mt-4' data-cy="my-books-movies">
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
          <h1 className="text-secondary fw-bold mt-sm-0 mb-5">{t('myBooksMovies')}</h1>
            <Row>
              {user?.ratingWorks.map(c=>
                <Col key={c.workId} xs={12} sm={6} lg={3} className='mb-5'>
                  <WMI workId={c.workId!} />
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
export const getServerSideProps: GetServerSideProps = async (ctx)=>{
  let user:UserMosaicItem|null = null;
  const qc = new QueryClient()
  let id = 0
  if(ctx.query && ctx.query.slug){
    const slug = ctx.query.slug.toString()
    const li = slug.split('-').slice(-1)
    id = parseInt(li[0])
    user = await getUser(id)
    console.log(user)
    await qc.prefetchQuery(['USER',id.toString()],()=>user)
  }
  return {
    props:{
      id,
      dehydratedState: dehydrate(qc),

    }
  }
}
export default MyBooksMovies;
