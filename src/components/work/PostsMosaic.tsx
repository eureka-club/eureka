// import { Work } from '@prisma/client';
import { FunctionComponent,useState,useEffect } from 'react';
// import Spinner from 'react-bootstrap/Spinner';
// import { useQuery } from 'react-query';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
import Mosaic from '../Mosaic';
import usePosts from '@/src/usePosts'

interface Props {
  work: WorkMosaicItem;
}

const PostsMosaic: FunctionComponent<Props> = ({ work }) => {
  // const { isLoading, isSuccess, data } = useQuery<WorkMosaicItem[]>(
  //   ['posts.mosaic.work', work.id],
  //   async ({ queryKey: [, workId] }) => {
  //     const whereQP = encodeURIComponent(JSON.stringify({ works: { some: { id: workId } } }));
  //     const includeQP = encodeURIComponent(
  //       JSON.stringify({ creator: true, localImages: true, works: true, favs: true }),
  //     );
  //     const res = await fetch(`/api/search/posts?where=${whereQP}&include=${includeQP}`);

  //     return res.json();
  //   },
  // );

  const workPostsWhere = {
    where:{AND:{
      works:{
        some:{
          id:work.id
        }
      }
    }}
  };
  const {data:dataPosts} = usePosts(workPostsWhere,{enabled:!!work.id})
  const [posts,setPosts] = useState(dataPosts?.posts);

  useEffect(()=>{
    if(dataPosts){
      setPosts(dataPosts.posts)
    }
  },[dataPosts])
  

  return (
    <>
      {/* {isLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )} */}
      {work && posts != null && <Mosaic cacheKey={['WORK',work.id.toString()]}className='d-flex justify-content-center justify-content-md-start' stack={posts} parent={work} />}
    </>
  );
};

export default PostsMosaic;
