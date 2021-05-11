import { Cycle } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_SHORT } from '../../constants';
import { advancedDayjs } from '../../lib/utils';
import styles from './CycleSummary.module.css';

interface Props {
  cycle: Cycle;
}

dayjs.extend(utc);
dayjs.extend(timezone);

const WorkSummary: FunctionComponent<Props> = ({ cycle }) => {
  const now = new Date();
  const { t } = useTranslation('common');
  const startDate = dayjs(cycle.startDate).add(1, 'day').tz(dayjs.tz.guess());
  const endDate = dayjs(cycle.endDate).add(1, 'day').tz(dayjs.tz.guess());
  return (
    <section className={styles.workSummary}>
      {[
        `${
          advancedDayjs(now).isBetween(dayjs(cycle.startDate), dayjs(cycle.endDate), 'day', '[]')
            ? t('cycleActiveLabel')
            : t('cycleNotActiveLabel')
        } :  ${startDate.format(DATE_FORMAT_SHORT)}—${endDate.format(DATE_FORMAT_SHORT)}`,
      ].join(', ')}
    </section>
  );
};

export default WorkSummary;
