import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FunctionComponent } from 'react';

import useTranslation from 'next-translate/useTranslation';
import { DATE_FORMAT_SHORT } from '../../constants';
import { advancedDayjs } from '../../lib/utils';
import { CycleSumary } from '@/src/types/cycle';
import useCycleSumary from '@/src/useCycleSumary';
// import TagsInput from '../forms/controls/TagsInput';

interface Props {
  cycleId: number;
} 

dayjs.extend(utc);
dayjs.extend(timezone);

const CycleSummary: FunctionComponent<Props> = ({ cycleId }) => {
  const now = new Date();
  const { t } = useTranslation('common');
  const{data:cycle}=useCycleSumary(cycleId);
  const startDate = dayjs(cycle?.startDate).utc();
  const endDate = dayjs(cycle?.endDate).utc();
  // const [tags, setTags] = useState<string>('');
  // useEffect(() => {
  //   setTags(cycle.tags!);
  // }, [cycle]);
  return (
    <section className="fs-6 text-gray text-wrap">
      {[
        `${
          advancedDayjs(now).isBetween(dayjs(cycle?.startDate), dayjs(cycle?.endDate), 'day', '[]')
            ? t('cycleActiveLabel')
            : t('cycleNotActiveLabel')
        } :  ${startDate.format(DATE_FORMAT_SHORT)}—${endDate.format(DATE_FORMAT_SHORT)}`,
        cycle?.countryOfOrigin && `${t('countryLabel')}: ${t(`countries:${cycle?.countryOfOrigin}` as string)}`,
      ]
        .filter((i) => i)
        .join(', ')}
      {/* <TagsInput tags={tags} readOnly label="" /> */}
    </section>
  );
};

export default CycleSummary;
