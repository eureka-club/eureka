import { LocalImage, Work } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_ONLY_YEAR } from '../../constants';
import styles from './WorkSummary.module.css';

dayjs.extend(utc);
interface Props {
  work: Work & { localImages: LocalImage[] };
}

const WorkSummary: FunctionComponent<Props> = ({ work }) => {
  const { t } = useTranslation('common');

  return (
    <p className={`text-wrap ${styles.workSummary} text-dark`}>
      {[
        work.publicationYear &&
          `${
            work.type === 'book' || work.type === 'fiction-book' ? t('publicationYearLabel') : t('releaseYearLabel')
          }:  ${dayjs(work.publicationYear).utc().format(DATE_FORMAT_ONLY_YEAR)}`,
        work.countryOfOrigin && `${t('countryLabel')}: ${t(`countries:${work.countryOfOrigin}` as string)}`,
        work.length &&
          `${t('workLengthLabel')}: ${work.length} ${
            work.type === 'book' || work.type === 'fiction-book'
              ? t('workLengthAsPagesLabel')
              : t('workLengthAsMinutesLabel')
          }`,
      ]
        .filter((val) => val != null)
        .join(', ')}
    </p>
  );
};

export default WorkSummary;
