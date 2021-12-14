import { FunctionComponent } from 'react';
import {Badge} from 'react-bootstrap'
import { CycleWithImages } from '@/types/cycle';
import LocalImageComponent from '@/components/LocalImage';
import CycleSummary from './CycleSummary';
import styles from './TypeaheadSearchItem.module.css';
import useTranslation from 'next-translate/useTranslation';
interface Props {
  cycle: CycleWithImages;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ cycle }) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.workSearchTypeaheadItem}>
      <div className={styles.imageWrapper}>
        <LocalImageComponent filePath={cycle.localImages[0].storedFile} alt={cycle.title} />
      </div>
      <div>
      <Badge bg="secondary" className={`fw-normal fs-xs text-white px-2 rounded-pill ${styles.type}`}>
          {t('cycle')}
        </Badge>
        <h3 className="text-wrap text-dark">{cycle.title}</h3>
        <CycleSummary cycle={cycle} />
      </div>
    </div>
  );
};

export default TypeaheadSearchItem;
