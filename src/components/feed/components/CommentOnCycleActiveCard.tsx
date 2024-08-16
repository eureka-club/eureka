import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, Stack} from '@mui/material';
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
interface Props extends CardProps {
  cycleId:number;
  userId:number;
  commentURL:string;
  createdAt:Date;
}
export default function CommentOnCycleActiveCard(props:Props) {
  const{
    cycleId,
    userId,
    commentURL,
    createdAt
  }=props;
  const{t,lang}=useTranslation('common');
  const{data:cycle}=useCycleSumary(cycleId);
  const{data:user}=useUserSumary(userId);
  const [expanded, setExpanded] = React.useState(false);
  const{show}=useModalContext();
  const{dispatch}=useOnCycleCommentCreated(cycleId);
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
                <UserAvatar name={user?.name!} userId={userId} image={user?.image!} photos={user?.photos!}/>
            </>
          }
          title={`Comment created ${t('feed:on cycle')}: ${cycle?.title}`}
          subheader={`${t('by')}: ${user?.name!} ${t('feed:on')}: ${(new Date(createdAt!)).toLocaleDateString(lang)}`}
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={2}>
            <MosaicItem cycleId={cycleId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            {
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
            }
        </Stack>
                    
      </CardContent>
      
      <CardActions sx={{justifyContent:"end"}}>
          {
            !session
              ? <Button onClick={handleExpandClick}>
                  <CommentBankOutlined /> Escreva um comentario
                </Button>
              : <></>
          }
      </CardActions>
    </Card>;
}
