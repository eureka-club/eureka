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
interface Props{
  hasCycles:boolean;
  hasPosts:boolean;
  hasWorks:boolean;
}
const SearchPage: NextPage<Props> = ({hasCycles,hasPosts,hasWorks}) => {
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
          {t('Results about')}: {`"${t("topics:" + qLabel,{ count: 1 }, { default: qLabel })}"`} 
        </h1>
        { (hasCycles||  hasPosts || hasWorks) ? 
        <div className='d-flex flex-column justify-content-center'>
        <SearchTab {...{hasCycles,hasPosts,hasWorks}}  />
        </div> 
         :
        <>
        <Alert className='mt-4' variant="primary">
        <Alert.Heading>{t('ResultsNotFound')}</Alert.Heading>
      </Alert>
        </>
         } 
       
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
  const hasCycles = cyclesData.total > 0

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
  const hasPosts = postsData.total > 0

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
  const hasWorks = worksData.total > 0

  return {
    props: {
      hasCycles,
      hasPosts,
      hasWorks,
      dehydratedState: dehydrate(qc), 
    },
  };
};

export default SearchPage;
