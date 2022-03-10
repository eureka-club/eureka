import { WorkDetail } from '@/src/types/work';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { DATE_FORMAT_ONLY_YEAR } from '../../constants';
import styles from './WorkSummary.module.css';
import useWork from '@/src/useWork'
dayjs.extend(utc);
interface Props {
  workId: number
}

const WorkSummary: FunctionComponent<Props> = ({ workId }) => {
  const { t } = useTranslation('common'); 
  const {data:work} = useWork(workId,{enabled:!!workId})
  if(!work)return <></>
  
  return (
    <p className={`mb-1 mb-sm-2 text-wrap ${styles.workSummary} text-dark`}>
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
