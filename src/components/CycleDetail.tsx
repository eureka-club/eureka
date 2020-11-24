import classNames from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { FunctionComponent, MouseEvent, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import { DiscussionEmbed } from 'disqus-react';
import { BiArrowBack } from 'react-icons/bi';
import { Carousel } from 'react-responsive-carousel';

import { DATE_FORMAT_DISPLAY, DISQUS_SHORTNAME, WEBAPP_URL } from '../constants';
import { LocalImageDbObject } from '../models/LocalImage';
import { WorkDbObject } from '../models/Work';
import { CycleDetail } from '../types';
import LocalImage from './LocalImage';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './CycleDetail.module.css';

interface Props {
  cycle: CycleDetail;
  cycleContent: (WorkDbObject & LocalImageDbObject)[];
}

const CycleDetailComponent: FunctionComponent<Props> = ({ cycle, cycleContent }) => {
  const { asPath } = useRouter();
  const contentTextTokens =
    cycle['cycle.content_text'] != null
      ? cycle['cycle.content_text'].split('\n').filter((token: string) => token !== '')
      : [];

  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);
  const [cycleContentModalOpened, setCycleContentModalOpened] = useState(false);

  const handleShowCycleContent = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setCycleContentModalOpened(true);
  };

  const handleCycleContentModalClose = () => {
    setCycleContentModalOpened(false);
  };

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
        <Col md={{ span: 5 }}>
          <section className="mb-4">
            <h1>{cycle['cycle.title']}</h1>
            <p>
              Dates: {dayjs(cycle['cycle.start_date']).format(DATE_FORMAT_DISPLAY)}&nbsp;&#8209;&nbsp;
              {dayjs(cycle['cycle.end_date']).format(DATE_FORMAT_DISPLAY)}
            </p>
            <p className={styles.cycleAuthor}>
              <img
                src={cycle['creator.image']}
                alt="creator avatar"
                className={classNames(styles.cycleAuthorAvatar, 'mr-3')}
              />
              {cycle['creator.name']}
              <button onClick={handleShowCycleContent} type="button" className={styles.showContentBtn}>
                Cycle content
              </button>
            </p>
          </section>
          <section className="mb-5">
            {contentTextTokens.map((token) => (
              <p key={`${token[0]}${token[1]}-${token.length}`}>{token}</p>
            ))}
          </section>
          {/* language=CSS */}
          <style jsx global>{`
            #disqus_thread {
              width: 100%;
            }
          `}</style>
          <section className="mb-5">
            <DiscussionEmbed
              shortname={DISQUS_SHORTNAME!}
              config={{
                url: `${WEBAPP_URL}${asPath}`,
                identifier: asPath,
                title: cycle['cycle.title'],
              }}
            />
          </section>
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

      <Modal show={cycleContentModalOpened} onHide={handleCycleContentModalClose} animation={false}>
        <ModalHeader closeButton>
          <ModalTitle>Cycle content</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {cycleContent.map((work) => (
            <div key={work['work.id']}>
              <h4>{work['work.title']}</h4>
              <p>{work['work.author']}</p>
            </div>
          ))}
        </ModalBody>
      </Modal>
    </>
  );
};

export default CycleDetailComponent;
