import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Box, Button, Stack, Typography} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/post/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import { useRouter } from 'next/router';
import usePostSumary from '@/src/usePostSumary';
import { useLastNCommentsByPageId } from '../hooks/useLastNCommentsByPageId';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import UserCommentDetail from './UserCommentDetail';
import Skeleton from '../../Skeleton';
import {Skeleton as SkeletonMUI}  from '@mui/material';
import { useGetCommentById } from '../hooks/useGetCommentById';
dayjs.extend(relativeTime);

interface Props extends CardProps {
  postId:number;
  commentURL:string;
}

const CardTitle=({userName,postTitle,createdAt,isLoadingComment,isLoadingPost}:{userName?:string,postTitle?:string,createdAt?:string,isLoadingComment:boolean,isLoadingPost:boolean})=>{
  const{t}=useTranslation('feed');

  return <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
    <Typography sx={{flex:1}}>
        {
          !isLoadingComment 
            ? <strong>{userName} </strong>
            : <SkeletonMUI variant="text" width={150} sx={{display:'inline-block'}} />
        }
        <span style={{padding:'0 .25rem'}}>{t('commentOnWorkTitle')}</span>
        {
         !isLoadingPost
            ? <strong>{postTitle}</strong>
            : <SkeletonMUI variant="text" width={240} sx={{display:'inline-block'}} />
        }
    </Typography>
    <Typography variant='caption' paddingRight={1.5}>{createdAt}</Typography>
  </Stack>;
}

export default function CommentOnPostCard(props:Props) {
  const{
    postId,
    commentURL
  }=props;
  // const[comment,setComment]=React.useState<any>();
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:post,isLoading:isLoadingPost}=usePostSumary(postId);

  const{show}=useModalContext();
  const{data:session}=useSession();

  const commnet_id = commentURL?.replace(/(.*ht-comment-id=)/g,'')
  
  const {data:comment,isLoading:isLoadingComment}=useGetCommentById(commnet_id);
  // React.useEffect(()=>{
  //   if(data?.length){
  //     setComment(data[0]);
  //   }
  // },[data])
  
  const handleExpandClick = () => {
    const baseParent = post?.works?.length ? 'work' : 'cycle';
    const baseParentId = post?.works?.length ? post?.works[0].id : post?.cycles[0];

    if(session?.user)
      router.push(`/${baseParent}/${baseParentId}/post/${postId}?ht-comment-id=${comment?.id}`);
    else show(<SignInForm/>)
  };
  // if(isLoading)return <Skeleton type="card" />;  
  
  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
      <CardHeader
          avatar={
            <>
                <UserAvatar 
                  userId={comment?.user.sso_id} 
                />
            </>
          }
          title={
            <CardTitle 
              userName={comment?.user.name}
              postTitle={post?.title}
              createdAt={dayjs(comment?.created_at*1000).locale(lang).fromNow()}
              isLoadingComment={isLoadingComment}
              isLoadingPost={isLoadingPost}
            />
          }
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={1}>
          <MosaicItem postId={postId} sx={{
            'img':{
              maxWidth:'250px'
            }
          }}/>
          <Stack gap={3} sx={{width:'100%'}}>
            {
              isLoadingComment 
                ? <Skeleton type="card" />
                : <UserCommentDetail isFull={comment?.parent} comment={comment?.parent} 
                  body={
                    <>
                      {comment?.parent?.body_html ? <Box dangerouslySetInnerHTML={{__html:comment?.parent?.body_html}}/>:<></>}
                      <UserCommentDetail comment={comment} 
                        sx={
                          comment?.parent 
                            ? {
                              backgroundColor:'#dddddd85  ',
                              borderRadius:'.5rem',
                              padding:'1rem'
                            }
                            : {}
                        }
                        body={
                          <Box dangerouslySetInnerHTML={{__html:comment?.body_html}}/>
                        }
                        isFull={comment?.parent}
                      />
                    </>
                  }
                  />
            }
              <Box display={'flex'} justifyContent={'center'}>
                <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
                  {session?.user ? t('common:replyCommentLbl') : t('common:notSessionreplyCommentLbl')}
                </Button>
              </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>;
}
