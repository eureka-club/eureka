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
interface Props extends CardProps {
  workId:number;
  userId:number;
  commentURL:string;
  commentText:string;
  createdAt:Date;
}
export default function CommentOnWorkCard(props:Props) {
  const{
    workId,
    userId,
    commentURL,
    commentText,
    createdAt
  }=props;
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:work}=useWorkSumary(workId);
  const{data:user}=useUserSumary(userId);
  const{show}=useModalContext();
  const{data:session}=useSession();
  const handleExpandClick = () => {
    if(session?.user)
      router.push(commentURL);
    else show(<SignInForm/>)
  };

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
              <Sumary description={commentText}/>
              <Button onClick={handleExpandClick}>
                  <CommentBankOutlined /> {t('replyCommentLbl')}
              </Button>
            </Stack>
        </Stack>
      </CardContent>
    </Card>;
}
