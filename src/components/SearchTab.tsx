import React, { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row ,Tabs,Tab, Col, Form} from 'react-bootstrap';

import SearchTabWorks from './SearchTabWorks';
import SearchTabPosts from './SearchTabPosts';
import SearchTabCycles from './SearchTabCycles';
import { PostMosaicItem } from '@/src/types/post';
import { WorkMosaicItem } from '@/src/types/work';
import { CycleMosaicItem } from '@/src/types/cycle';
import posts from 'pages/api/search/posts';


interface Props {
  postsData:{total:number,fetched:number,posts:PostMosaicItem[]};
  worksData:{total:number,fetched:number,works:WorkMosaicItem[]};
  cyclesData:{total:number,fetched:number,cycles:CycleMosaicItem[]};
}
const SearchTab: FunctionComponent<Props> = ({postsData,worksData,cyclesData}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [key, setKey] = useState<string>('cycles');

  useEffect(()=>{
    const k = cyclesData.fetched 
    ? 'cycles' 
    : postsData.fetched ? 'posts' : 'works'
    setKey(k)
  },[postsData,worksData,cyclesData]);// :-(

  const renderTab = (k:string)=>{
    switch(k){
      case 'posts':
        return <SearchTabPosts postsData={postsData}/>
      case 'works':
          return <SearchTabWorks worksData={worksData}/>
      case 'cycles':
        return <SearchTabCycles cyclesData={cyclesData}/>
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
                
        {router.query.q && <Tabs  defaultActiveKey={key}
        activeKey={key}
                onSelect={(k) => setKey(k!)}
                className="my-5"
            >
                {cyclesData.fetched ? <Tab eventKey="cycles" title={t('cycles')}  className={`cursor-pointer`}>
                    {renderTab("cycles")}
                </Tab>:''}
                 {postsData.fetched ? <Tab eventKey="posts" title={t('posts')} className={`cursor-pointer`}>
                    {renderTab("posts")}
                </Tab>:''}
                {worksData.fetched ? <Tab eventKey="works" title={t('works')} className={`cursor-pointer`}>
                    {renderTab("works")}
                </Tab>:''}  
                
            </Tabs>}
  </div>
};
export default SearchTab;
