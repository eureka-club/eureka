import { Cycle } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FunctionComponent } from 'react';


import { DATE_FORMAT_SHORT } from '../../constants';
import { advancedDayjs } from '../../lib/utils';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t } from '@/src/get-dictionary';

interface Props {
  cycle: Cycle;
} 

dayjs.extend(utc);
dayjs.extend(timezone);

const CycleSummary: FunctionComponent<Props> = ({ cycle }) => {
  const now = new Date();
  // const { t } = useTranslation('common');
  const{dict}=useDictContext()
  const startDate = dayjs(cycle.startDate).utc();
  const endDate = dayjs(cycle.endDate).utc();
  // const [tags, setTags] = useState<string>('');
  // useEffect(() => {
  //   setTags(cycle.tags!);
  // }, [cycle]);
  return (
    <section className="fs-6 text-gray text-wrap">
      {[
        `${
          advancedDayjs(now).isBetween(dayjs(cycle.startDate), dayjs(cycle.endDate), 'day', '[]')
            ? t(dict,'cycleActiveLabel')
            : t(dict,'cycleNotActiveLabel')
        } :  ${startDate.format(DATE_FORMAT_SHORT)}—${endDate.format(DATE_FORMAT_SHORT)}`,
        cycle.countryOfOrigin && `${t(dict,'countryLabel')}: ${t(dict,`countries:${cycle.countryOfOrigin}` as string)}`,
      ]
        .filter((i) => i)
        .join(', ')}
      {/* <TagsInput tags={tags} readOnly label="" /> */}
    </section>
  );
};

export default CycleSummary;
