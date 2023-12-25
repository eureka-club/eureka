import { useRouter } from "next/navigation";
import { FC } from "react";
import CarouselStatic from "../CarouselStatic";
import useFeaturedEurekas from '@/src/hooks/useFeaturedEurekas';
import { t } from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';
import { LANGUAGES } from '@/src/constants';
import { Session } from '@/src/types';

interface Props{
  session: Session | null;
}
  
const FeaturedEurekas: FC<Props> = ({ session }) => {
    const router = useRouter()
  const { dict,langs} = useDictContext();
 
  const lenguages = langs.split(',').map(l => LANGUAGES[l]).join(',');
  
  const { data } = useFeaturedEurekas()//session?.user.language || lenguages

    return (data?.posts && data?.posts.length) 
    ? <div>      
       <CarouselStatic
        cacheKey={['POSTS','eurekas-of-interest']}
        onSeeAll={()=>router.push('/featured-posts')}
        data={data?.posts}
        title={t(dict,'IA Eurekas')}
        //seeAll={posts.length<dataPosts.total}
      />
      </div>
    : <></>;
  return <></>

  };

  export default FeaturedEurekas