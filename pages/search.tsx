import { BiArrowBack } from 'react-icons/bi';
import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {QueryClient, dehydrate} from 'react-query';
import { Spinner, ButtonGroup, Button, Form } from 'react-bootstrap';
import {getPosts} from '@/src/usePosts'
import {getWorks} from '@/src/useWorks'
import {getCycles} from '@/src/useCycles'

import SearchInput from '@/components/SearchInput';

import SearchTab from '@/src/components/SearchTab';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { PostMosaicItem } from '@/src/types/post';
import { WorkMosaicItem } from '@/src/types/work';
import { CycleMosaicItem } from '@/src/types/cycle';

const take=8;
interface Props {
  postsData:{total:number,fetched:number,posts:PostMosaicItem[]};
  worksData:{total:number,fetched:number,works:WorkMosaicItem[]};
  cyclesData:{total:number,fetched:number,cycles:CycleMosaicItem[]};
}
const SearchPage: NextPage<Props> = ({postsData,worksData,cyclesData}) => {//TODO sacar estos props a favor de react-query dehydratedState
  const { t } = useTranslation('common');
  const router = useRouter();

  let qLabel = t(`topics:${router.query.q as string}`);
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
        <div className='d-flex flex-column justify-content-center'>
          <SearchTab postsData={postsData} worksData={worksData} cyclesData={cyclesData} />
        </div>
       
      </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q;
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

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
  
  return {
    props: {
      postsData,
      worksData,
      cyclesData,
      // dehydratedState: dehydrate(qc), TODO esto hay q reactivarlo 
    },
  };
};

export default SearchPage;
