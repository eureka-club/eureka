import { BiArrowBack } from 'react-icons/bi';
import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { Spinner, ButtonGroup, Button, Alert ,Tabs,Tab} from 'react-bootstrap';
import { QueryClient, dehydrate } from 'react-query';

import usePosts,{getPosts} from '@/src/usePosts'
import useCycles,{getCycles} from '@/src/useCycles'
import useWorks,{getWorks} from '@/src/useWorks'

import SearchTab from '@/src/components/SearchTab';
import SimpleLayout from '../src/components/layouts/SimpleLayout';

const SearchPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [q, setQ] = useState<string>();

  let qLabel = t(`topics:${router.query.q as string}`);
  if (qLabel.match(':')) qLabel = router.query.q as string;

  const {data:postsData} = usePosts(q?.toString(),{take:8},{enabled:!!q});
  const {data:worksData} = useWorks(q?.toString(),{take:8},{enabled:!!q});
  const {data:cyclesData} = useCycles(q?.toString(),{take:8},{enabled:!!q});

  useEffect(() => {
    if (router.query.q) {
      setQ(router.query.q as string);
    }
  }, [router]);

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
          <SearchTab initialData={{posts:postsData?.posts||[],works:worksData?.works||[],cycles:cyclesData?.cycles||[]}} />
        </div>
       
      </SimpleLayout>
  
  return <></>
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q;
  const qc = new QueryClient()


  await qc.prefetchQuery(["POSTS", q], () => getPosts(q?.toString(),{take:8}));
  await qc.prefetchQuery(["WORKS", q], () => getWorks(q?.toString(),{take:8}));
  await qc.prefetchQuery(["CYCLES", q], () => getCycles(q?.toString(),{take:8}));

  
  return {
    props: {
      dehydratedState: dehydrate(qc),
    },
  };
};

export default SearchPage;
