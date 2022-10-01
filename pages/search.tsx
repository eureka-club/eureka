import { BiArrowBack } from 'react-icons/bi';
import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {QueryClient, dehydrate} from 'react-query';
import { Spinner, ButtonGroup, Button, Form, Alert } from 'react-bootstrap';
import {getPosts} from '@/src/usePosts'
import {getWorks} from '@/src/useWorks'
import {getCycles} from '@/src/useCycles'

import SearchInput from '@/components/SearchInput';

import SearchTab from '@/src/components/SearchTab';
import SimpleLayout from '../src/components/layouts/SimpleLayout';

const take=8;
const SearchPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();


  let qLabel = `${router.query.q as string}`;
  if (qLabel.match(':')) qLabel = router.query.q as string;

  const onTermKeyUp = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.code == 'Enter'){
      router.push(`/search?q=${e.currentTarget.value}`)
    }
  }

  return <SimpleLayout title={t('Results')}>
        <ButtonGroup className="mb-1"> 
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
        {/* <SearchInput className="" /> */}

        <h1 className="text-secondary fw-bold mb-2">
          {t('Results about')}: {`"${qLabel}"`}
        </h1>
        {/* { (postsData.posts.length ||  worksData.works.length || cyclesData.cycles.length) ? */}
        <div className='d-flex flex-column justify-content-center'>
          <SearchTab  />
        </div> 
        {/* :
        <>
        <Alert className='mt-4' variant="primary">
        <Alert.Heading>{t('ResultsNotFound')}</Alert.Heading>
      </Alert>
        </>
         } */}
       
      </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q;
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL
  const qc = new QueryClient()
  const terms = q?.toString()!.split(" ") || [];
  const cyclesProps = {
    where:{
      OR:[
        {
          AND:terms.map(t=>(
            { 
              title: { contains: t } 
            }
          ))

        },
        {
          AND:terms.map(t=>(
            { 
              contentText: { contains: t } 
            }
          ))

        },
        {
          AND:terms.map(t=>(
            { 
              tags: { contains: t } 
            }
          ))
        },
        {
          AND:terms.map(t=>(
            { 
              topics: { contains: t } 
            }
          ))
        }
      ]
    },
  }
  const cyclesData = await getCycles({...cyclesProps,take},origin);
  qc.prefetchQuery(['CYCLES',JSON.stringify(cyclesProps)],()=>cyclesData)

  const postsProps = {
    where:{
      OR:[
        {
          AND:terms.map(t=>(
            { 
              title: { contains: t } 
            }
          ))

        },
        {
          AND:terms.map(t=>(
            { 
              contentText: { contains: t } 
            }
          ))

        },
        {
          AND:terms.map(t=>(
            { 
              tags: { contains: t } 
            }
          ))
        },
        {
          AND:terms.map(t=>(
            { 
              topics: { contains: t } 
            }
          ))
        }
      ]
    },
  }
  const postsData = await getPosts({...postsProps,take},origin);
  qc.prefetchQuery(['POSTS',JSON.stringify(postsProps)],()=>postsData)

  const worksProps = {
    where:{
      OR:[
        {
          AND:terms.map(t=>(
            { 
              title: { contains: t } 
            }
          ))

        },
        {
          AND:terms.map(t=>(
            { 
              contentText: { contains: t } 
            }
          ))

        },
        {
          AND:terms.map(t=>(
            { 
              tags: { contains: t } 
            }
          ))
        },
        {
          AND:terms.map(t=>(
            { 
              topics: { contains: t } 
            }
          ))
        }
      ]
    },
  }
  const worksData = await getWorks({...worksProps,take},origin);
  qc.prefetchQuery(['WORK',JSON.stringify(worksProps)],()=>worksData)

  return {
    props: {
      dehydratedState: dehydrate(qc), 
    },
  };
};

export default SearchPage;
