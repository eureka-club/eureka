import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Box, Button, Skeleton, Stack, Typography} from '@mui/material';
import HyvorComments from '../../common/HyvorComments';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import { CommentBankOutlined } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/post/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import usePostSumary from '@/src/usePostSumary';
import { Sumary } from '../../common/Sumary';
import { useOnPostCommentCreated } from '../../common/useOnPostCommentCreated';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import useWorkSumary from '@/src/useWorkSumary';
import Link from 'next/link';
import {Skeleton as SkeletonMUI}  from '@mui/material';

import { WorkSumary } from '@/src/types/work';
import { PostSumary } from '@/src/types/post';

interface Props extends CardProps {
  postId:number;
  workId:number;
  createdAt:Date;
}
const CardTitle = ({workId,workTitle,postCreatorName,createdAt,isLoadingPost,isLoadingWork}:{workId?:string|number,postCreatorName?:string,workTitle?:string,createdAt:Date,isLoadingPost:boolean,isLoadingWork:boolean})=>{
  const{t,lang}=useTranslation('feed');

  return <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
    <Typography sx={{flex:1}}>
      {
        !isLoadingPost 
           ? <strong>{postCreatorName!} </strong>
           : <SkeletonMUI variant="text" width={150} sx={{display:'inline-block'}} />
      }
      <span style={{padding:'0 .25rem'}}>{t('postOnWorkTitle')}</span>
      {
        !isLoadingWork
          ? <strong style={{paddingLeft:'.25rem'}}>
              <Link href={`/work/${workId}`}>
                {workTitle}
              </Link>
            </strong>
          : <SkeletonMUI variant="text" width={150} sx={{display:'inline-block'}} />
      }
      
    </Typography>
    <Typography variant='caption' paddingRight={1.5}>{dayjs(createdAt).locale(lang).fromNow()}</Typography>
  </Stack>;
}
export default function PostOnWorkCard(props:Props) {
  const{
    postId,
    workId,
    createdAt
  }=props;
  const{t}=useTranslation('feed');
  const{data:post,isLoading:isLoadingPost}=usePostSumary(postId);
  const{data:work,isLoading:isLoadingWork}=useWorkSumary(workId);
  const [expanded, setExpanded] = React.useState(false);
  const{show}=useModalContext();
  const{dispatch}=useOnPostCommentCreated(postId);
  const{data:session}=useSession();
  const handleExpandClick = () => {
    if(session?.user)
      setExpanded(!expanded);
    else show(<SignInForm/>)
  };

  // if(isLoadingWork || isLoadingPost || status == 'loading')
  //   return <></>;

  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
      <CardHeader
          avatar={
            <UserAvatar userId={post?.creator.id!} />
          }
          title={
            <CardTitle 
              postCreatorName={post?.creator?.name!}
              workId={workId} 
              workTitle={work?.title} 
              createdAt={createdAt}
              isLoadingPost={isLoadingPost}
              isLoadingWork={isLoadingWork}
            />
          }
          // subheader={(new Date(post?.createdAt!)).toLocaleDateString(lang)}
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={2}>
            <MosaicItem postId={postId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            <Stack flex={1} gap={1}>
              { 
                isLoadingPost 
                  ? <>
                      <SkeletonMUI variant="text" width={'100%'} sx={{display:'inline-block'}} />
                      <SkeletonMUI variant='rectangular' width={'100%'} height={'50%'} sx={{display:'inline-block'}} />
                    </>
                  : <>
                      <Typography variant='h6'>{post?.title}</Typography>
                      {
                          post?.contentText ? <Sumary description={post?.contentText??''}/> 
                          : <></>
                      }
                    </>
              }
              {
                !session 
                  ? <Box display={'flex'} justifyContent={'center'}>
                      <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
                      {t('common:notSessionreplyCommentLbl')}
                      </Button>
                  </Box>
                  : <></>
              }
            </Stack>
        </Stack>
        {
          session 
          ? <HyvorComments 
          entity='post' 
          id={`${postId}`} 
          session={session!}  
          OnCommentCreated={(comment)=>dispatch(comment)}
          />
          : <></>
        }
                    
      </CardContent>
      
      {/* <CardActions sx={{justifyContent:"end"}}>
        <Box display={'flex'} justifyContent={'center'}>
          <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
            {session?.user ? t('replyCommentLbl') : t('notSessionreplyCommentLbl')}
          </Button>
        </Box>
      </CardActions> */}
    </Card>;
}
