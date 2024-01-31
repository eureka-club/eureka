import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import CarouselStatic from "../CarouselStatic";
import useFeaturedEurekas from '@/src/useFeaturedEurekas';
import { useDictContext } from "@/src/hooks/useDictContext";

interface Props{
}
  
const FeaturedEurekas:FC<Props> = ({}) => {
    const router = useRouter()
    const { t, dict } = useDictContext();
    const{lang}=useParams<{lang:string}>()!
    const {data} = useFeaturedEurekas()

    return (data?.posts && data?.posts.length) 
    ? <div>      
       <CarouselStatic
        cacheKey={[`eurekas-of-interest-${lang}`]}
        onSeeAll={()=>router.push('/featured-eurekas')}
        data={data?.posts}
        title={t(dict,'IA Eurekas')}
        //seeAll={posts.length<dataPosts.total}
      />
      </div>
    : <></>;
  };

  export default FeaturedEurekas