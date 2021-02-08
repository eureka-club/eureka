import { FunctionComponent } from 'react';

import { WorkSearchResult } from '../../types';
import LocalImageComponent from '../LocalImage';
import WorkSummary from './WorkSummary';
import styles from './TypeaheadSearchItem.module.css';

interface Props {
  work: WorkSearchResult;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ work }) => {
  return (
    <div className={styles.workSearchTypeaheadItem}>
      <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
      <div>
        <h3>
          {work.title} <small>({work.type})</small>
        </h3>
        <h4>{work.author}</h4>
        <hr />
        <WorkSummary work={work} />
      </div>
    </div>
  );
};

export default TypeaheadSearchItem;
