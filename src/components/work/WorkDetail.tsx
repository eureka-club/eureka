import classNames from 'classnames';
import { FunctionComponent } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import { AiFillHeart } from 'react-icons/ai';
import { BsBookmarkFill, BsBoxArrowUpRight } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';

import LocalImageComponent from '../LocalImage';
import { WorkWithImages } from '../../types/work';
import UnclampText from '../UnclampText';
import WorkSummary from './WorkSummary';
import styles from './WorkDetail.module.css';

interface Props {
  work: WorkWithImages;
}

const WorkDetail: FunctionComponent<Props> = ({ work }) => {
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

          {work.contentText != null && <UnclampText text={work.contentText} clampHeight="20rem" />}
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
