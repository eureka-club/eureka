import { WorkDetail, WorkSumary } from '@/src/types/work';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_ONLY_YEAR } from '../../constants';
import styles from './WorkSummary.module.css';

dayjs.extend(utc);
interface Props {
  work: WorkSumary
}

const WorkSummary: FunctionComponent<Props> = ({ work }) => {
  const { t } = useTranslation('common'); 

  return (
    <p className={`${styles.workSummary} text-dark`}>
      {[
        work.publicationYear &&
          `${
            work.type === 'book' || work.type === 'fiction-book' ? t('publicationYearLabel') : t('releaseYearLabel')
          }:  ${dayjs(work.publicationYear).utc().format(DATE_FORMAT_ONLY_YEAR)}`,

        work.countryOfOrigin && `${t('countryLabel')}: ${(work.countryOfOrigin.split(',')).map(c=>{return t(`countries:${c}`)})}`,
       
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
