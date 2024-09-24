import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button, Stack, Typography} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import { CommentBankOutlined } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/work/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import useUserSumary from '@/src/useUserSumary';
import { Sumary } from '../../common/Sumary';
import { useRouter } from 'next/router';
import useWorkSumary from '@/src/useWorkSumary';
import { useLast3CommentsByPageId } from '../hooks/useLast3CommentsByPageId';
import { useOnWorkCommentCreated } from '../../common/useOnWorkCommentCreated';
import HyvorComments from '../../common/HyvorComments';
interface Props extends CardProps {
  workId:number;
  userId:number;
  commentURL:string;
  commentText:string;
  page_id:number;
  createdAt:Date;
}
export default function CommentOnWorkCard(props:Props) {
  const{
    workId,
    userId,
    commentURL,
    commentText,
    page_id,
    createdAt
  }=props;
  
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:work}=useWorkSumary(workId);
  const{data:user}=useUserSumary(userId);
  const{show}=useModalContext();
  const{data:session}=useSession();

  // const {data:last3Comments}=useLast3CommentsByPageId(page_id);
  const{dispatch}=useOnWorkCommentCreated(workId);
  
  const handleExpandClick = () => {
    if(session?.user)
      router.push(commentURL);
    else show(<SignInForm/>)
  };
  if(!session?.user)return <></>;
  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
      <CardHeader
          avatar={
            <>
                <UserAvatar name={user?.name!} userId={userId} image={user?.image!} photos={user?.photos!}/>
            </>
          }
          title={
            <Typography>
              <strong>{user?.name!} </strong>
              {t('commentOnWorkTitle')}
              <strong> {work?.title}</strong>
            </Typography>
          }
          subheader={(new Date(createdAt!)).toLocaleDateString(lang)}
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={2}>
            <MosaicItem workId={workId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            <Stack alignItems={'baseline'} gap={2}>
              <HyvorComments 
                  entity='work' 
                  id={`${workId}`} 
                  session={session!}  
                  OnCommentCreated={(comment)=>dispatch(comment)}
              /> 
              {/* <Sumary description={commentText}/>
              <Button onClick={handleExpandClick}>
                  <CommentBankOutlined /> {t('replyCommentLbl')}
              </Button> */}
            </Stack>
        </Stack>
      </CardContent>
    </Card>;
}
