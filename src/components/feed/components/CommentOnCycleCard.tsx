import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import {  Box, Button, Stack, Typography} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/cycle/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import { useRouter } from 'next/router';
import useCycleSumary from '@/src/useCycleSumary';
import { useLastNCommentsByPageId } from '../hooks/useLastNCommentsByPageId';
// import { useOnCycleCommentCreated } from '../../common/useOnCycleCommentCreated';
import Spinner from '../../Spinner';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import UserCommentDetail from './UserCommentDetail';

dayjs.extend(relativeTime);
interface Props extends CardProps {
  cycleId:number;
  page_id:number;
}

export default function CommentOnCycleCard(props:Props) {
  const{
    cycleId,
    page_id,
  }=props;
  const[lastComment,setlastComment]=React.useState<any>();
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:cycle}=useCycleSumary(cycleId);
  const{show}=useModalContext();
  const{data:session}=useSession();

  const {data,isLoading}=useLastNCommentsByPageId(page_id,1);
  React.useEffect(()=>{
    if(data?.length){
      console.log(data[0])
      setlastComment(data[0]);
    }
  },[data])

  // const{dispatch}=useOnCycleCommentCreated(cycleId);
  
  const handleExpandClick = () => {
    if(session?.user)
      router.push(`/cycle/${cycleId}?ht-comment-id=${lastComment?.id}`);
    else show(<SignInForm/>)
  };
  if(isLoading)return <Spinner/>;  

  
  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
    
      <CardHeader
          avatar={
            <>
                <UserAvatar 
                  userId={lastComment?.user.sso_id} 
                />
            </>
          }
          title={
            <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
              <Typography>
                <strong>{lastComment?.user.name} </strong>
                {t('commentOnCycleTitle')}
                <strong> {cycle?.title}</strong>
              </Typography>
              <Typography variant='caption' paddingRight={1.5}>{dayjs(lastComment?.created_at*1000).locale(lang).fromNow()}</Typography> 
            </Stack>
          }
          // subheader={
          //   lastComment?.parent ? dayjs(lastComment?.created_at*1000).locale(lang).fromNow() : ''
          // }
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={1}>
          <MosaicItem cycleId={cycleId} sx={{
            'img':{
              maxWidth:'250px'
            }
          }} hideFooter hideHeader/>
          <Box>
              <UserCommentDetail isFull={lastComment?.parent} comment={lastComment?.parent} 
              content={
                <>
                  <Box dangerouslySetInnerHTML={{__html:lastComment?.parent?.body_html}}/>
                  <UserCommentDetail comment={lastComment} 
                    content={
                      <Box dangerouslySetInnerHTML={{__html:lastComment?.body_html}}/>
                    }
                    isFull={lastComment?.parent}
                  />
                </>
              }
              />
                <Box display={'flex'} justifyContent={'center'}>
                  <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
                    {session?.user ? t('replyCommentLbl') : t('notSessionreplyCommentLbl')}
                  </Button>
                </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>;
}
