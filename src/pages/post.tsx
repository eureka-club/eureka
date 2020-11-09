import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import { IMG_URI_PREFIX } from '../constants';
import DetailLayout from '../components/layouts/DetailLayout';

const PostDetailPage: FunctionComponent = () => {
  return (
    <DetailLayout title="Magic night">
      <Row>
        <Col md={{ span: 7 }}>
          <h1>Magic night</h1>
          <span>DAV-19</span>

          <p>
            Maecenas sollicitudin sollicitudin arcu, ac fringilla quam pellentesque et. Vivamus euismod ante et pulvinar
            imperdiet. Nullam finibus diam vitae tempus faucibus. Duis egestas pharetra lorem at ultricies. Donec ac
            consequat erat. Maecenas congue varius urna a dignissim. Donec fringilla, magna ac posuere dictum, massa mi
            posuere neque, eget pretium enim quam sed mauris.
          </p>
          <p>
            Nunc efficitur rhoncus mattis. Nullam vitae mollis turpis. Suspendisse varius viverra nisi, sit amet
            convallis libero fermentum a. Nam ut metus ac lacus faucibus dictum commodo eu dui. Duis eget nunc iaculis,
            gravida ex vel, fringilla augue. Nunc euismod magna at accumsan molestie. Curabitur mattis ante sed lorem
            condimentum mattis. Integer ac purus mattis, mattis odio id, facilisis enim. Nam scelerisque, risus vel
            aliquam finibus, ex urna dapibus elit, eget ullamcorper ante nisl at velit.
          </p>
        </Col>

        <Col md={{ span: 5 }}>
          <img src={`${IMG_URI_PREFIX}/de7q9kj.png`} alt="Magic night" />
        </Col>
      </Row>
    </DetailLayout>
  );
};

export default PostDetailPage;
