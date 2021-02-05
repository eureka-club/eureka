import { Cycle, LocalImage, User } from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { FunctionComponent, MouseEvent, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import { AiFillHeart } from 'react-icons/ai';
import { BsBookmarkFill, BsBoxArrowUpRight, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';

import LocalImageComponent from '../LocalImage';
import CycleSummary from './CycleSummary';
import styles from './CycleDetail.module.css';

interface Props {
  cycle: Cycle & {
    creator: User;
    localImages: LocalImage[];
  };
}

const CycleDetailComponent: FunctionComponent<Props> = ({ cycle }) => {
  return (
    <>
      <Row className="mb-5">
        <Col md={{ span: 3 }}>
          <div className={classNames(styles.imgWrapper, 'mb-3')}>
            <LocalImageComponent filePath={cycle.localImages[0].storedFile} alt={cycle.title} />
          </div>
        </Col>
        <Col md={{ span: 9 }}>
          <div className="pt-3 px-4">
            <div className={styles.cycleCreator}>
              <img
                src={cycle.creator.image || '/img/default-avatar.png'}
                alt="creator avatar"
                className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
              />
              {cycle.creator.name}
            </div>
            <h1>{cycle.title}</h1>
            <CycleSummary cycle={cycle} />
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
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <TabContainer defaultActiveKey="cycle-content" transition={false}>
            <Row className="mb-4">
              <Col>
                <Nav variant="tabs" fill>
                  <NavItem>
                    <NavLink eventKey="cycle-content">Cycle content</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="posts">Posts</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="forum">Forum</NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col>
                <TabContent>
                  <TabPane eventKey="cycle-content">
                    <h4>Cycle content</h4>
                  </TabPane>
                  <TabPane eventKey="posts">
                    <h4>Posts</h4>
                  </TabPane>
                  <TabPane eventKey="forum">
                    <h4>Forum</h4>
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

export default CycleDetailComponent;
