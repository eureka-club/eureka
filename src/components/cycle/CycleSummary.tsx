import { Cycle } from '@prisma/client';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_SHORT } from '../../constants';
import { advancedDayjs } from '../../lib/utils';
import styles from './CycleSummary.module.css';

interface Props {
  cycle: Cycle;
}

const WorkSummary: FunctionComponent<Props> = ({ cycle }) => {
  const now = new Date();
  const { t } = useTranslation('common');

  return (
    <section className={styles.workSummary}>
      {[
        `${
          advancedDayjs(now).isBetween(dayjs(cycle.startDate), dayjs(cycle.endDate), 'day', '[]')
            ? t('cycleActiveLabel')
            : t('cycleNotActiveLabel')
        } :  ${dayjs(cycle.startDate).format(DATE_FORMAT_SHORT)}—${dayjs(cycle.endDate).format(DATE_FORMAT_SHORT)}`,
      ].join(', ')}
    </section>
  );
};

export default WorkSummary;
