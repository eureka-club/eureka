import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Badge } from 'react-bootstrap'
import { WorkWithImages } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import WorkSummary from './WorkSummary';
import styles from './TypeaheadSearchItem.module.css';

interface Props {
  work: WorkWithImages;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ work }) => {
  const { t } = useTranslation('common');

  return (
    // <Container>
    //   <Row>
    //     <Col md={12} lg={3} className={styles.imageWrapper}>{work.localImages != null && work.localImages[0] != null && (
    //       <section className="position-relative">
    //         <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
    //         <Badge bg="orange" className={`top-start fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
    //           {t(work.type)}
    //         </Badge></section>
    //     )}</Col>
    //     <Col md={12} lg={9} className="text-wrap">
    //     <h3 >{work.title}</h3>
    //     <h4>{work.author}</h4>
    //     <hr />
    //     <WorkSummary work={work} />
    //     </Col>
    //   </Row>
    // </Container>
    <div className={styles.workSearchTypeaheadItem}>
      <div className={styles.imageWrapper}>
        {work.localImages != null && work.localImages[0] != null && (
          <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
        )}
      </div>
      <div>
        <Badge bg="orange" className={`fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
          {t(work.type)}
        </Badge>
        <h3 className="text-wrap">{work.title}</h3>
        <h4 className="text-wrap">{work.author}</h4>
        <hr />
        <WorkSummary work={work} />
      </div>
    </div>
  );
};

export default TypeaheadSearchItem;
