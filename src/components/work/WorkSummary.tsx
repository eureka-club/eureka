import { LocalImage, Work } from '@prisma/client';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_ONLY_YEAR } from '../../constants';
import styles from './WorkSummary.module.css';

interface Props {
  work: Work & { localImages: LocalImage[] };
}

const WorkSummary: FunctionComponent<Props> = ({ work }) => {
  const { t } = useTranslation('common');

  return (
    <section className={styles.workSummary}>
      {[
        work.publicationYear &&
          `${work.type === 'book' ? t('publicationYearLabel') : t('releaseYearLabel')}:  ${dayjs(work.publicationYear)
            .add(1, 'day')
            .format(DATE_FORMAT_ONLY_YEAR)}`,
        work.countryOfOrigin && `${t('countryLabel')}: ${work.countryOfOrigin}`,
        work.length &&
          `${t('workLengthLabel')}: ${work.length} ${
            work.type === 'book' ? t('workLengthAsPagesLabel') : t('workLengthAsMinutesLabel')
          }`,
      ]
        .filter((val) => val != null)
        .join(', ')}
    </section>
  );
};

export default WorkSummary;
