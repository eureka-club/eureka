import { BiArrowBack } from 'react-icons/bi';
import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {QueryClient, dehydrate} from 'react-query';
import { Spinner, ButtonGroup, Button, Alert } from 'react-bootstrap';
import {getPosts} from '@/src/usePosts'
import {getWorks} from '@/src/useWorks'
import {getCycles} from '@/src/useCycles'


import SearchTab from '@/src/components/SearchTab';
import SimpleLayout from '../src/components/layouts/SimpleLayout';

const take=8;
const SearchPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  // const [q, setQ] = useState<string>(router.query.q?.toString()!);

  let qLabel = t(`topics:${router.query.q as string}`);
  if (qLabel.match(':')) qLabel = router.query.q as string;
  
  // useEffect(() => {
  //   if (router.query.q) {
  //     setQ(router.query.q as string);
  //   }
  // }, [router]);

  return <SimpleLayout title={t('Results')}>
        <ButtonGroup className="mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
        <h1 className="text-secondary fw-bold mb-2">
          {t('Results about')}: {`"${qLabel}"`}
        </h1>
        <div className='d-flex flex-column justify-content-center'>
          <SearchTab />
        </div>
       
      </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q;
  const qc = new QueryClient()
  if(q){
    await qc.prefetchQuery(["POSTS", q], () => getPosts({q:q?.toString(),props:{take}}));
    await qc.prefetchQuery(["WORKS", q], () => getWorks({q:q?.toString(),props:{take}}));
    
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
    await qc.prefetchQuery(["CYCLES", q], () => getCycles({...cyclesProps,take}));
  }
  
  return {
    props: {
      dehydratedState: dehydrate(qc),
    },
  };
};

export default SearchPage;
