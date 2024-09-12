import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Avatar, Button, Stack, Typography} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import { CommentBankOutlined } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/cycle/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import useCycleSumary from '@/src/useCycleSumary';
import useUserSumary from '@/src/useUserSumary';
import { Sumary } from '../../common/Sumary';
import { useRouter } from 'next/router';
import { useLast3CommentsByPageId } from '../hooks/useLast3CommentsByPageId';
import Image from 'next/image';
import { StyledInput } from './StyledInput';
interface Props extends CardProps {
  cycleId:number;
  userId:number;
  commentURL:string;
  commentText:string;
  page_id:number;
  createdAt:Date;
}
export default function CommentOnCycleCard(props:Props) {
  const{
    cycleId,
    userId,
    commentURL,
    commentText,
    page_id,
    createdAt
  }=props;
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:cycle}=useCycleSumary(cycleId);
  const{data:user}=useUserSumary(userId);
  const{show}=useModalContext();
  const{data:session}=useSession();
  const handleExpandClick = () => {
    if(session?.user)
      router.push(commentURL);
    else show(<SignInForm/>)
  };
  ///cycle/29?ht-comment-id=15934922
  // const page_id = commentURL?.replace(/^.*-id=(\d*)/g,'$1');
  const {data:last3Comments}=useLast3CommentsByPageId(page_id);

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
              {t('commentOnCycleActiveTitle')}
              <strong> {cycle?.title}</strong>
            </Typography>
          }
          subheader={(new Date(createdAt!)).toLocaleDateString(lang)}
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={2}>
            <MosaicItem hideFooter hideHeader cycleId={cycleId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            <Stack alignItems={'baseline'} gap={2}>
              {/* <Sumary description={commentText}/> */}
              <Stack direction={'row'}>
                <UserAvatar size='small' name={user?.name!} userId={userId} image={user?.image!} photos={user?.photos!}/>
                <StyledInput  placeholder={t('replyCommentLbl')}/>
                {/* <Button onClick={handleExpandClick}>
                  <CommentBankOutlined /> {t('replyCommentLbl')}
                </Button> */}
              </Stack>
              {last3Comments?.map((c:any)=><Stack key={c.id} direction={'row'} gap={1}>
                  <Avatar  sx={{width:32,height:32}}><img src={c.user.picture_url} width={32} height={32}/></Avatar>
                <Stack>
                  <Typography variant='caption'>{c.user.name}</Typography>
                  <Sumary description={c.body_html}/>
                </Stack>
                  {/* <UserAvatar userId={c.user.sso_id} name={c.user.name!} size='small'/> */}
                </Stack>
              )}
            </Stack>
        </Stack>
      </CardContent>
    </Card>;
}
