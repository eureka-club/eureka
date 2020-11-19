import classNames from 'classnames';
import dayjs from 'dayjs';
import { FunctionComponent, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { BiArrowBack } from 'react-icons/bi';
import { Carousel } from 'react-responsive-carousel';

import { CycleFullDetail, isCycleFullDetail } from '../types';
import LocalImage from './LocalImage';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './CycleDetail.module.css';

interface Props {
  cycle: CycleFullDetail;
  cycleContent: Record<string, string>[];
}

const CycleDetail: FunctionComponent<Props> = ({ cycle, cycleContent }) => {
  const contentTextTokens =
    cycle['cycle.content_text'] != null
      ? cycle['cycle.content_text'].split('\n').filter((token: string) => token !== '')
      : [];

  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);

  const handleGalleryNext = () => {
    setCurrentGallerySlide((actualSlide) => actualSlide + 1);
  };

  const handleGalleryPrevious = () => {
    setCurrentGallerySlide((actualSlide) => actualSlide - 1);
  };

  const updateCurrentSlide = (index: number) => {
    if (currentGallerySlide !== index) {
      setCurrentGallerySlide(index);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <section className="mb-4">
            <h1>{cycle['cycle.title']}</h1>
            <p>
              Dates: {dayjs(cycle['cycle.start_date']).format('MMMM D YYYY')}&nbsp;&#8209;&nbsp;
              {dayjs(cycle['cycle.end_date']).format('MMMM D YYYY')}
            </p>
            <p className={styles.cycleAuthor}>
              {isCycleFullDetail(cycle) ? (
                <LocalImage
                  filePath={cycle['creator.avatar.file']}
                  alt="creator avatar"
                  className={classNames(styles.cycleAuthorAvatar, 'mr-3')}
                />
              ) : (
                <Spinner animation="grow" variant="info" className={classNames(styles.cycleAuthorAvatar, 'mr-3')} />
              )}
              {cycle['creator.user_name']}
            </p>
          </section>
          <section className="mb-4">
            {contentTextTokens.map((token) => (
              <p key={`${token[0]}${token[1]}-${token.length}`}>{token}</p>
            ))}
          </section>
          <section className={classNames(styles.commentsPlaceholder, 'd-flex', 'mb-5')}>comments section</section>
        </Col>

        <Col md={{ span: 5 }}>
          <div className={classNames(styles.galleryControls, 'float-right mb-4')}>
            <button type="button" onClick={handleGalleryPrevious} data-direction="back">
              <BiArrowBack />
            </button>
            <button type="button" onClick={handleGalleryNext} data-direction="forward">
              <BiArrowBack />
            </button>
          </div>
          <div className={styles.gallery}>
            {/* language=CSS */}
            <style jsx global>{`
              .carousel-root {
                width: 118%;
              }
              .carousel .slider {
                width: 90%;
              }
              .carousel .slide {
                background: transparent;
              }
              .carousel .slide.selected {
              }
            `}</style>
            <Carousel
              autoPlay={false}
              onChange={updateCurrentSlide}
              selectedItem={currentGallerySlide}
              showArrows={false}
              showIndicators={false}
              showStatus={false}
              showThumbs={false}
            >
              {cycleContent.map((work) => (
                <div className={styles.galleryItem} key={work['work.id']}>
                  <LocalImage filePath={work['local_image.stored_file']} alt={work['work.title']} />
                  <div className={styles.workInitials}>
                    <h4>{work['work.title']}</h4>
                    <p>{work['work.author']}</p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="mb-5">Post from other users</h2>
        </Col>
      </Row>
    </>
  );
};

export default CycleDetail;
