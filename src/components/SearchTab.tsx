import React, { useState, FunctionComponent,useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tab, Tabs} from 'react-bootstrap';

import SearchTabWorks from './SearchTabWorks';
import SearchTabPosts from './SearchTabPosts';
import SearchTabCycles from './SearchTabCycles';
import { useDictContext } from '../hooks/useDictContext';

interface Props{
  hasCycles:boolean;
  hasPosts:boolean;
  hasWorks:boolean;
}

const SearchTab: FunctionComponent<Props> = ({hasCycles,hasPosts,hasWorks}) => {
  const { t, dict } = useDictContext();
  const searchParams = useSearchParams();
  const q=searchParams?.get('q')!;
  const [key, setKey] = useState<string>('cycles');

  useEffect(()=>{
    setKey(
      hasCycles 
      ? 'cycles'
      : hasPosts ? 'posts' : 'works'
    )
  },[hasCycles,hasPosts,hasWorks]);

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
                
        {q
          ? <Tabs  
              defaultActiveKey={key}
              activeKey={key}
              onSelect={(k) => setKey(k!)}
              className="mt-5"
            >
             
              {hasCycles ? <Tab eventKey="cycles" data-cy="tab-cycles" title={t(dict,'cycles')}  className={`cursor-pointer`}>
                    <SearchTabCycles />
              </Tab> : <></>}
              {hasPosts ? <Tab eventKey="posts" data-cy="tab-posts" title={t(dict,'posts')} className={`cursor-pointer`}>
                <SearchTabPosts />
              </Tab> : <></>}
              {hasWorks ? <Tab eventKey="works" data-cy="tab-works" title={t(dict,'works')} className={`cursor-pointer`}>
                <SearchTabWorks />
              </Tab>:<></>}
            </Tabs>
          :<></>
        }
  </div>
};
export default SearchTab;
