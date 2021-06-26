import { Cycle } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState, useEffect, FunctionComponent } from 'react';

import useTranslation from 'next-translate/useTranslation';

import { DATE_FORMAT_SHORT } from '../../constants';
import { advancedDayjs } from '../../lib/utils';
import styles from './CycleSummary.module.css';
import TagsInput from '../forms/controls/TagsInput';

interface Props {
  cycle: Cycle;
}

dayjs.extend(utc);
dayjs.extend(timezone);

const WorkSummary: FunctionComponent<Props> = ({ cycle }) => {
  const now = new Date();
  const { t } = useTranslation('common');
  const startDate = dayjs(cycle.startDate).utc();
  const endDate = dayjs(cycle.endDate).utc();
  const [tags, setTags] = useState<string>('');
  useEffect(() => {
    setTags(cycle.tags!);
  }, [cycle]);
  return (
    <section className={styles.workSummary}>
      {[
        `${
          advancedDayjs(now).isBetween(dayjs(cycle.startDate), dayjs(cycle.endDate), 'day', '[]')
            ? t('cycleActiveLabel')
            : t('cycleNotActiveLabel')
        } :  ${startDate.format(DATE_FORMAT_SHORT)}—${endDate.format(DATE_FORMAT_SHORT)}`,
        cycle.countryOfOrigin && `${t('countryLabel')}: ${t(`countries:${cycle.countryOfOrigin}` as string)}`,
      ]
        .filter((i) => i)
        .join(', ')}
      <TagsInput tags={tags} readOnly label="" />
    </section>
  );
};

export default WorkSummary;
