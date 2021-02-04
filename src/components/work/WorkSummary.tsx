import { LocalImage, Work } from '@prisma/client';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_ONLY_YEAR } from '../../constants';
import styles from './WorkSummary.module.css';

interface Props {
  work: Work & { localImages: LocalImage[] };
}

const WorkSummary: FunctionComponent<Props> = ({ work }) => {
  return (
    <section className={styles.workSummary}>
      {[
        work.publicationYear &&
          `${work.type === 'book' ? 'Publication year' : 'Release year'}:  ${dayjs(work.publicationYear).format(
            DATE_FORMAT_ONLY_YEAR,
          )}`,
        work.countryOfOrigin && `Country: ${work.countryOfOrigin}`,
        work.length && `Length: ${work.length} ${work.type === 'book' ? 'pages' : 'minutes'}`,
      ]
        .filter((val) => val != null)
        .join(', ')}
    </section>
  );
};

export default WorkSummary;
