import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row ,Tabs,Tab, Col} from 'react-bootstrap';

import PMI from '@/components/post/MosaicItem'
import WMI from '@/components/work/MosaicItem'
import CMI from '@/components/cycle/MosaicItem'

import { QueryClient, dehydrate } from 'react-query';

import usePosts,{getPosts} from '@/src/usePosts'
import useCycles,{getCycles} from '@/src/useCycles'
import useWorks,{getWorks} from '@/src/useWorks'


import { useInView } from 'react-intersection-observer';
interface Props{
    
}
const take = 8;
const SearchTab: FunctionComponent<Props> = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [key, setKey] = useState<string>('posts');

  const {data:postsData} = usePosts({q:router.query.q?.toString()!,props:{take}},{enabled:!!router.query?.q});
  const [posts,setPosts] = useState(postsData?.posts||[])
  useEffect(()=>{
    if(postsData)setPosts(postsData.posts)
  },[postsData])

  const {data:worksData} = useWorks({q:router.query.q?.toString()!,props:{take}},{enabled:!!router.query?.q});
  const [works,setWorks] = useState(worksData?.works||[])
  useEffect(()=>{
    if(worksData)setWorks(worksData.works)
  },[worksData])


  const {data:cyclesData} = useCycles({q:router.query.q?.toString()!,props:{take}},{enabled:!!router.query?.q});
  const [cycles,setCycles] = useState(cyclesData?.cycles||[])
  useEffect(()=>{
    if(cyclesData)setCycles(cyclesData.cycles)
  },[cyclesData])


  const [refPosts, inViewPosts] = useInView({
    triggerOnce: false,
  });

  const [refWorks, inViewWorks] = useInView({
    triggerOnce: false,
  });

  const [refCycles, inViewCycles] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(inViewPosts && router && posts.length && postsData?.fetched){
      const fi = async ()=>{
        const {id} = posts.slice(-1)[0]
        const r = await getPosts({q:router.query.q?.toString()!,props:{skip:1,cursor:{id},take}});
        setPosts(p=>[...p,...r.posts])
      }
      if(postsData?.fetched)
        fi()

    }
  },[inViewPosts])

  useEffect(()=>{
    if(inViewWorks && router && works.length && worksData?.fetched){
      const fi = async ()=>{
        const {id} = works.slice(-1)[0]
        const r = await getWorks({q:router.query.q?.toString()!,props:{skip:1,cursor:{id},take}});
        setWorks(p=>[...p,...r.works])
      }
      if(worksData?.fetched)
        fi()

    }
  },[inViewWorks])

  useEffect(()=>{
    if(inViewCycles && router && cycles.length && cyclesData?.fetched){
      const fi = async ()=>{
        const {id} = cycles.slice(-1)[0]
        const r = await getCycles({q:router.query.q?.toString()!,props:{skip:1,cursor:{id},take}});
        setCycles(p=>[...p,...r.cycles])
      }
      if(cyclesData?.fetched)
        fi()

    }
  },[inViewCycles])

  const renderPosts=()=>{console.log(postsData?.fetched)
    if(posts)
      return <div>
        <Row>
            {posts.map(p=><Col className="mb-3" key={p.id}><PMI postId={p.id} cacheKey={['POST',p.id.toString()]}  /></Col>)}
      </Row>
      {posts?.length!=postsData?.total && <Spinner ref={refPosts} animation="grow" />}
      </div>
      return ''
  }
  const renderWorks=()=>{console.log(worksData?.fetched)
    if(works)
      return <div>
        <Row>
            {works.map(p=><Col className="mb-3" key={p.id}><WMI workId={p.id} cacheKey={['WORK',p.id.toString()]}  /></Col>)}
      </Row>
      {works?.length!=worksData?.total && <Spinner ref={refWorks} animation="grow" />}
      </div>
      return ''
  }
  const renderCycles=()=>{
    return cycles ? <Row>
        {cycles.map(p=><Col className="mb-3" key={p.id}><CMI cycleId={p.id} cacheKey={['CYCLE',p.id.toString()]}  /></Col>)}
    </Row> : ''
  }

  const renderTab = (k:string)=>{
    switch(k){
      case 'posts':
        return renderPosts()
      case 'works':
          return renderWorks()
      case 'cycles':
        return renderCycles()
    }
    return ''
  }
  return <div>
    {/* language=CSS */}
    <style jsx global>
                  {`
                    .nav-tabs .nav-item.show .nav-link,
                    .nav-tabs .nav-link.active,
                    .nav-tabs .nav-link:hover {
                      background-color: var(--bs-primary);
                      color: white !important;
                      border: none !important;
                      border-bottom: solid 2px var(--bs-primary) !important;
                    }
                    .nav-tabs {
                      border: none !important;
                      border-bottom: solid 1px var(--bs-primary) !important;
                    }
                    .nav-link{
                        color:var(--bs-primary)
                    }
                  `}
                </style>
        <Tabs  activeKey={key}
                onSelect={(k) => setKey(k!)}
                className="my-5"
            >
                <Tab eventKey="posts" title={t('posts')} className={`cursor-pointer`}>
                    {renderTab("posts")}
                </Tab>
                <Tab eventKey="works" title={t('works')} className={`cursor-pointer`}>
                    {renderTab("works")}
                </Tab>
                <Tab eventKey="cycles" title={t('cycles')} className={`cursor-pointer`}>
                    {renderTab("cycles")}
                </Tab>
            </Tabs>
  </div>
};
export default SearchTab;
