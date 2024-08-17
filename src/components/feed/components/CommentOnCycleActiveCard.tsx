import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, Stack, Typography} from '@mui/material';
import HyvorComments from '../../common/HyvorComments';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import { CommentBankOutlined } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/cycle/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import useCycleSumary from '@/src/useCycleSumary';
import { useOnCycleCommentCreated } from '../../common/useOnCycleCommentCreated';
import useUserSumary from '@/src/useUserSumary';
import { Sumary } from '../../common/Sumary';
import Link from 'next/link';
import { useRouter } from 'next/router';
interface Props extends CardProps {
  cycleId:number;
  userId:number;
  commentURL:string;
  commentText:string;
  createdAt:Date;
}
export default function CommentOnCycleActiveCard(props:Props) {
  const{
    cycleId,
    userId,
    commentURL,
    commentText,
    createdAt
  }=props;
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:cycle}=useCycleSumary(cycleId);
  const{data:user}=useUserSumary(userId);
  const [expanded, setExpanded] = React.useState(false);
  const{show}=useModalContext();
  const{dispatch}=useOnCycleCommentCreated(cycleId);
  const{data:session}=useSession();
  const handleExpandClick = () => {
    if(session?.user)
      router.push(commentURL);
      // setExpanded(!expanded);
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
              {t('commentOnCycleActiveTitle')}
              <strong> {cycle?.title}</strong>
            </Typography>
          }
          subheader={(new Date(createdAt!)).toLocaleDateString(lang)}
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={2}>
            <MosaicItem cycleId={cycleId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            <Stack alignItems={'baseline'} gap={2}>
              <Sumary description={commentText}/>
              <Button onClick={handleExpandClick}>
                  <CommentBankOutlined /> {t('replyCommentLbl')}
                </Button>
              {/* <Link href={commentURL}>Write a comment</Link> */}
            </Stack>
            {/* {
                session 
                ? <CardContent>
                    <HyvorComments 
                      entity='cycle' 
                      id={`${cycleId}`} 
                      session={session!}  
                      OnCommentCreated={(comment)=>dispatch(comment)}
                    />
                    </CardContent>
                : <></>
            } */}
        </Stack>
                    
      </CardContent>
      
      {/* <CardActions sx={{justifyContent:"end"}}>
          {
            !session
              ? <Button onClick={handleExpandClick}>
                  <CommentBankOutlined /> Escreva um comentario
                </Button>
              : <></>
          }
      </CardActions> */}
    </Card>;
}
