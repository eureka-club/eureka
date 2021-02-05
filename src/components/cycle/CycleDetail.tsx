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
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import styles from './CycleDetail.module.css';

interface Props {}

const CycleDetailComponent: FunctionComponent<Props> = ({ cycle }) => {
  return (
    <>
      <pre>{JSON.stringify(cycle, null, 2)}</pre>

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

export default CycleDetailComponent;
