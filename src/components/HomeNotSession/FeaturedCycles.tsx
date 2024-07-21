import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC } from "react";
import CarouselStatic from "../CarouselStatic";
import useInterestedCycles from '@/src/useInterestedCycles';

interface Props {
}

const FeaturedCycles:FC<Props> = ({}) => {
    const router = useRouter()
    const { t,lang } = useTranslation('common');
    const {data} = useInterestedCycles()

    return (data?.cycles && data?.cycles.length) 
    ? <div>      
       <CarouselStatic
        cacheKey={[`cycles-of-interest-${lang}`]}
        seeAll={data?.fetched<data.total}
        onSeeAll={()=>router.push('/featured-cycles')}
        data={data?.cycles}
        title={t('Interest cycles')}
        //seeAll={cycles.length<dataCycles?.total}
      />
      </div>
    : <></>;
  };

  export default FeaturedCycles