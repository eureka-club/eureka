import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import CardContent, { CardContentProps } from '@mui/material/CardContent';
import CardActions, { CardActionsProps } from '@mui/material/CardActions';
import { Badge, Box, BoxProps, Button, Grid, Paper, Stack} from '@mui/material';
import HyvorComments from '../../common/HyvorComments';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import { CommentBankOutlined } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import { useOnCommentCreated } from '../../common/useOnCycleCommentCreated';
import MosaicItem from '@/src/components/post/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import usePostSumary from '@/src/usePostSumary';
import { Sumary } from '../common/Sumary';

interface Props extends CardProps {
  postId:number;
}
export default function PostOnCycleActivesCard(props:Props) {
  const{
    postId
  }=props;
  const{t}=useTranslation('common');
  const{data:post}=usePostSumary(postId);
  // const [expanded, setExpanded] = React.useState(false);
  // const{show}=useModalContext();
  // const{dispatch}=useOnCommentCreated(cycleId);
  // const{data:session}=useSession();
  // const handleExpandClick = () => {
  //   if(session?.user)
  //     setExpanded(!expanded);
  //   else show(<SignInForm/>)
  // };


  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
      <CardHeader
          avatar={
            <>
                <UserAvatar name={post?.creator.name!} userId={post?.creator.id!} image={post?.creator.image!} photos={post?.creator.photos!}/>
            </>
          }
          title={`${post?.title} on cycle: ${post?.cycles[0].title}`}
          subheader={`${t('by')}: ${post?.creator.name!}`}
      />
      <CardContent>
        <Stack direction={'row'} gap={2}>
            <MosaicItem postId={postId} sx={{
                            'img':{
                              maxWidth:'250px'
                            }
            }}/>
            <Box>
              <Sumary description={post?.contentText??''}/>
            </Box>
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
