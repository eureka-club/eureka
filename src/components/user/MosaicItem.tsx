// import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
// import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
// import { User } from '@prisma/client';
import router from 'next/router';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
import UserAvatar from '../common/UserAvatar';
// import LocalImageComponent from '../LocalImage';
// import TagsInput from '../forms/controls/TagsInput';
// import { Session } from '../../types';
import { UserMosaicItem } from '../../types/user';

interface Props {
  user: UserMosaicItem;
  showSocialInteraction?: boolean;
  className?:string;
  // showButtonLabels?: boolean;
  // showShare?: boolean;
}
const openUserMediatheque = (id: number) => {
  router.push(`/mediatheque/${id}`).then(() => window.scrollTo(0, 0));
};

const MosaicItem: FunctionComponent<Props> = ({ user, showSocialInteraction = false, className = '' }) => {
  const { t } = useTranslation('common');
  const { id, name, countryOfOrigin /* image  , tags */ } = user;
  const {data:session} = useSession();

  return (
    <Card className={`${styles.container} ${className}`} onClick={() => openUserMediatheque(id)} data-cy={`mosaic-item-user-${user.id}`}>
      <Row className='d-flex flex-row'>
        <Col xs={3} md={3}>
          <section>
            <UserAvatar width={42} height={42} userId={user.id} showName={false} />
          </section>
          {/* <img src={image || '/assets/avatar.png'} alt="User Avatar" /> */}
        </Col>
        <Col xs={9} md={9}>
          <h6>{name || 'unknown'}</h6>
          {countryOfOrigin && (
            <em>
              <AiOutlineEnvironment /> {t(`countries:${countryOfOrigin}`)}
            </em>
          )}
          {/* <TagsInput tags={tags || ''} readOnly label="" /> */}
        </Col>
      </Row>

      {/* {session && showSocialInteraction && (
        <Card.Footer className="text-muted">
          {user && <SocialInteraction showButtonLabels={false} showCounts={false} entity={user} />}
        </Card.Footer>
      )} */}
    </Card>
  );
};

export default MosaicItem;
