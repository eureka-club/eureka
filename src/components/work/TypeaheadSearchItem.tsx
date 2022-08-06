import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Badge, Container,Row,Col } from 'react-bootstrap'
import { WorkMosaicItem } from '@/types/work';
import LocalImageComponent from '@/src/components/LocalImage';
import WorkSummary from './WorkSummary';
import styles from './TypeaheadSearchItem.module.css';

interface Props {
  work: WorkMosaicItem;
}

const TypeaheadSearchItem: FunctionComponent<Props> = ({ work }) => {
  const { t } = useTranslation('common');

  return (
    <section>
      <aside className="position-relative">
        <LocalImageComponent className='shadow-sm py-2 px-2 bg-body rounded' width={150} height={150} filePath={work.localImages[0].storedFile} alt={work.title} />
        <Badge bg="orange" className={`position-absolute top-0 start-0 mt-3 ms-3 fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
          {t(work.type)}
        </Badge>
      </aside>
      <aside>
        <h3 className="fs-6 fw-bold text-wrap">{work.title}</h3>
        <h4 className="fs-6 text-dark text-decoration-underline fst-italic">{t('by')} {work.author}</h4>
        {/* <hr /> */}
        <WorkSummary work={work} />
      </aside>
    </section>
    // <Container>
    //   <Row>
    //     <Col md={12} lg={3} className={``}>{work.localImages != null && work.localImages[0] != null && (
    //       <LocalImageComponent width={300} height={300} filePath={work.localImages[0].storedFile} alt={work.title} />
    //     )}</Col>
    //     <Col md={12} lg={9} className="text-wrap">
    //         <Badge bg="orange" className={`top-start fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
    //           {t(work.type)}
    //         </Badge>
    //         <h3 className="fs-5 fw-bold">{work.title}</h3>
    //         <h4 className="fs-6 text-dark">{work.author}</h4>
    //         {/* <hr /> */}
    //         <WorkSummary work={work} />
    //     </Col>
    //   </Row>
    // </Container>
    // <div className={styles.workSearchTypeaheadItem}>
    //   <div className={styles.imageWrapper}>
    //     {work.localImages != null && work.localImages[0] != null && (
    //       <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
    //     )}
    //   </div>
    //   <div>
    //     <Badge bg="orange" className={`fw-normal fs-xs text-black px-2 rounded-pill ${styles.type}`}>
    //       {t(work.type)}
    //     </Badge>
    //     <h3 className="text-wrap text-dark">{work.title}</h3>
    //     <h4 className="text-wrap text-dark">{work.author}</h4>
        
    //     <WorkSummary work={work} />
    //   </div>
    // </div>
  );
};

export default TypeaheadSearchItem;
