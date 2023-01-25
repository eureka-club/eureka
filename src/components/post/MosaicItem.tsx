import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Badge,Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import { DATE_FORMAT_SHORT } from '../../constants';
import SocialInteraction from '../common/SocialInteraction';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import {  Session } from '../../types';
import Avatar from '../common/UserAvatar';
import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import {useAtom} from 'jotai'
import globalModals from '@/src/atoms/globalModals'
import editOnSmallerScreens from '@/src/atoms/editOnSmallerScreens'
import usePost from '@/src/usePost'
import { useSession} from 'next-auth/react';
interface Props {
  postId: number|string;
  //display?: 'v' | 'h';
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  showCreateEureka?: boolean;
  showSaveForLater?: boolean;
  showdetail?: boolean;
  style?: { [k: string]: string };
  cacheKey?: string[];
  showTrash?: boolean;
  showComments?: boolean;
  linkToPost?: boolean;
  size?: string;
  className?: string;
}

const NewMosaicItem: FunctionComponent<Props> = ({
  postId,
  //display = 'v',
  showSocialInteraction = true,
  showCreateEureka,
  showSaveForLater,
  showdetail = true,
  cacheKey:ck,
  showComments = false,
  linkToPost = true,
  size,
  className,
}) => {
  const cacheKey = ck || ['POST',`${postId}`]
  const [gmAtom,setGmAtom] = useAtom(globalModals);
  const { t } = useTranslation('common');
  const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  const [k,setK] = useState<[string,string]>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [postParent,setPostParent] = useState<CycleMosaicItem|WorkMosaicItem>();
  const {data:session} = useSession()

  const {data:post} = usePost(+postId,{
    enabled:!!postId
  })

  useEffect(()=>{
    if(post){
      if(post.works.length)setPostParent(post.works[0] as WorkMosaicItem)
      if(post.cycles.length)setPostParent(post.cycles[0] as CycleMosaicItem)
    }
  },[post])
   
   if(!post)return <></>

  const parentLinkHref = ((): string | null => {
    if (post.works.length) {
      return `/work/${post.works[0].id}`;
    }
    else if (post.cycles[0]) {
      return `/cycle/${post.cycles[0].id}`;
    }
    return null;
  })();
  const postLinkHref = ((): string => {
    if (post.works.length) {
      return `/work/${post.works[0].id}/post/${post.id}`;
    }
    else if (post.cycles.length) {
      return `/cycle/${post.cycles[0].id}/post/${post.id}`;
    }    
    return `/post/${post.id}`;
  })();

  const { /* title, localImages, id, */ type } = post;
 
  const canEditPost = ()=>{
    if(session)
      return post.creatorId == (session as unknown as Session).user.id
    return false;
  }
  const onEditPost = async (e:React.MouseEvent<HTMLButtonElement>) => {
    router.push(`/post/${post.id}/edit`)
  }

   const onEditSmallScreen = async (e:React.MouseEvent<HTMLButtonElement>) => {
        setGmAtom(res=>({...res, editPostId:post.id}))
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: true } });
  }

  const renderVerticalMosaic = (props: { showDetailedInfo: boolean,specifyDataCy?:boolean,commentSection?:boolean }) => {
  const { showDetailedInfo, specifyDataCy=true,commentSection=false } = props;

  const getParentTitle = () => {
      let res = '';
      if (post.works.length) {
        res = post.works[0].title
      }
      else if(post.cycles.length){
        res = post.cycles[0].title
      }
      return res;
  };
   
    const renderParentTitle = () => {
      let res = '';
      let full =''
      if (post.works.length) {
        full = post.works[0].title
        res = full.slice(0, 10);
      }
      else if(post.cycles.length){
        full = post.cycles[0].title
        res = full.slice(0, 10);
      }
      if (res.length + 3 < full.length) res = `${res}...`;
      else res = full;
      return res;
    };

    const canNavigate = () => {
      return !loading;
    };
    const onImgClick = () => {
      if (canNavigate()) router.push(postLinkHref);
      setLoading(true);
    };  

    const renderLocalImageComponent = () => {
      const img = post?.localImages 
        ? <LocalImageComponent className='post-img-card' filePath={post?.localImages[0].storedFile} title={post?.title} alt={post?.title} />
        : undefined;
      if (linkToPost) {
        return (
          <div
          className={`${!loading ? 'cursor-pointer' : ''}`}
          onClick={onImgClick}
          role="presentation"
        >
          {!canNavigate() && <Spinner className="position-absolute top-50 start-50" size="sm" animation="grow" variant="info" style={{zIndex:'1'}} />}
          {img}
        </div>
        );
      }
      return img;
    };

    return (
      <Card className={`${size?.length ? `mosaic-${size}` : 'mosaic'}  ${className}`} data-cy={specifyDataCy ? `mosaic-item-post-${post.id}`:''}>
        <Card.Body>       
        <div className={`${styles.imageContainer}`}>
          {renderLocalImageComponent()}        
          {post && showdetail && (
          <div className={`${styles.postDetail}`}>
               <div  className={`d-flex flex-row fs-6 `}>
                <Avatar width={27} height={27} userId={post.creator.id} showFullName={false} size= {(!size) ? "xs" :"sm" } />
                <span className={` ms-1 me-1 d-flex align-items-center ${(!size) ?  styles.detailText : ""}`}>-</span>
                <span className={`d-flex align-items-center ${(!size) ?  styles.detailText : ""}`}>{dayjs(post.createdAt).format(DATE_FORMAT_SHORT)}</span>
                </div>
             </div>
            )}
          <Badge bg="success" className={`fw-normal fs-6 text-white px-2 rounded-pill ${styles.type}`}>
            {t(type || 'post')}
          </Badge>
        </div>


        {showDetailedInfo && (
          <div className={`${styles.detailedInfo}`}>
            <h6 className="mb-0 px-1 text-center d-flex justify-content-center align-items-center  h-100" data-cy="post-title">
              <Link href={postLinkHref}>
                <a title={(post.title.length > 45) ? post.title : ''} className={`text-primary ${styles.title}`}>{(post.title.length > 45) ? `${post.title.slice(0,45)}...` : post.title}</a>
              </Link>              
            </h6>
          </div>
        )}
      </Card.Body>    
      {showSocialInteraction && post && (
          <Card.Footer className={`d-flex ${styles.footer} d-flex justify-content-between`}>
                {(
          <h2 className="m-0 p-1 fs-6 text-info" data-cy="parent-title">
            {/*<FaRegCompass className="text-info" />*/}
            {` `}
            {parentLinkHref != null ? (
              <Link href={parentLinkHref}>
                <a title={getParentTitle()} className="text-info">
                  <span>{renderParentTitle()} </span>
                </a>
              </Link>
            ) : (
              <h2 className="m-0 p-1 fs-6 text-secondary">{renderParentTitle()}</h2>
            )}
          </h2>
        )}
            <SocialInteraction
              cacheKey={cacheKey}
              showButtonLabels={false}
              showCounts={false}
              entity={post}
              parent={postParent}
              showRating={false}
              showTrash={false}
              showSaveForLater={showSaveForLater}
              className="ms-auto"
            />
          </Card.Footer>
      )} 
      </Card>
    );
  };
  
  return <>{renderVerticalMosaic({ showDetailedInfo: true })}</>;
};

export default NewMosaicItem;
