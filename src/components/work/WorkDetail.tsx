import classNames from 'classnames';
import { LocalImage, Work } from '@prisma/client';
import { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import { BsBookmarkFill, BsBoxArrowUpRight, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { AiFillHeart } from 'react-icons/ai';
import { FiShare2 } from 'react-icons/fi';

import LocalImageComponent from '../LocalImage';
import WorkSummary from './WorkSummary';
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
  const [descriptionUnclamped, setDescriptionUnclamped] = useState(false);

  const handleExpandContentTextClick = (ev: MouseEvent) => {
    ev.preventDefault();

    if (contentTextClampRef?.current != null) {
      setDescriptionUnclamped(!descriptionUnclamped);
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
      <Row className="mb-5">
        <Col md={{ span: 4 }}>
          <div className={classNames(styles.imgWrapper, 'mb-3')}>
            <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
          </div>
          <section className={styles.socialInfo}>
            <span>
              <BsBookmarkFill /> #
            </span>
            <span>
              <AiFillHeart /> #
            </span>
            <span>
              <FiShare2 /> #
            </span>
          </section>
        </Col>
        <Col md={{ span: 8 }}>
          <section className="mb-4">
            <h1>{work.title}</h1>
            <h2 className={styles.author}>{work.author}</h2>
            <WorkSummary work={work} />

            {work.link != null && (
              <a href={work.link} className={styles.workLink} target="_blank" rel="noreferrer">
                Link to work <BsBoxArrowUpRight />
              </a>
            )}
          </section>
          <section
            className={classNames(styles.contentText, { [styles.contentTextUnclamped]: descriptionUnclamped })}
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
              {descriptionUnclamped === true ? (
                <>
                  view less <BsChevronUp />
                </>
              ) : (
                <>
                  view more <BsChevronDown />
                </>
              )}
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <TabContainer defaultActiveKey="all" transition={false}>
            <Row className="mb-4">
              <Col>
                <Nav variant="tabs" fill>
                  <NavItem>
                    <NavLink eventKey="all">All related</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="posts">Posts about this work</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="cycles">Cycles including this work</NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col>
                <TabContent>
                  <TabPane eventKey="all">
                    <h4>All related</h4>
                  </TabPane>
                  <TabPane eventKey="posts">
                    <h4>Posts about this work</h4>
                  </TabPane>
                  <TabPane eventKey="cycles">
                    <h4>Cycles including this work</h4>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </TabContainer>
        </Col>
      </Row>
    </>
  );
};

export default WorkDetail;
