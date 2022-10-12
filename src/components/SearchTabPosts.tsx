import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner,Row, Col, Tab} from 'react-bootstrap';

import MosaicItem from '@/components/post/MosaicItem'
import usePosts,{getPosts} from '@/src/usePosts'

import useFilterEnginePosts from './useFilterEnginePosts';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { PostMosaicItem } from '../types/post';

const take = 8;
const SearchTabCycles:FunctionComponent = () => {
  const { t } = useTranslation('common');
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

  const {data:{total,fetched,posts:c}={total:0,fetched:0,posts:[]}} = usePosts(props,{enabled:!!router.query?.q});
  const [posts,setPosts] = useState<PostMosaicItem[]>([])
  
  useEffect(()=>{
    let props: Prisma.PostWhereInput|undefined = undefined;
    if(router.query.q && (filtersCountries)){
      props = getProps();
    }
    if(props)
      setProps(s=>({...s,where:{...props}}))
  },[filtersCountries,router.query.q])

  useEffect(()=>{
    if(c)setPosts(c)
  },[c])

  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(inView && posts.length < total){
      const fi = async ()=>{
        const {id} = posts.slice(-1)[0]
        const r = await getPosts({...props,skip:1,cursor:{id}});
        setPosts((c: any)=>[...c,...r.posts])
      }
      fi()
    }
  },[inView])

  const renderPosts=()=>{
    if(posts)
      return       <>

          <FilterEnginePosts/>
          <Row>
              {posts.map(p=><Col xs={12} sm={6} lg={3} className="mb-3 d-flex justify-content-center  align-items-center" key={p.id}><MosaicItem postId={p.id} cacheKey={['POST',p.id.toString()]}  /></Col>)}
        </Row>
        {posts?.length!=total && <Spinner ref={ref} animation="grow" />}
      </>
      return <></>
  }

  return renderPosts()
};
export default SearchTabCycles;