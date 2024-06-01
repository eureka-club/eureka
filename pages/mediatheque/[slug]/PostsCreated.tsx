import { FC } from "react";
import CarouselStatic from '@/src/components/CarouselStatic';
import { PostDetail, PostSumary } from "@/src/types/post";
import { UserDetail } from "@/src/types/user";
import { useSession } from "next-auth/react";

interface Props{
  posts:PostSumary[];
  user:UserDetail;
  id:string;
  goTo:(path:string)=>void;
  t:(val:string)=>string;
  showSeeAll?:boolean
}
const PostsCreated:FC<Props> = ({posts,user,id,goTo,t,showSeeAll=true}) => {
    const {data:session} = useSession();

    if (user && posts && posts.length) {
      return <div data-cy="my-posts" id="my-posts">
        <CarouselStatic
          cacheKey={['MY-POSTS',id]}
          className="mb-5"
          seeAll={showSeeAll}
          onSeeAll={()=>goTo('my-posts')}
          title={t('common:myPosts')}
          data={posts}
          mosaicBoxClassName="pb-1"
        />
      </div>
    }
    return <></>;
  };

  export default PostsCreated;