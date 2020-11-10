import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import { ASSETS_BASE_URL } from '../constants';
import { CycleObject } from '../types';
import styles from './PostDetail.module.css';

interface Props {
  cycle: CycleObject;
}

const CycleDetail: FunctionComponent<Props> = ({ cycle }) => {
  return (
    <Row>
      <Col>
        <div className="mb-4">
          <h1>{cycle.title}</h1>
          <span>
            Dates: {cycle.startDate}&#8209;{cycle.endDate}
          </span>
        </div>

        <p>
          Maecenas sollicitudin sollicitudin arcu, ac fringilla quam pellentesque et. Vivamus euismod ante et pulvinar
          imperdiet. Nullam finibus diam vitae tempus faucibus. Duis egestas pharetra lorem at ultricies. Donec ac
          consequat erat. Maecenas congue varius urna a dignissim. Donec fringilla, magna ac posuere dictum, massa mi
          posuere neque, eget pretium enim quam sed mauris.
        </p>
        <p>
          Nunc efficitur rhoncus mattis. Nullam vitae mollis turpis. Suspendisse varius viverra nisi, sit amet convallis
          libero fermentum a. Nam ut metus ac lacus faucibus dictum commodo eu dui. Duis eget nunc iaculis, gravida ex
          vel, fringilla augue. Nunc euismod magna at accumsan molestie. Curabitur mattis ante sed lorem condimentum
          mattis. Integer ac purus mattis, mattis odio id, facilisis enim. Nam scelerisque, risus vel aliquam finibus,
          ex urna dapibus elit, eget ullamcorper ante nisl at velit.
        </p>
      </Col>

      <Col md={{ span: 5 }}>
        <div className={styles.imgWrapper}>
          <img src={`${ASSETS_BASE_URL}/${cycle.image}`} alt={cycle.title} />
        </div>
      </Col>
    </Row>
  );
};

export default CycleDetail;
