import { FC } from "react";
import CarouselStatic from '@/src/components/CarouselStatic';
import { PostMosaicItem } from "@/src/types/post";
import { UserMosaicItem } from "@/src/types/user";
import { useSession } from "next-auth/react";

interface Props{
  posts:PostMosaicItem[];
  user:UserMosaicItem;
  id:string;
  goTo:(path:string)=>void;
  t:(val:string)=>string;
}
const PostsCreated:FC<Props> = ({posts,user,id,goTo,t}) => {
    const {data:session} = useSession();

    if (user && posts && posts.length) {
      return <div data-cy="my-posts">
        <CarouselStatic
          cacheKey={['MY-POSTS',id]}
          className="mb-5"
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