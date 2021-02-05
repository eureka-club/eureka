import { Cycle, LocalImage, User } from '@prisma/client';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_FULL_MONTH_YEAR } from '../../constants';
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
        `${now > cycle.endDate ? 'Inactive' : 'Active'} cycle:  ${dayjs(cycle.startDate).format(
          DATE_FORMAT_FULL_MONTH_YEAR,
        )}—${dayjs(cycle.endDate).format(DATE_FORMAT_FULL_MONTH_YEAR)}`,
      ].join(', ')}
    </section>
  );
};

export default WorkSummary;
