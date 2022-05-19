import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Button, Spinner } from 'react-bootstrap';

import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { v4 } from 'uuid';
import { QueryClient, dehydrate } from 'react-query';

import useWorks, { getWorks } from '@/src/useWorks';
import { useInView } from 'react-intersection-observer';
import { WorkMosaicItem } from '@/src/types/work';

const IndexPage: NextPage = () => {
  
  const { ref, inView, entry } = useInView({
    //threshold:1
  });


  const [skip,setSkip] = useState<number>();
  const [cursor,setCursor] = useState<{id:number}>();

  const {data:works,isLoading:loadingWorks} = useWorks({
    take:100,
    skip,
    cursor,
  });

  const [items,setItems] = useState<WorkMosaicItem[]>([])
  
  useEffect(()=>{
    if(works)
      setItems(p=>[...p,...works])
  },[works])

  useEffect(()=>{
    if(inView && works){
      setSkip(1);
      setCursor({id:works.slice(-1)[0].id});

    }
  },[inView])

  if(!items)return <>{''}</>

  return (<>
    
    <SimpleLayout showHeader title={'test scroll infinite'}>
      <>
        <ul>
        {items.map((w,idx)=>{
          if(idx == 99)
            return <li ref={ref} key={v4()}>{w.title}</li>
          return <li key={v4()}>{w.title}</li>

        }
        )}

        </ul>
        <Button onClick={()=>{
          setSkip(1);
          setCursor({id:items.slice(-1)[0].id});

        }}>Load 100 More</Button>
        {loadingWorks && <Spinner animation='grow' />}
      </>
    </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('WORKS', ()=>getWorks({
    take:100
  }));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),      
    },
  };
  
};


export default IndexPage;

