import { BiArrowBack } from 'react-icons/bi';
import { NextPage, GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {QueryClient, dehydrate} from 'react-query';
import { Spinner, ButtonGroup, Button, Alert } from 'react-bootstrap';
import {getPosts} from '@/src/usePosts'
import {getWorks} from '@/src/useWorks'
import {getCycles} from '@/src/useCycles'


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
const SearchPage: NextPage<Props> = ({postsData,worksData,cyclesData}) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  let qLabel = t(`topics:${router.query.q as string}`);
  if (qLabel.match(':')) qLabel = router.query.q as string;

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
          <SearchTab postsData={postsData} worksData={worksData} cyclesData={cyclesData} />
        </div>
       
      </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q;

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
  const cyclesData = await getCycles({...cyclesProps,take});

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
  const postsData = await getPosts({...postsProps,take});

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
  const worksData = await getWorks({...worksProps,take});
  
  return {
    props: {
      postsData,
      worksData,
      cyclesData,
      // dehydratedState: dehydrate(qc),
    },
  };
};

export default SearchPage;
