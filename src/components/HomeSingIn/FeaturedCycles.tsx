import { useRouter } from "next/navigation";
import { FC } from "react";
// import CarouselStatic from "../CarouselStatic";
import useInterestedCycles from '@/src/hooks/useInterestedCycles';
import { t } from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';
import { LANGUAGES } from '@/src/constants';
import CarouselStatic from "../CarouselStatic";
import { Session } from '@/src/types';

interface Props {
  session: Session | null;
}

const FeaturedCycles: FC<Props> = ({session}) => {
  const router = useRouter()
  const { dict, langs } = useDictContext();
  const languages = langs.split(',').map(l => LANGUAGES[l]).join(',');

  const { data } = useInterestedCycles(session?.user.language || languages)

  return (data?.cycles && data?.cycles.length)
    ? <div>
      <CarouselStatic
        cacheKey={['CYCLES', 'INTERESTED']}
        onSeeAll={() => router.push('/featured-cycles')}
        data={data?.cycles}
        title={t(dict,'Interest cycles')}
      //seeAll={cycles.length<dataCycles?.total}
      />
    </div>
    : <></>;
  return <></>
};

export default FeaturedCycles