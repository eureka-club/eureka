import { FunctionComponent } from 'react';

import { CycleWithImages } from '../../types/cycle';
import LocalImageComponent from '../LocalImage';
import CycleSummary from './CycleSummary';
import styles from './TypeaheadSearchItem.module.css';

interface Props {
  cycle: CycleWithImages;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ cycle }) => {
  return (
    <div className={styles.workSearchTypeaheadItem}>
      <div className={styles.imageWrapper}>
        <LocalImageComponent filePath={cycle.localImages[0].storedFile} alt={cycle.title} />
      </div>
      <div>
        <h3 className="text-wrap">{cycle.title}</h3>
        <hr />
        <CycleSummary cycle={cycle} />
      </div>
    </div>
  );
};

export default TypeaheadSearchItem;
