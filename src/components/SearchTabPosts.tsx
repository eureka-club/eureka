import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row,Tab, Col} from 'react-bootstrap';

import MosaicItem from '@/components/post/MosaicItem'

import usePosts,{getPosts} from '@/src/usePosts'

import useFilterEnginePosts from './useFilterEnginePosts';
import { useInView } from 'react-intersection-observer';
interface Props{
    
}
const take = 8;
const SearchTabPosts: FunctionComponent<Props> = () => {console.log("mounted tab posts")
  const { t } = useTranslation('common');
  const router = useRouter();

  const {FilterEngineWorks,filtersChecked} = useFilterEnginePosts()

  const {data:{posts:p,fetched,total}={posts:[],fetched:0,total:0}} = usePosts({q:router.query.q?.toString()!,props:{take}},{enabled:!!router.query?.q});
  const [posts,setPosts] = useState(p)

  const [refWorks, inViewPosts] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(inViewPosts && router && posts.length && fetched){
      const fi = async ()=>{
        const {id} = posts.slice(-1)[0]
        const r = await getPosts({q:router.query.q?.toString()!,props:{skip:1,cursor:{id},take}});
        setPosts(p=>[...p,...r.posts])
      }
      if(fetched)
        fi()

    }
  },[inViewPosts])

  const renderPosts=()=>{
    if(posts)
      return <div>
        <FilterEngineWorks/>
        <Row>
            {posts.map(p=><Col className="mb-3" key={p.id}><MosaicItem postId={p.id} cacheKey={['POST',p.id.toString()]}  /></Col>)}
      </Row>
      {posts?.length!=total && <Spinner ref={refWorks} animation="grow" />}
      </div>
      return ''
  }

  return <div>
  {renderPosts()}
  </div>
};
export default SearchTabPosts;
