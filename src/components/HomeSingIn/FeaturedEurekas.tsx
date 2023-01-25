import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC } from "react";
import CarouselStatic from "../CarouselStatic";
import useFeaturedEurekas from '@/src/useFeaturedEurekas';

interface Props{
}
  
const FeaturedEurekas:FC<Props> = ({}) => {
    const router = useRouter()
    const { t } = useTranslation('common');
    const {data} = useFeaturedEurekas()

    return (data?.posts && data?.posts.length) 
    ? <div>      
       <CarouselStatic
        cacheKey={['POSTS','FEATURED']}
        onSeeAll={()=>router.push('/featured-eurekas')}
        data={data?.posts}
        title={t('IA Eurekas')}
        //seeAll={posts.length<dataPosts.total}
      />
      </div>
    : <></>;
  };

  export default FeaturedEurekas