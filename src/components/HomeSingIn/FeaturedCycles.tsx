import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/navigation";
import { FC } from "react";
import CarouselStatic from "../CarouselStatic";
import useInterestedCycles from '@/src/useInterestedCycles';

interface Props {
}

const FeaturedCycles:FC<Props> = ({}) => {
    const router = useRouter()
    const { t } = useTranslation('common');
    const {data} = useInterestedCycles()

    return (data?.cycles && data?.cycles.length) 
    ? <div>      
       <CarouselStatic
        cacheKey={['CYCLES','INTERESTED']}
        onSeeAll={()=>router.push('/featured-cycles')}
        data={data?.cycles}
        title={t('Interest cycles')}
        //seeAll={cycles.length<dataCycles?.total}
      />
      </div>
    : <></>;
  };

  export default FeaturedCycles