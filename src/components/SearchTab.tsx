import React, { useState, FunctionComponent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Tab, Tabs} from 'react-bootstrap';

import SearchTabWorks from './SearchTabWorks';
import SearchTabPosts from './SearchTabPosts';
import SearchTabCycles from './SearchTabCycles';

const SearchTab: FunctionComponent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [key, setKey] = useState<string>('cycles');
  const [cyclesLenght,setCyclesLenght] = useState(1);

  // useEffect(()=>{
  //   const k = cyclesData.fetched 
  //   ? 'cycles' 
  //   : postsData.fetched ? 'posts' : 'works'
  //   setKey(k)
  // },[postsData,worksData,cyclesData]);// :-(

  // const renderTab = (k:string)=>{
  //   switch(k){
  //     case 'posts':
  //       return <SearchTabPosts />
  //     case 'works':
  //         return <SearchTabWorks />
  //     case 'cycles':
  //       return <SearchTabCycles />
  //   }
  //   return ''
  // }
  
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
                
        {router.query.q
          ? <Tabs  
              defaultActiveKey={key}
              activeKey={key}
              onSelect={(k) => setKey(k!)}
              className="mt-5"
            >
             
              <Tab eventKey="cycles" title={t('cycles')}  className={`cursor-pointer`}>
                    <SearchTabCycles />
              </Tab>
              <Tab eventKey="posts" title={t('posts')} className={`cursor-pointer`}>
                <SearchTabPosts />
              </Tab>
              <Tab eventKey="works" title={t('works')} className={`cursor-pointer`}>
                <SearchTabWorks />
              </Tab>
            </Tabs>
          :<></>
        }
  </div>
};
export default SearchTab;
