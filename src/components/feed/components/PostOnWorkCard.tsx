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
import MosaicItem from '@/src/components/post/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import usePostSumary from '@/src/usePostSumary';
import { Sumary } from '../../common/Sumary';
import { useOnPostCommentCreated } from '../../common/useOnPostCommentCreated';

interface Props extends CardProps {
  postId:number;
}
export default function PostOnWorkCard(props:Props) {
  const{
    postId
  }=props;
  const{t,lang}=useTranslation('feed');
  const{data:post}=usePostSumary(postId);
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
                <UserAvatar name={post?.creator.name!} userId={post?.creator.id!} image={post?.creator.image!} photos={post?.creator.photos!}/>
            </>
          }
          title={<Typography>
            <strong>{post?.creator.name!} </strong>
            {`${t('postOnWorkTitle')}`}
            <strong> {post?.works[0].title}</strong>
          </Typography>
        }
          subheader={(new Date(post?.createdAt!)).toLocaleDateString(lang)}
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={2}>
            <MosaicItem postId={postId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            <Stack gap={2}>
              <Typography>{post?.title}</Typography>
              <Sumary description={post?.contentText??''}/>
            </Stack>
        </Stack>
                    {
                        session 
                        ? <CardContent>
                            <HyvorComments 
                                entity='post' 
                                id={`${postId}`} 
                                session={session!}  
                                OnCommentCreated={(comment)=>dispatch(comment)}
                            />
                            </CardContent>
                        : <></>
                    }
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
