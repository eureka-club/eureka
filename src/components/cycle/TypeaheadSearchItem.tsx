import { FunctionComponent } from 'react';
import {Badge} from 'react-bootstrap'
import { CycleMosaicItem } from '@/types/cycle';
import LocalImageComponent from '@/components/LocalImage';
import CycleSummary from './CycleSummary';
import styles from './TypeaheadSearchItem.module.css';
import useTranslation from 'next-translate/useTranslation';
interface Props {
  cycle: CycleMosaicItem;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ cycle }) => {
  const { t } = useTranslation('common');
  if(!cycle)return <></>
  return (
    <section>
      <aside className="position-relative">
        <LocalImageComponent className='shadow-sm py-2 px-2 bg-body rounded' width={150} height={150} filePath={cycle.localImages[0].storedFile} alt={cycle.title} />
        <Badge bg="primary" className={`position-absolute top-0 start-0 mt-3 ms-3 fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
          {t('cycle')}
        </Badge>
      </aside>
      <aside>
        <h3 className="fs-6 fw-bold text-wrap">{cycle.title}</h3>
        <h4 className="fs-6 text-dark text-decoration-underline fst-italic">{t('by')} {cycle.creator.name}</h4>
        <CycleSummary cycle={cycle} />
      </aside>
    </section>
    // <div className={styles.workSearchTypeaheadItem}>
    //   <div className={styles.imageWrapper}>
    //     <LocalImageComponent width={100} height={100} filePath={cycle.localImages[0].storedFile} alt={cycle.title} />
    //   </div>
    //   <div>
    //   <Badge bg="secondary" className={`fw-normal fs-xs text-white px-2 rounded-pill ${styles.type}`}>
    //       {t('cycle')}
    //     </Badge>
    //     <h3 className="text-wrap text-dark">{cycle.title}</h3>
    //     <CycleSummary cycle={cycle} />
    //   </div>
    // </div>
  );
};

export default TypeaheadSearchItem;
