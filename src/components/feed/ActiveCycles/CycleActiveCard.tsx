import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import CardContent, { CardContentProps } from '@mui/material/CardContent';
import CardActions, { CardActionsProps } from '@mui/material/CardActions';
import { Badge, Box, BoxProps, Button, Grid, Paper, Stack} from '@mui/material';
import UserAvatar from '../../common/UserAvatar';
import HyvorComments from '../../common/HyvorComments';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import { CommentBankOutlined } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import { useOnCycleCommentCreated } from '../../common/useOnCycleCommentCreated';
import { Sumary } from '../common/Sumary';
import { StyledBadge } from '@/src/components/common/StyledBadge';
import MosaicItem from '@/src/components/cycle/MosaicItem';
import { LocalImage } from '@prisma/client';



interface Props extends CardProps {
  cycleId:number;
  description:string;
}
export default function CycleActiveCard(props:Props) {
  const{
    cycleId,description
  }=props;

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
      {/* <CardHeader
                    avatar={
                    <>
                        <UserAvatar name={creatorName} userId={creatorId} image={creatorImage} photo={creatorPhoto}/>
                    </>
                    }
                    action={
                        <StyledBadge/>
                    }
                    title={title}
                    subheader={subheader}
                /> */}
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={2}>
          <MosaicItem cycleId={cycleId}/>
          <Sumary description={description} />
        </Stack>
                    {/* <Grid container spacing={{xs:2}}>
                      <Grid item xs={12} sm={5} md={4}>
                              <MosaicItem cycleId={cycleId}/>
                      </Grid>
                      <Grid item xs={12} sm={7} md={8}>
                          <Sumary description={description} />
                      </Grid>
                    </Grid> */}
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
