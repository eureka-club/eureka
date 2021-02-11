import { FunctionComponent } from 'react';

import { WorkWithImages } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import WorkSummary from './WorkSummary';
import styles from './TypeaheadSearchItem.module.css';

interface Props {
  work: WorkWithImages;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ work }) => {
  return (
    <div className={styles.workSearchTypeaheadItem}>
      <div className={styles.imageWrapper}>
        <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
        <span>{work.type}</span>
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
