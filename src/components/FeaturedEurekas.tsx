import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC } from "react";
import { PostMosaicItem } from "../types/post";
import CarouselStatic from "./CarouselStatic";

interface DataPost{
    posts: PostMosaicItem[];
    fetched: number;
    total: number;
  }
  
const FeaturedEurekas:FC<{posts:PostMosaicItem[]|undefined,dataPosts:DataPost|undefined}> = ({posts,dataPosts}) => {
    const router = useRouter()
    const { t } = useTranslation('common');

    return (posts && posts.length && dataPosts) 
    ? <div>      
       <CarouselStatic
        cacheKey={['POSTS','FEATURED']}
        onSeeAll={()=>router.push('/featured-eurekas')}
        data={posts}
        title={t('IA Eurekas')}
        //seeAll={posts.length<dataPosts.total}
      />
      </div>
    : <></>;
  };

  export default FeaturedEurekas