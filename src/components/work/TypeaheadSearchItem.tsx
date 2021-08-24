import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';

import { WorkMosaicItem } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import WorkSummary from './WorkSummary';
import styles from './TypeaheadSearchItem.module.css';

interface Props {
  work: WorkMosaicItem;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ work }) => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.workSearchTypeaheadItem}>
      <div className={styles.imageWrapper}>
        {work.localImages != null && work.localImages[0] != null && (
          <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
        )}
        <span>{t(work.type)}</span>
      </div>
      <div>
        <h3>{work.title}</h3>
        <h4>{work.author}</h4>
        <hr />
        <WorkSummary work={work} />
      </div>
    </div>
  );
};

export default TypeaheadSearchItem;
