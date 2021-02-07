import { Cycle, LocalImage, User } from '@prisma/client';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_HUMANIC_ADVANCED } from '../../constants';
import { advancedDayjs } from '../../lib/utils';
import styles from './CycleSummary.module.css';

interface Props {
  cycle: Cycle & {
    creator: User;
    localImages: LocalImage[];
  };
}

const WorkSummary: FunctionComponent<Props> = ({ cycle }) => {
  const now = new Date();

  return (
    <section className={styles.workSummary}>
      {[
        `${
          advancedDayjs(now).isBetween(dayjs(cycle.startDate), dayjs(cycle.endDate), 'day', '[]')
            ? 'Active'
            : 'Inactive'
        } cycle:  ${advancedDayjs(cycle.startDate).format(DATE_FORMAT_HUMANIC_ADVANCED)}—${advancedDayjs(
          cycle.endDate,
        ).format(DATE_FORMAT_HUMANIC_ADVANCED)}`,
      ].join(', ')}
    </section>
  );
};

export default WorkSummary;
