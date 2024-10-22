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

dayjs.extend(relativeTime);

interface Props extends CardProps {
  postId:number;
  page_id:number;
}

export default function CommentOnPostCard(props:Props) {
  const{
    postId,
    page_id,
  }=props;
  const[lastComment,setlastComment]=React.useState<any>();
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:post}=usePostSumary(postId);

  const{show}=useModalContext();
  const{data:session}=useSession();

  const {data,isLoading}=useLastNCommentsByPageId(page_id,1);
  React.useEffect(()=>{
    if(data?.length){
      setlastComment(data[0]);
    }
  },[data])
  
  const handleExpandClick = () => {
    const baseParent = post?.works?.length ? 'work' : 'cycle';
    const baseParentId = post?.works?.length ? post?.works[0].id : post?.cycles[0];

    if(session?.user)
      router.push(`/${baseParent}/${baseParentId}/post/${postId}?ht-comment-id=${lastComment?.id}`);
    else show(<SignInForm/>)
  };
  if(isLoading)return <Skeleton type="card" />;  
  
  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
      <CardHeader
          avatar={
            <>
                <UserAvatar 
                  userId={lastComment?.user.sso_id} 
                />
            </>
          }
          title={
            <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
              <Typography sx={{flex:1}}>
                <strong>{lastComment?.user.name} </strong>
                {t('commentOnWorkTitle')}
                <strong> {post?.title}</strong>
              </Typography>
              <Typography variant='caption' paddingRight={1.5}>{dayjs(lastComment?.created_at*1000).locale(lang).fromNow()}</Typography>
            </Stack>
          }
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={1}>
          <MosaicItem postId={postId} sx={{
            'img':{
              maxWidth:'250px'
            }
          }}/>
          <Stack gap={3}>
              <UserCommentDetail isFull={lastComment?.parent} comment={lastComment?.parent} 
              body={
                <>
                  {lastComment?.parent?.body_html ? <Box dangerouslySetInnerHTML={{__html:lastComment?.parent?.body_html}}/>:<></>}
                  <UserCommentDetail comment={lastComment} 
                    sx={
                      lastComment?.parent 
                        ? {
                          backgroundColor:'#dddddd85  ',
                          borderRadius:'.5rem',
                          padding:'1rem'
                        }
                        : {}
                    }
                    body={
                      <Box dangerouslySetInnerHTML={{__html:lastComment?.body_html}}/>
                    }
                    isFull={lastComment?.parent}
                  />
                </>
              }
              />
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
