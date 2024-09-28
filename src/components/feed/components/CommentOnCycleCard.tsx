import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { Avatar, Box, Button, Grid, Stack, Typography} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import { CommentBankOutlined } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/cycle/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import useCycleSumary from '@/src/useCycleSumary';
import useUserSumary from '@/src/useUserSumary';
import { useRouter } from 'next/router';
import HyvorComments from '../../common/HyvorComments';
import { useOnCycleCommentCreated } from '../../common/useOnCycleCommentCreated';
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
  const[comment,setcomment]=React.useState("");
  const{dispatch}=useOnCycleCommentCreated(cycleId);
  const handleExpandClick = () => {
    if(session?.user)
      router.push(commentURL);
    else show(<SignInForm/>)
  };
  ///cycle/29?ht-comment-id=15934922
  // const comment_id = commentURL?.replace(/^.*-id=(\d*)/g,'$1');
  // const {data:last3Comments}=useLast3CommentsByPageId(page_id);
  // const{mutate,isSuccess,isLoading}=useReplyComment(page_id)
  if(!session?.user)return <></>;
  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
      <CardHeader
          avatar={
            <>
                <UserAvatar userId={userId} />
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
              {/*Requiere inicio de session, de lo contrario no muestra nada*/} 
              <HyvorComments 
                entity='cycle' 
                id={`${cycleId}`} 
                session={session!}  
                OnCommentCreated={(comment)=>dispatch(comment)}
              /> 
              {/* <Sumary description={commentText}/>
              <Button onClick={handleExpandClick}>
                <CommentBankOutlined /> {t('replyCommentLbl')}
              </Button> */}
              {/* <Grid container>
                <Grid item sm={2} md={1}>
                  <UserAvatar size='small' name={user?.name!} userId={userId} image={user?.image!} photos={user?.photos!}/>
                </Grid>
                <Grid item sm={10} md={11}> 
                  <StyledInput 
                    placeholder={t('replyCommentLbl')} 
                    value={comment} 
                    onChange={(e)=>setcomment(e.target.value)}
                    onKeyUp={(e)=>{
                      if(e.code=='Enter'){
                        mutate({comment_id,body:comment})
                      }
                    }}
                  />
                </Grid>
              </Grid> */}
              
              {/* {last3Comments?.map((c:any)=><Stack key={c.id} direction={'row'} gap={1}>
                <Avatar  sx={{width:32,height:32}}><img src={c.user.picture_url} width={32} height={32}/></Avatar>
                <Stack>
                  <Typography variant='caption'>{c.user.name}</Typography>
                  <Sumary description={c.body_html}/>
                </Stack>
                </Stack>
              )} */}
            </Stack>
        </Stack>
      </CardContent>
    </Card>;
}
