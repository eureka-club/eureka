// import { flatten, zip } from 'lodash';
import { useAtom } from 'jotai';
import { BiArrowBack } from 'react-icons/bi';
import { NextPage,GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
// import { QueryClient } from 'react-query';
// import { dehydrate } from 'react-query/hydration';
// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
import { Spinner, ButtonGroup, Button, Alert } from 'react-bootstrap';
import globalSearchEngineAtom from '../src/atoms/searchEngine';

import { CycleMosaicItem } from '../src/types/cycle';
import { WorkMosaicItem } from '../src/types/work';
import { PostMosaicItem } from '../src/types/post';
import { UserMosaicItem } from '../src/types/user';

// import styles from './index.module.css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
// import { findAll as findAllCycles } from '../src/facades/cycle';
// import { findAll as findAllWorks } from '../src/facades/work';
import Mosaic from '../src/components/Mosaic';
// import SearchEngine from '../src/components/SearchEngine';
import FilterEngine from '../src/components/FilterEngine';
import useItems,{getRecords} from '../src/useItems';
import useCountries from '../src/useCountries';
import { isPostMosaicItem,isCycleMosaicItem, isWorkMosaicItem, SearchResult } from '@/src/types';
import { useQueryClient,dehydrate, QueryClient } from 'react-query';
import ListWindow from '@/src/components/ListWindow';
import { getRecord } from '@/src/useNotifications';

// interface Props {
//   homepageMosaicData: (CycleMosaicItem | WorkMosaicItem)[];
// }
// const getWorks = async () => {
//   const res = await fetch('/api/work/');
//   return res.json();
// };
// const getCycles = async () => {
//   const res = await fetch('/api/cycle/');
//   return res.json();
// };

// const getRecords = async (type: string, where?: string) => {
//   const res = await fetch(`/api/${type}${where ? `?where=${where}` : ''}`);
//   const result = await res.json();
//   type ItemType =
//     | (CycleMosaicItem & { TYPE: string })
//     | (WorkMosaicItem & { TYPE: string })
//     | (PostMosaicItem & { TYPE: string });
//   const subTypeFn = (i: ItemType) => {
//     return 'type' in i ? `-${i.type}` : '';
//   };
//   result.data.forEach((i: ItemType, k: string) => {
//     // result.data[k] = { ...i, TYPE: `${type}${subTypeFn(i)}` };
//     result.data[k] = { ...i, TYPE: `${type}` };
//   });
//   return result;
// };

const SearchPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [q, setQ] = useState<string>();
  const [where, setWhere] = useState<string>();
  const queryClient = useQueryClient()
  
  const [mounted,setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
    setGlobalSearchEngineState((res) => ({...res, only:[]}));
  }, []);

  useEffect(()=>{
    if(router.query.q){
      setQ(router.query.q as string);      
    }
  },[router]);

  useEffect(()=>{
    if(q){
      let w = "";
      if (router.query.fields) {
        const fields = (router.query.fields as string).split(',');
        w = encodeURIComponent(
          JSON.stringify({
            
              OR: fields.map((f:string) => ({ [`${f}`]: { contains: q}})),          

            
          })
        );
      }
      else {
        w = encodeURIComponent(
        JSON.stringify({
          
            OR: [
              { topics: { contains: q } },
              { title: { contains: q } }, 
              { contentText: { contains: q } },              
            ],

          
          }),
        );
      }
      setWhere(w);
    }
      

  },[q, router.query.fields]);

  

  // let where = encodeURIComponent(JSON.stringify({ title: { contains: globalSearchEngineState.q } }));
  // const { isLoading, data: works } = useWorks(where);

  // where = encodeURIComponent(JSON.stringify({ title: { contains: globalSearchEngineState.q } }));
  // const { isLoading: isLoadingCycles, data: cycles } = useCycles(where);

  // const [where, setWhere] = useState('');
  // const [tempWhere, setTempWhere] = useState('');
  const { isLoading, data: items, error } = useItems(q, ["ITEMS", q!], {
    enabled: !!where && !globalSearchEngineState.itemsFound?.length
  });
  // const { isLoading, /* isError, error, */ data: works } = useWorks();
  // const { isLoading: isLoadingCycles, /* isError: isErrorCycles, error: errorCycles, */ data: cycles } = useCycles();
  const { data: onlyByCountriesAux } = useCountries();

  
  const [homepageMosaicData, setHomepageMosaicData] = useState<SearchResult[]>([]);

  useEffect(() => {
    if(items){
      // items.forEach((i)=>{
      //   if(isCycleMosaicItem(i))
      //     queryClient.setQueryData(['CYCLE',`${i.id}`],i as CycleMosaicItem)
      //   else if(isWorkMosaicItem(i))
      //     queryClient.setQueryData(['WORK',`${i.id}`],i as WorkMosaicItem)
      //   else if(isPostMosaicItem(i))
      //     queryClient.setQueryData(['POST',`${i.id}`],i as PostMosaicItem)
      // })
    }
    if (globalSearchEngineState.itemsFound && globalSearchEngineState.itemsFound.length) {
      setHomepageMosaicData(globalSearchEngineState.itemsFound);
    }
    // else if (works || cycles /* || posts */) {
    //   const w = works ? ('length' in works ? works : [works]) : [];
    //   const c = cycles ? ('length' in cycles ? cycles : [cycles]) : [];
    //   // const p = posts ? posts.data : [];
    //   const res = [...(w as WorkMosaicItem[]), ...c /* , ...p */];
    //   setHomepageMosaicData(res);
    // }
    else if (items) {
      setHomepageMosaicData(items);
    }
  }, [items /* works, cycles  , posts */, globalSearchEngineState.itemsFound]);

  /* type FilterWhere = {
    where: {
      OR: {
        title: { contains: string };
        contentText: { contains: string };
      };
    };
  };

  type Filter = {
    [index: string]: Array<string> | FilterWhere | undefined;
    only?: Array<string>;
    cycle?: FilterWhere;
    work?: FilterWhere;
  }; */

  const [homepageMosaicDataFiltered, setHomepageMosaicDataFiltered] = useState<SearchResult[]>([]);

  useEffect(() => {
    setGlobalSearchEngineState((res) => ({
      ...res,
      onlyByCountries: onlyByCountriesAux,
    }));
  }, [onlyByCountriesAux]);

  useEffect(() => {
    if (homepageMosaicData) {
      const { only, onlyByCountries } = globalSearchEngineState;
      let filtered = null;
      // if (q) {
      //   const whereAux = encodeURIComponent(JSON.stringify({ title: { contains: globalSearchEngineState.q } }));
      //   setTempWhere(whereAux);
      // }
      if (only.length) {
        filtered = homepageMosaicData.filter((i) => {
          if (i.type) return only.includes(i.type);
          return false;
        });
        setHomepageMosaicDataFiltered([...filtered]);
      }
      if (onlyByCountries && onlyByCountries.length) {
        filtered = (filtered || homepageMosaicData).filter((i) => {
          if (i.type !== 'cycle')
            return (
              onlyByCountries.includes((i as WorkMosaicItem).countryOfOrigin as string) ||
              onlyByCountries.includes((i as WorkMosaicItem).countryOfOrigin2 as string)
            );
          return false;
        });
        setHomepageMosaicDataFiltered([...filtered]);
      }
      if (!filtered) {
        setHomepageMosaicDataFiltered([...homepageMosaicData]);
      }
    }
  }, [homepageMosaicData, globalSearchEngineState]);

  // useEffect(() => {
  //   if (globalSearchEngineState.q) {
  //     const { q } = globalSearchEngineState;
  //     const where = JSON.stringify({ title: { contains: q } });
  //     setGlobalSearchEngineState({ ...globalSearchEngineState, where });
  //   }
  // }, [globalSearchEngineState]);

  const genLoadingCmp = (): ReactElement => {
    if (isLoading) return <Spinner animation="grow" role="status" />;
    return <span>{`${''}`}</span>;
  };
  let qLabel = t(`topics:${router.query.q as string}`);
  if (qLabel.match(':')) qLabel = router.query.q as string;

  const renderErrorMessage = () => {
    let e = "";
    if (!isLoading){
      if(error) e = t(error?.message, null, {fallback:"common:Error"});
      else if(!globalSearchEngineState.itemsFound?.length && (!items || !items?.length))
        e = t('notFound');
    } 
    if(e)     
    return (
      <Alert variant="warning">
        <p>{e}</p>
      </Alert>
    );
    return <></>;
  };
  if(mounted)
    return (
      <SimpleLayout title={t('browserTitleWelcome')}>
        <ButtonGroup className="mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
        <h1 className="text-secondary fw-bold mb-2">
          {t('Results about')}: {`"${qLabel}"`}
        </h1>
        <FilterEngine key={router.asPath} />
        <div className='d-flex flex-column justify-content-center'>
        {(
          !isLoading 
          && <>
          <div className='d-none d-md-block'><ListWindow cacheKey={["ITEMS", q!]} items={homepageMosaicDataFiltered} itemsByRow={4} /></div>
          <div className='d-block d-md-none'><ListWindow cacheKey={["ITEMS", q!]} items={homepageMosaicDataFiltered} itemsByRow={1} /></div>
          </>
          ) 
          || <></>
        }
        </div>
        {genLoadingCmp()}
        {renderErrorMessage()}
      </SimpleLayout>
    );
  return <></>
};

/* export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['ITEMS', 'gender-feminisms0'], () => getRecords());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 //revalidate every 1 min
  };
};
*/
export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const q = query.q;
  const qc = new QueryClient()
  await qc.prefetchQuery(["ITEMS",q],()=>getRecords(q?.toString()))
  return {
    props: {
      dehydratedState:dehydrate(qc),
    },
  };
};

export default SearchPage;
