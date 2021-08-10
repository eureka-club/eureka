// import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { AiOutlineEnvironment } from 'react-icons/ai';
// import { useQuery } from 'react-query';
import { useSession } from 'next-auth/client';
import { User } from '@prisma/client';
import router from 'next/router';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
// import LocalImageComponent from '../LocalImage';
// import TagsInput from '../forms/controls/TagsInput';
import { Session } from '../../types';

interface Props {
  user: User;
  showSocialInteraction?: boolean;
  // showButtonLabels?: boolean;
  // showShare?: boolean;
}
const openUserMediatheque = (id: number) => {
  router.push(`/mediatheque/${id}`).then(() => window.scrollTo(0, 0));
};

const MosaicItem: FunctionComponent<Props> = ({ user, showSocialInteraction = false }) => {
  const { t } = useTranslation('common');
  const { id, name, countryOfOrigin, image /* , tags */ } = user;
  const [session] = useSession() as [Session | null | undefined, boolean];

  return (
    <Card className={styles.container} onClick={() => openUserMediatheque(id)}>
      <Row>
        <Col xs={12} md={3}>
          <img src={image || '/assets/avatar.png'} alt="User Avatar" />
        </Col>
        <Col xs={12} md={9}>
          <h6>{name}</h6>
          <em>
            <AiOutlineEnvironment /> {t(`countries:${countryOfOrigin}`)}
          </em>
          {/* <TagsInput tags={tags || ''} readOnly label="" /> */}
        </Col>
      </Row>

      {session && showSocialInteraction && (
        <Card.Footer className="text-muted">
          {user && <SocialInteraction showButtonLabels={false} showCounts={false} showShare={false} entity={user} />}
        </Card.Footer>
      )}
    </Card>
  );
};

export default MosaicItem;
