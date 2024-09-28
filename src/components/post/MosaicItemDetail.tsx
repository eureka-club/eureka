import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Badge,Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import { DATE_FORMAT_SHORT, LOCALES } from '../../constants';
import SocialInteraction from './SocialInteraction';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItemDetail.module.css';
import { Session } from '../../types';
import UserAvatar from '../common/UserAvatar';
import { CycleDetail } from '@/src/types/cycle';
import { WorkDetail } from '@/src/types/work';
import {useAtom} from 'jotai'
import globalModals from '@/src/atoms/globalModals'
import editOnSmallerScreens from '@/src/atoms/editOnSmallerScreens'
import usePost from '@/src/usePostDetail'
import { useSession} from 'next-auth/react';
import { PostSumary } from '@/src/types/post';
import usePostSumary from '@/src/usePostSumary';
interface Props {
  post?:PostSumary;
  postId: number|string;
  //display?: 'v' | 'h';
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  showCreateEureka?: boolean;
  showSaveForLater?: boolean;
  showdetail?: boolean;
  style?: { [k: string]: string };
  cacheKey?: [string,string];
  showTrash?: boolean;
  showComments?: boolean;
  linkToPost?: boolean;
  size?: string;
  className?: string;
}

const MosaicItemDetail: FunctionComponent<Props> = ({
  post:postItem,
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
  const [postParent,setPostParent] = useState<CycleDetail|WorkDetail>();
  const {data:session} = useSession()

  const {data} = usePostSumary(+postId,{
    enabled:!!postId && !postItem
  })

  const [post,setPost] = useState(postItem)
  useEffect(()=>{
    if(!postItem && data)setPost(data)
  },[data])

  useEffect(()=>{
    if(post){
      if(post.works.length)setPostParent(post.works[0] as WorkDetail)
      if(post.cycles.length)setPostParent(post.cycles[0] as CycleDetail)
    }
  },[post])
   
   if(!post)return <></>

  
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
      return post.creator.id == (session as unknown as Session).user.id
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
      <Card className={` mosaic-post-detail  ${className}`} data-cy={specifyDataCy ? `mosaic-item-post-${post.id}`:''}>
        <Card.Body>  
        <div className={`${styles.imageContainer}`}>
          {renderLocalImageComponent()}        
          {post && showdetail && (
          <div className={`${styles.postDetail}`}>
               <div  className={`d-flex flex-row fs-6 `}>
                <UserAvatar userId={post.creator.id} size= {(!size) ? "small" :"medium" } />
                <span className={` ms-1 me-1 d-flex align-items-center ${(!size) ?  styles.detailText : ""}`}>-</span>
                <span className={`d-flex align-items-center ${(!size) ?  styles.detailText : ""}`}>{dayjs(post.createdAt).format(DATE_FORMAT_SHORT)}</span>
                </div>
             </div>
            )}
          <Badge bg="success" className={`fw-normal fs-6 text-white px-2 rounded-pill ${styles.type}`}>
            <span>
              {t(type || 'post')}
              {
              post.language
                ?<em>
                  {` (${LOCALES[post.language].toUpperCase()})`}
                </em>
                :<></>
              }
            </span>
          </Badge>
        </div>
       
      </Card.Body>    
      {showSocialInteraction && post && (
          <Card.Footer className={` ${styles.footer}`}>
               
            <SocialInteraction
              cacheKey={cacheKey}
              showButtonLabels={false}
              showCounts={false}
              post={post}
              parent={postParent}
              showTrash={false}
              showSaveForLater={showSaveForLater}
              className="ms-auto"
              showTitle={false}
            />
          </Card.Footer>
      )} 
      </Card>
    );
  };

  
  return <>{renderVerticalMosaic({ showDetailedInfo: true })}</>;
};

export default MosaicItemDetail;

