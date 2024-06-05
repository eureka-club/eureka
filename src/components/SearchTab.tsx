import React, { useState, FunctionComponent,useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import SearchTabWorks from './SearchTabWorks';
import SearchTabPosts from './SearchTabPosts';
import SearchTabCycles from './SearchTabCycles';
import { TabPanelSwipeableViews } from './common/TabPanelSwipeableViews';

interface Props{
  hasCycles:boolean;
  hasPosts:boolean;
  hasWorks:boolean;
}

const SearchTab: FunctionComponent<Props> = ({hasCycles,hasPosts,hasWorks}) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const[indexActive,setindexActive]=useState(hasCycles 
    ? 0 
    : hasPosts
      ? 1
      : 2);
  

  const [key, setKey] = useState<string>('cycles');

  useEffect(()=>{
    setKey(
      hasCycles 
      ? 'cycles'
      : hasPosts ? 'posts' : 'works'
    );
    
  },[hasCycles,hasPosts,hasWorks]);

  useEffect(()=>{
    setindexActive(hasCycles 
      ? 0 
      : hasPosts
        ? 1
        : 2);
  },[router.query.q])

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
          ? <TabPanelSwipeableViews
            indexActive={indexActive}
            items={[
              {
                label:t('cycles'),
                content:<SearchTabCycles />
              },
              {
                label:t('posts'),
                content:<SearchTabPosts />
              },
              {
                label:t('works'),
                content:<SearchTabWorks />
              }
            ]}
          />
          // ? <TabPanelBasic
          //   items={[
          //     {
          //       label:t('cycles'),
          //       content:<SearchTabCycles />
          //     },
          //     {
          //       label:t('posts'),
          //       content:<SearchTabPosts />
          //     },
          //     {
          //       label:t('works'),
          //       content:<SearchTabWorks />
          //     },
              
          //   ]}
          // />
          // ? <Tabs  
          //     defaultActiveKey={key}
          //     activeKey={key}
          //     onSelect={(k) => setKey(k!)}
          //     className="mt-5"
          //   >
             
          //     {hasCycles ? <Tab eventKey="cycles" data-cy="tab-cycles" title={t('cycles')}  className={`cursor-pointer`}>
          //           <SearchTabCycles />
          //     </Tab> : <></>}
          //     {hasPosts ? <Tab eventKey="posts" data-cy="tab-posts" title={t('posts')} className={`cursor-pointer`}>
          //       <SearchTabPosts />
          //     </Tab> : <></>}
          //     {hasWorks ? <Tab eventKey="works" data-cy="tab-works" title={t('works')} className={`cursor-pointer`}>
          //       <SearchTabWorks />
          //     </Tab>:<></>}
          //   </Tabs>
          :<></>
        }
  </div>
};
export default SearchTab;
