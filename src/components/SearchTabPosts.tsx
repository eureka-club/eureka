import { useState, FunctionComponent, useEffect, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import MosaicItem from '@/src/components/post/MosaicItem'
import useFilterEnginePosts from './useFilterEnginePosts';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { PostSumary } from '../types/post';
import usePostsSumary, { getPostsSumary } from '../usePostsSumary';
import { useSession } from 'next-auth/react';
import { Alert, Box } from '@mui/material';
import Masonry from '@mui/lab/Masonry';

const take = 8;
const SearchTabCycles:FunctionComponent = () => {
  const {data:session}=useSession();
  const { t,lang } = useTranslation('common');
  const router = useRouter();
  const terms = router?.query.q?.toString()!.split(" ") || [];
  const {FilterEnginePosts,filtersCountries} = useFilterEnginePosts()

  const getProps = ()=>{
    const res:Prisma.PostWhereInput = {
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
      ],
    }
    if(filtersCountries && filtersCountries.length){
      res.AND = {
        creator:{
          countryOfOrigin:{
            in:filtersCountries
          }
        }
      }
    }
    return res;
  };

  const [props,setProps]=useState<Prisma.PostFindManyArgs>({take,where:{...getProps()}})
  const cacheKey = useMemo(()=>[`posts-search-${JSON.stringify(props)}`],[props])

  const {data:{total,fetched,posts:c}={total:0,fetched:0,posts:[]},isLoading} = usePostsSumary(props,{cacheKey,enabled:!!router.query?.q});
  const [posts,setPosts] = useState<PostSumary[]>([])
  
  useEffect(()=>{

    let props: Prisma.PostWhereInput|undefined = undefined;
    if(router.query.q && (filtersCountries)){
      props = getProps();
    }
    if(props){
      setProps(s=>({...s,where:{...props}}))
    }
  },[filtersCountries,router.query.q])

  useEffect(()=>{
    if(c)setPosts(c)
  },[c])

  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(posts && inView && posts.length < total){
      const fi = async ()=>{
        const {id} = posts.slice(-1)[0]
        const r = await getPostsSumary(session?.user.id!,lang,{...props,skip:1,cursor:{id}});
        setPosts((c: any)=>[...c,...r.posts])
      }
      fi()
    }
  },[inView])

  return <>
  {
    !isLoading&&!posts?.length
      ? <Alert severity="warning">{t('Not Found')}</Alert>
      : <>
        <FilterEnginePosts/>
      </>
  }
    {/* {
      posts?.length==0
        ? <Alert>{t('common:ResultsNotFound')}</Alert>
        : <></>
    } */}
      {/* <MosaicsGrid isLoading={isLoading}>
          {posts?.map(p=>
            <Box key={p.id}>
              <MosaicContext.Provider value={{ showShare: false }}>
                <MosaicItem  post={p} postId={p.id} className="" imageLink={true} cacheKey={['POST',p.id.toString()]} size={'md'} />
              </MosaicContext.Provider>
            </Box>
          )}
          
    </MosaicsGrid> */}
    <Masonry columns={{xs:1,sm:3,md:3,lg:4}} spacing={1}>
      {posts?.map(p=>
              <Box key={p.id}>
                  <MosaicItem postId={p.id} 
                    sx={{
                      'img':{
                        width:'100%',
                        height:'auto',
                      }
                    }} 
                  />
              </Box>
      )}
    </Masonry>
    <Box sx={{padding:'1rem'}}>
      {posts?.length!=total && <hr ref={ref}/>}
      {/* {posts?.length!=total && <CircularProgress ref={ref} />} */}

    </Box>
  </>
};
export default SearchTabCycles;