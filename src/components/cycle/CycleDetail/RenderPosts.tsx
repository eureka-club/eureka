import Spinner from '@/components/common/Spinner';
import { MosaicsGrid } from "../../MosaicsGrid";
import MosaicItemPost from '@/src/components/post/MosaicItem'
import usePosts from "@/src/usePosts";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';


const cyclePostsProps = (cycleId:number)=>({take:8,where:{cycles:{some:{id:cycleId}}}});

type RenderPostsProps={
    cycleId:number;
  }
export const RenderPosts = ({cycleId}:RenderPostsProps)=>{
    const {data:dataPosts,isLoading} = usePosts(cyclePostsProps(cycleId),['CYCLE',`${cycleId}`,'POSTS']);
    const [posts,setPosts] = useState(dataPosts?.posts)
    const hasMorePosts=dataPosts?.fetched!<dataPosts?.total!
    // const [hasMorePosts,setHasMorePosts] = useState(dataPosts?.fetched!<dataPosts?.total!);
    const [ref, inView] = useInView({
        triggerOnce: false,
    });
     // useEffect(()=>{console.log('aca no')
  //   if(inView && hasMorePosts){
  //     if(posts){
  //       const loadMore = async ()=>{
  //         const {id} = posts.slice(-1)[0];
  //         const o = {...cyclePostsProps,skip:1,cursor:{id}};
  //         const {posts:pf,fetched} = await getPosts(lang,o)
  //         setHasMorePosts(fetched);
  //         const posts_ = [...(posts||[]),...pf];
  //         setPosts(posts_);
  //       }
  //       loadMore();
  //     }
  //   }
  // },[inView]);

    useEffect(()=>{
        if(dataPosts && dataPosts.posts){
        // setHasMorePosts(dataPosts.fetched!)
        setPosts(dataPosts.posts)
        }
    },[dataPosts])

    if(posts){
      return <>
      <MosaicsGrid isLoading={isLoading}>
        {posts.map((p:any,idx:number)=><MosaicItemPost key={`${p.id}-${idx}`}  cacheKey={['POST',`${p.id}`]} postId={p.id} showSaveForLater={false} size={'md'} />          )}
      </MosaicsGrid>
        {/* <Grid container gap={3}>
        {posts.map((p)=><Grid item
          xs={12} sm={6} lg={2} 
          // xxl={2} 
          key={p.id} 
          // className="mb-5 d-flex justify-content-center  align-items-center"
         >
          <MosaicItemPost  cacheKey={['POST',`${p.id}`]} postId={p.id} showSaveForLater={false} size={'md'} />          
        </Grid>
        )}
        </Grid> */}
        <div className="mt-5" ref={ref}>
            {
                hasMorePosts 
                    ? <Spinner/>
                    : <></>
            }
        </div>
      </>
    }
    return <></>;
  }
  