import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { AiOutlineEnvironment,AiOutlineUserAdd } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import styles from './MosaicItem.module.css';
import UserAvatar from '../common/UserAvatar';
import { UserMosaicItem } from '../../types/user';
import TagsInput from '../forms/controls/TagsInput';
import LocalImageComponent from '@/src/components/LocalImage';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

import slugify from 'slugify'

interface Props {
  user: UserMosaicItem;
  showSocialInteraction?: boolean;
  className?:string;
  MosaicDetailed?:boolean
  // showButtonLabels?: boolean;
  // showShare?: boolean;
}
const getMediathequeSlug = (user:UserMosaicItem)=>{
  if(user){
    const s =`${user.name}`
    const slug = `${slugify(s,{lower:true})}-${user.id}` 
    return slug
  }
  return ''
}
const openUserMediatheque = (user:UserMosaicItem) => {

  router.push(`/mediatheque/${getMediathequeSlug(user)}`).then(() => window.scrollTo(0, 0));
};

const MosaicItem: FunctionComponent<Props> = ({ user, showSocialInteraction = false, className = '',MosaicDetailed = false }) => {
  const { t } = useTranslation('common');
  const { id, name, countryOfOrigin /* image*/  , tags  } = user;
  const {data:session} = useSession();
  
  
  return <>
    {!MosaicDetailed ? <Card className={`${styles.container} ${className}`} onClick={() => openUserMediatheque(user)} data-cy={`mosaic-item-user-${user.id}`}>
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
    </Card> : <Card className={`border border-2 ${styles.detailedContainer}`} data-cy={`mosaic-item-user-${user.id}`}>
        <div className='d-flex justify-content-end mt-2 me-2'>
          <OverlayTrigger
          key='right'
          placement='right'
          overlay={
            <Tooltip id={`tooltip-right`}>
             Follow
            </Tooltip>
          }
        >
          <Button size='sm'> <h4 className='m-0 p-0'><AiOutlineUserAdd className='text-white'/></h4></Button>
        </OverlayTrigger>
        </div>
        <div className='d-flex flex-row justify-content-center  px-3'>
           {(!user?.photos || !user?.photos.length) ?
               <img
                className="rounded rounded-circle"
                src={user.image||''}
                alt={user.name||''}
                style={{width:'140px',height:'140px'}}
              />:
           <LocalImageComponent /* className='avatarProfile' */className="rounded rounded-circle" width={140} height={140} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />}   
        </div>
        <div className='mt-2 d-flex flex-column justify-content-center align-items-center'>
          <h5 className='text-secondary'>{name || 'unknown'}</h5>
          <TagsInput className='mt-1 px-4 text-center' tags={tags || ''} readOnly label="" />
        </div>
    </Card>}</>
  
};

export default MosaicItem;
