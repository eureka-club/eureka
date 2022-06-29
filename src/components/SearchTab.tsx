import { useState, FunctionComponent } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { Spinner, ButtonGroup, Button, Alert,Row ,Tabs,Tab, Col} from 'react-bootstrap';
import { PostMosaicItem } from '../types/post';
import { WorkMosaicItem } from '../types/work';
import { CycleMosaicItem } from '../types/cycle';

import PMI from '@/components/post/MosaicItem'
import WMI from '@/components/work/MosaicItem'
import CMI from '@/components/cycle/MosaicItem'


interface Props{
    initialData:{
        posts:PostMosaicItem[];
        works:WorkMosaicItem[];
        cycles:CycleMosaicItem[];
    }
}
const SearchTab: FunctionComponent<Props> = ({initialData:{posts,works,cycles}}) => {
  const { t } = useTranslation('common');
  const [key, setKey] = useState<string>('posts');

  const renderPosts=()=>{
      return <Row>
          {posts.map(p=><Col key={p.id}><PMI postId={p.id} cacheKey={['POST',p.id.toString()]}  /></Col>)}
    </Row>
  }
  const renderWorks=()=>{
    return <Row>
        {works.map(p=><Col key={p.id}><WMI workId={p.id} cacheKey={['WORK',p.id.toString()]}  /></Col>)}
    </Row>
  }
  const renderCycles=()=>{
    return <Row>
        {cycles.map(p=><Col key={p.id}><CMI cycleId={p.id} cacheKey={['CYCLE',p.id.toString()]}  /></Col>)}
    </Row>
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
