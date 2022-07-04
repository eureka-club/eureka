import { BiArrowBack } from 'react-icons/bi';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spinner, ButtonGroup, Button, Alert } from 'react-bootstrap';


import SearchTab from '@/src/components/SearchTab';
import SimpleLayout from '../src/components/layouts/SimpleLayout';

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

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const q = query.q;
//   const qc = new QueryClient()
//   if(q){
//     await qc.prefetchQuery(["POSTS", q], () => getPosts({q:q?.toString(),props:{take}}));
//     await qc.prefetchQuery(["WORKS", q], () => getWorks({q:q?.toString(),props:{take}}));
//     await qc.prefetchQuery(["CYCLES", q], () => getCycles({q:q?.toString(),props:{take:2}}));
//   }
  
//   return {
//     props: {
//       dehydratedState: dehydrate(qc),
//     },
//   };
// };

export default SearchPage;
