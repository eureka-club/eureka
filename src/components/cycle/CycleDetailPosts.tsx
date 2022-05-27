import React from 'react'
import { PostMosaicItem } from '@/src/types/post'
import ListWindow from '@/src/components/ListWindow';

interface Props{
  posts:PostMosaicItem[];
  cacheKey:string[];
}

const CycleDetailPosts: React.FC<Props> = ({posts,cacheKey}) => {
  return <>
      <div className='d-none d-md-block'><ListWindow items={posts} cacheKey={cacheKey} itemsByRow={4} /></div>
      <div className='d-block d-md-none'><ListWindow items={posts} cacheKey={cacheKey} itemsByRow={1} /></div>
    </>
}

export default React.memo(CycleDetailPosts)