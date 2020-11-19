import classNames from 'classnames';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

import { CycleFullDetail, isCycleFullDetail } from '../types';
import LocalImage from './LocalImage';
import styles from './CycleDetail.module.css';

interface Props {
  cycle: CycleFullDetail;
}

const CycleDetail: FunctionComponent<Props> = ({ cycle }) => {
  const contentTextTokens =
    cycle['cycle.content_text'] != null
      ? cycle['cycle.content_text'].split('\n').filter((token: string) => token !== '')
      : [];

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

        <Col md={{ span: 5 }}>&nbsp;</Col>
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
