import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row,Tab, Col} from 'react-bootstrap';

import MosaicItem from '@/components/post/MosaicItem'

import {getPosts} from '@/src/usePosts'

// import useFilterEnginePosts from './useFilterEnginePosts';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { PostMosaicItem } from '../types/post';
interface Props {
  postsData:{total:number,fetched:number,posts:PostMosaicItem[]};
}
const take = 8;
const SearchTabPosts: FunctionComponent<Props> = ({postsData}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const terms = router?.query.q?.toString()!.split(" ") || [];
  
  const baseProps = (terms:string[])=>{
    return {
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
    }
  };

  const [props,setProps]=useState<Prisma.PostFindManyArgs>({take,where:{...baseProps(terms)}})
  // const {data:{total,fetched,posts:c}={total:0,fetched:0,posts:[]}} = usePosts(props,{enabled:!!router.query?.q});
  const [posts,setPosts] = useState<PostMosaicItem[]>([])
  const {total,fetched} = postsData;
  useEffect(()=>{
    if(postsData.posts)setPosts(postsData.posts)
  },[postsData.posts])

  useEffect(()=>{
    if(router.query.q){
      const terms = router?.query.q?.toString()!.split(" ") || [];
      setProps(()=>({take,where:{...baseProps(terms)}}))
    }
  },[router.query.q])

  const [refPosts, inViewCycles] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(inViewCycles && posts.length<total){
      const fi = async ()=>{
        const {id} = posts.slice(-1)[0]
        const r = await getPosts({...props,skip:1,cursor:{id}});
        setPosts((c: any)=>[...c,...r.posts])
      }
      fi()
    }
  },[inViewCycles])

  const renderPosts=()=>{
    if(posts)
      return <div>
        {/* <FilterEngineCycles/> */}
        <Row>
            {posts.map(p=><Col xs={12} sm={6} lg={3} className="mb-3 d-flex justify-content-center  align-items-center" key={p.id}><MosaicItem postId={p.id} cacheKey={['POST',p.id.toString()]}  /></Col>)}
      </Row>
      {posts.length<total && <Spinner ref={refPosts} animation="grow" />}
      </div>
      return ''
  }

  return <div>
  {renderPosts()}
  </div>
};
export default SearchTabPosts;
