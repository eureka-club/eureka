import { useState, FunctionComponent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row ,Tabs,Tab, Col} from 'react-bootstrap';

import SearchTabWorks from './SearchTabWorks';
import SearchTabPosts from './SearchTabPosts';
import SearchTabCycles from './SearchTabCycles';

interface Props{
    
}
const SearchTab: FunctionComponent<Props> = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [key, setKey] = useState<string>('posts');

  const renderTab = (k:string)=>{
    switch(k){
      case 'posts':
        return <SearchTabPosts/>
      case 'works':
          return <SearchTabWorks/>
      case 'cycles':
        return <SearchTabCycles/>
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
