import { WorkMosaicItem } from '@/src/types/work';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';


import { FunctionComponent } from 'react';

import { DATE_FORMAT_ONLY_YEAR } from '../../constants';
import styles from './WorkSummary.module.css';
import { useDictContext } from '@/src/hooks/useDictContext';

dayjs.extend(utc);
interface Props {
  work: WorkMosaicItem
}

const WorkSummary: FunctionComponent<Props> = ({ work }) => {
  const { t, dict } = useDictContext(); 

  return (
    <p className={`mb-1 mb-sm-2 text-wrap ${styles.workSummary} text-dark`}>
      {[
        work.publicationYear &&
          `${
            work.type === 'book' || work.type === 'fiction-book' ? t(dict,'publicationYearLabel') : t(dict,'releaseYearLabel')
          }:  ${dayjs(work.publicationYear).utc().format(DATE_FORMAT_ONLY_YEAR)}`,

        work.countryOfOrigin && `${t(dict,'countryLabel')}: ${(work.countryOfOrigin.split(',')).map(c=>{return t(dict,`countries:${c}`)})}`,
       
        work.length &&
          `${t(dict,'workLengthLabel')}: ${work.length} ${
            work.type === 'book' || work.type === 'fiction-book'
              ? t(dict,'workLengthAsPagesLabel')
              : t(dict,'workLengthAsMinutesLabel')
          }`,
      ]
        .filter((val) => val != null)
        .join(', ')}
    </p>
  );
};

export default WorkSummary;
