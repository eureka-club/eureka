const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

import { LOCALES } from "@/src/constants";
import { Size } from "@/src/types";
import usePostSumary from "@/src/usePostSumary";
// import Link from 'next/link';
// import useTranslation from 'next-translate/useTranslation';
// import React, { FunctionComponent, useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { Card, Badge,Spinner } from 'react-bootstrap';
// import dayjs from 'dayjs';
// import { DATE_FORMAT_SHORT, LOCALES } from '../../constants';
// import LocalImageComponent from '../LocalImage';
// import styles from './MosaicItem.module.css';
// import {  Session } from '../../types';
// import Avatar from '../common/UserAvatar';
// import { CycleDetail } from '@/src/types/cycle';
// import { WorkDetail } from '@/src/types/work';
// import {useAtom} from 'jotai'
// import globalModals from '@/src/atoms/globalModals'
// import editOnSmallerScreens from '@/src/atoms/editOnSmallerScreens'
// import { useSession} from 'next-auth/react';
// import { PostSumary } from '@/src/types/post';
// import { UserSumary } from '@/src/types/UserSumary';
// import SocialInteraction from './SocialInteraction';
// import usePostSumary from '@/src/usePostSumary';
// interface Props {
//   post?:PostSumary;
//   postId: number|string;
//   //display?: 'v' | 'h';
//   showButtonLabels?: boolean;
//   showShare?: boolean;
//   showSocialInteraction?: boolean;
//   showCreateEureka?: boolean;
//   showSaveForLater?: boolean;
//   showdetail?: boolean;
//   style?: { [k: string]: string };
//   cacheKey?: string[];
//   showTrash?: boolean;
//   showComments?: boolean;
//   linkToPost?: boolean;
//   imageLink?: boolean;
//   size?: string;
//   className?: string;
// }

import { Box, BoxProps, Card, CardMedia, Chip, Paper } from "@mui/material"
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

// const MosaicItem: FunctionComponent<Props> = ({
//   post:postItem,
//   postId,
//   //display = 'v',
//   showSocialInteraction = true,
//   showCreateEureka,
//   showSaveForLater,
//   showdetail = true,
//   cacheKey:ck,
//   showComments = false,
//   linkToPost = true,
//   imageLink = false,
//   size,
//   className,
// }) => {
//   const cacheKey = ck || ['POST',`${postId}`]
//   const [gmAtom,setGmAtom] = useAtom(globalModals);
//   const { t } = useTranslation('common');
//   const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
//   const [k,setK] = useState<[string,string]>();
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();
//   const [postParent,setPostParent] = useState<CycleDetail|WorkDetail>();
//   const {data:session} = useSession()

//   const {data} = usePostSumary(+postId
// )
  
//   const [post,setPost] = useState(postItem)
//   useEffect(()=>{
//     if(data)setPost(data)
//   },[data])

//   useEffect(()=>{
//     if(post){
//       if(post?.works.length)setPostParent(works[0] as WorkDetail)
//       if(cycles.length)setPostParent(cycles[0] as CycleDetail)
//     }
//   },[post])
   
//    if(!post)return <></>

//   const parentLinkHref = ((): string | null => {
//     if(post){
//       if (works?.length) {
//         return `/work/${works[0].id}`;
//       }
//       else if (cycles?.length && cycles[0]) {
//         return `/cycle/${cycles[0].id}`;
//       }
//     }
//     return null;
//   })();
//   const postLinkHref = ((): string => {
//     if(post){
//       if (post?.works.length) {
//         return `/work/${works[0].id}/post/${id}`;
//       }
//       else if (cycles.length) {
//         return `/cycle/${cycles[0].id}/post/${id}`;
//       }    

//     }
//     return `/post/${id}`;
//   })();

//   const { type } = post;
 
//   const canEditPost = ()=>{
//     if(session)
//       return creator.id == (session as unknown as Session).user.id
//     return false;
//   }
//   const onEditPost = async (e:React.MouseEvent<HTMLButtonElement>) => {
//     router.push(`/post/${id}/edit`)
//   }

//    const onEditSmallScreen = async (e:React.MouseEvent<HTMLButtonElement>) => {
//         setGmAtom(res=>({...res, editPostId:id}))
//         setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: true } });
//   }

//   const renderVerticalMosaic = (props: { showDetailedInfo: boolean,specifyDataCy?:boolean,commentSection?:boolean }) => {
//   const { showDetailedInfo, specifyDataCy=true,commentSection=false } = props;

//   const getParentTitle = () => {
//       let res = '';
//       if (post?.works.length) {
//         res = works[0].title
//       }
//       else if(cycles.length){
//         res = cycles[0].title
//       }
//       return res;
//   };
   
//     const renderParentTitle = () => {
//       let res = '';
//       let full =''
//       if (post?.works.length) {
//         full = works[0].title
//         res = full.slice(0, 10);
//       }
//       else if(cycles.length){
//         full = cycles[0].title
//         res = full.slice(0, 10);
//       }
//       if (res.length + 3 < full.length) res = `${res}...`;
//       else res = full;
//       return res;
//     };

//     const canNavigate = () => {
//       return !loading;
//     };
//     const onImgClick = () => {
//       if (canNavigate()) router.push(postLinkHref);
//       setLoading(true);
//     };  

//     const renderLocalImageComponent = () => {
//       const img = localImages 
//         ? <LocalImageComponent className='post-img-card' filePath={localImages[0].storedFile} title={title} alt={title} />
//         : undefined;
//       if (linkToPost) {
//         return (
//           <div
//           className={`${!loading ? 'cursor-pointer' : ''}`}
//           onClick={onImgClick}
//           role="presentation"
//         >
//           {!canNavigate() && <Spinner className="position-absolute top-50 start-50" size="sm" animation="grow" variant="info" style={{zIndex:'1'}} />}
//             {imageLink ? <a href={`${postLinkHref}`}>{img}</a> : img}
//         </div>
//         );
//       }
//       return img;
//     };

//     return (
//       <Card className={`${size?.length ? `mosaic-${size}` : 'mosaic'}  ${className}`} data-cy={specifyDataCy ? `mosaic-item-post-${id}`:''}>
//         <Card.Body>       
//         <div className={`${styles.imageContainer}`}>
//           {renderLocalImageComponent()}        
//           {post && showdetail && (
//           <div className={`${styles.postDetail}`}>
//                <div  className={`d-flex flex-row fs-6 `}>
//                 <Avatar name={creator.name!} userId={creator.id} size= {"small"} />
//                 <span className={` ms-1 me-1 d-flex align-items-center ${(!size) ?  styles.detailText : ""}`}></span>
//                 <span className={`d-flex align-items-center ${(!size) ?  styles.detailText : ""}`}>{dayjs(createdAt).format(DATE_FORMAT_SHORT)}</span>
//                 </div>
//              </div>
//             )}
//           <Badge bg="success" className={`fw-normal fs-6 text-white px-2 rounded-pill ${styles.type}`}>
//             <span>
//               {t(type || 'post')}
//               {
//               language
//                 ?<em>
//                   {` (${LOCALES[language].toUpperCase()})`}
//                 </em>
//                 :<></>
//               }
//             </span>
//           </Badge>
          
//         </div>


//         {showDetailedInfo && (
//           <div className={`${styles.detailedInfo}`}>
//             <h6 className="mb-0 px-1 text-center d-flex justify-content-center align-items-center  h-100" data-cy="post-title">
//               <Link href={postLinkHref}>
//                 <a title={(title.length > 45) ? title : ''} className={`text-primary ${styles.title}`}>{(title.length > 45) ? `${title.slice(0,45)}...` : title}</a>
//               </Link>              
//             </h6>
//           </div>
//         )}
//       </Card.Body>    
//       {showSocialInteraction && post && (
//           <Card.Footer className={` ${styles.footer} `}>
                
          
//           <SocialInteraction 
//           post={post}
//           cacheKey={cacheKey}
//           />
            
//           </Card.Footer>
//       )} 
//       </Card>
//     );
//   };
  
//   return <>{renderVerticalMosaic({ showDetailedInfo: true })}</>;
// };

// export default MosaicItem;
interface Props extends BoxProps{
  postId:number;
  size?:Size
}
const MosaicItem:FC<Props> = ({postId,size,...others}:Props)=>{
  const {t,lang}=useTranslation('common');
  const{data:post}=usePostSumary(postId);
  const storedFile = post?.localImages[0].storedFile??'asd';
  let parentName = "";
  let parentId = undefined;
  
  if(post?.cycles?.length){
    parentName = 'cycle';
    parentId = post?.cycles[0].id; 
  } 
  else if(post?.works.length){
    parentName = 'work';
    parentId = post?.works[0].id;
  }

  const href = parentId 
    ? `${lang}/${parentName}/${parentId}/post/${postId}`
    : '#';

  return <Box
      sx={{
        'img':{
          height:'360px',
        }
      }}
      {...others}
      style={{
        position:'relative',
      }}
    >
      
        <Chip 
        
          label={
            <span>
                {t(post?.type || 'post')}
                {
                  post?.language
                    ?<em>
                      {` (${LOCALES[post?.language].toUpperCase()})`}
                    </em>
                    :<></>
                }
              </span>
          } 
          color="error" sx={{position:'absolute',top:'8px',left:'8px',boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)'}
          }
        />
      
      <Link href={href}>
        <img 
          className="post-mosaic-img"
          src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${storedFile}`}
          style={{
            border:'solid 1px lightgray',
            borderRadius:'4px',
            boxShadow:`0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)`
          }}
        />
      </Link>
  </Box>
}
export default MosaicItem;

