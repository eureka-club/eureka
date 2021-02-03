import classNames from 'classnames';
import dayjs from 'dayjs';
import { LocalImage, Work } from '@prisma/client';
import { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BsBoxArrowUpRight, BsChevronDown } from 'react-icons/bs';

import { DATE_FORMAT_ONLY_YEAR } from '../constants';
import LocalImageComponent from './LocalImage';
import styles from './WorkDetail.module.css';

interface Props {
  work: Work & {
    localImages: LocalImage[];
  };
}

const WorkDetail: FunctionComponent<Props> = ({ work }) => {
  const contentTextTokens =
    work.contentText != null ? work.contentText.split('\n').filter((token: string) => token !== '') : [];
  const contentTextClampRef = useRef<HTMLElement>(null);
  const contentTextRef = useRef<HTMLDivElement>(null);
  const [unclampButtonVisible, setUnclampButtonVisible] = useState(false);
  const [unclampStylesApplied, setUnclampStylesApplied] = useState(false);

  const handleExpandContentTextClick = (ev: MouseEvent) => {
    ev.preventDefault();

    if (contentTextClampRef?.current != null) {
      setUnclampStylesApplied(true);
      setUnclampButtonVisible(false);
    }
  };

  useEffect(() => {
    if (contentTextRef?.current?.offsetHeight != null && contentTextClampRef?.current?.offsetHeight != null) {
      if (contentTextRef.current.offsetHeight > contentTextClampRef.current.offsetHeight) {
        setUnclampButtonVisible(true);
      }
    }
  }, [contentTextClampRef, contentTextRef]);

  return (
    <>
      <Row>
        <Col md={{ span: 4 }}>
          <div className={classNames(styles.imgWrapper, 'mb-3')}>
            <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
          </div>
        </Col>
        <Col md={{ span: 8 }}>
          <section className="mb-4">
            <h1>{work.title}</h1>
            <h2 className={styles.titleWorkAuthor}>{work.author}</h2>
            <section className={styles.workSummary}>
              {[
                work.publicationYear &&
                  `${work.type === 'book' ? 'Publication year' : 'Release year'}:  ${dayjs(work.publicationYear).format(
                    DATE_FORMAT_ONLY_YEAR,
                  )}`,
                work.countryOfOrigin && `Country of origin: ${work.countryOfOrigin}`,
                work.length && `Length: ${work.length} ${work.type === 'book' ? 'pages' : 'minutes'}`,
              ]
                .filter((val) => val != null)
                .join(', ')}
            </section>
            {work.link != null && (
              <a href={work.link} className={styles.workLink} target="_blank" rel="noreferrer">
                Link to work <BsBoxArrowUpRight />
              </a>
            )}
          </section>
          <section
            className={classNames(styles.contentText, { [styles.contentTextUnclamped]: unclampStylesApplied })}
            ref={contentTextClampRef}
          >
            <div ref={contentTextRef}>
              {contentTextTokens.map((token) => (
                <p key={`${token[0]}${token[1]}-${token.length}`}>{token}</p>
              ))}
            </div>
          </section>
          {unclampButtonVisible && (
            <Button variant="link" onClick={handleExpandContentTextClick} className={styles.unclampButton}>
              view more <BsChevronDown />
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export default WorkDetail;
