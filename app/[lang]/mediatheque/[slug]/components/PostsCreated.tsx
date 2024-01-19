"use client"
import { FC } from "react";
import CarouselStatic from '@/src/components/CarouselStatic';
import { PostMosaicItem } from "@/src/types/post";
import { UserDetail } from "@/src/types/user";
import { useDictContext } from '@/src/hooks/useDictContext';

import getUserIdFromSlug from "@/src/getUserIdFromSlug";
import { useParams } from "next/navigation";
import useUser from "@/src/hooks/useUser";
import usePostsCreated from "../hooks/usePostsCreated";
import useCyclesCreated from "../hooks/useCyclesCreated";

interface Props{
  goTo:(path:string)=>void;
}
const PostsCreated:FC<Props> = ({goTo}) => {
  const {slug,lang} = useParams<{slug:string,lang:string}>()!;

  const { t, dict } = useDictContext();
  const id = getUserIdFromSlug(slug);

  const {data:user} = useUser(id,{enabled:id!=-1});
  const {data:posts} = usePostsCreated(user?.id!,lang);

    if (user && posts && posts.length) {
      return <div data-cy="my-posts">
        <CarouselStatic
          cacheKey={['MY-POSTS',id.toString()]}
          className="mb-5"
          onSeeAll={()=>goTo('my-posts')}
          title={t(dict,'myPosts')}
          data={posts}
          mosaicBoxClassName="pb-1"
        />
      </div>
    }
    return <></>;
  };

  export default PostsCreated;