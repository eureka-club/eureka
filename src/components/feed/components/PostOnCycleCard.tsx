import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Box, Button, Stack, Typography} from '@mui/material';
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
import {Skeleton}  from '@mui/material';
import useCycleSumary from '@/src/useCycleSumary';
import Link from 'next/link';


interface Props extends CardProps {
  postId:number;
  cycleId:number;
  createdAt:Date;
}
const CardTitle=({userName,cycleId,cycleTitle,createdAt}:{userName?:string,cycleId:number,cycleTitle?:string,createdAt:string})=>{
  const{t}=useTranslation('feed');

  return <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
    <Typography sx={{flex:1}}>
        {
          userName 
            ? <strong>{userName} </strong>
            : <Skeleton variant="text" width={150} sx={{display:'inline-block'}} />
        }
        <span style={{padding:'0 .25rem'}}>{t('postOnCycleTitle')}</span>
        {
         cycleTitle
            ? <strong>
               <Link href={`/cycle/${cycleId}`}>{cycleTitle}</Link> 
              </strong>
            : <Skeleton variant="text" width={240} sx={{display:'inline-block'}} />
        }
    </Typography>
    <Typography variant='caption' paddingRight={1.5}>{createdAt}</Typography>
  </Stack>;
}

export default function PostOnCycleCard(props:Props) {
  const{
    postId,
    cycleId,
    createdAt
  }=props;
  const{t,lang}=useTranslation('feed');
  const{data:post,isLoading:isLoadingPost}=usePostSumary(postId);
  const{data:cycle}=useCycleSumary(cycleId);
  const [expanded, setExpanded] = React.useState(false);
  const{show}=useModalContext();
  const{dispatch}=useOnPostCommentCreated(postId);
  const{data:session}=useSession();
  const handleExpandClick = () => {
    if(session?.user)
      setExpanded(!expanded);
    else show(<SignInForm/>)
  };

  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
      <CardHeader
          avatar={
            <>
              <UserAvatar userId={post?.creator.id!} />
            </>
          }
          title={
            <CardTitle cycleId={cycleId} cycleTitle={cycle?.title} userName={post?.creator.name!} createdAt={dayjs(createdAt).locale(lang).fromNow()}/>
          }
          // subheader={(new Date(post?.createdAt!)).toLocaleDateString(lang)}
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}}  gap={2}>
            <MosaicItem postId={postId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            <Stack flex={1} gap={1}>
              { 
                isLoadingPost 
                  ? <Skeleton variant="text" width={'100%'} sx={{display:'inline-block'}} />
                  : <Typography variant='h6'>{post?.title}</Typography>
              }
              {
                isLoadingPost 
                  ? <Skeleton variant='rectangular' width={'100%'} height={'50%'} sx={{display:'inline-block'}} />
                  : post?.contentText
                    ? <Sumary description={post?.contentText}/> 
                    : <></> 
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
            ? 
                <HyvorComments 
                    entity='post' 
                    id={`${postId}`} 
                    session={session!}  
                    OnCommentCreated={(comment)=>dispatch(comment)}
                />
            : <></>
        }
      </CardContent>
      
      {/* <CardActions sx={{justifyContent:"end"}}>
          {
            !session
              ? <Box>
              <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
              {t('notSessionreplyCommentLbl')}
              </Button>
            </Box>
              : <></>
          }
      </CardActions> */}
    </Card>;
}
