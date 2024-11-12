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
import Skeleton from '../../Skeleton';
import {Skeleton as SkeletonMUI}  from '@mui/material';
import Link from 'next/link';

dayjs.extend(relativeTime);
interface Props extends CardProps {
  cycleId:number;
  page_id:number;
}

const CardTitle=({userName,cycleId,cycleTitle,createdAt,isLoadingComment,isLoadingCycle}:{userName?:string,cycleId:number,cycleTitle?:string,createdAt:string,isLoadingComment:boolean,isLoadingCycle:boolean})=>{
  const{t}=useTranslation('feed');

  return <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
    <Typography sx={{flex:1}}>
        {
          !isLoadingComment 
            ? <strong>{userName} </strong>
            : <SkeletonMUI variant="text" width={150} sx={{display:'inline-block'}} />
        }
        <span style={{padding:'0 .25rem'}}>{t('commentOnCycleTitle')}</span>
        {
         !isLoadingCycle
            ? <strong>
               <Link href={`/cycle/${cycleId}`}>{cycleTitle}</Link> 
              </strong>
            : <SkeletonMUI variant="text" width={240} sx={{display:'inline-block'}} />
        }
    </Typography>
    <Typography variant='caption' paddingRight={1.5}>{createdAt}</Typography>
  </Stack>;
}

export default function CommentOnCycleCard(props:Props) {
  const{
    cycleId,
    page_id,
  }=props;
  const[lastComment,setlastComment]=React.useState<any>();
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:cycle,isLoading:isLoadingCycle}=useCycleSumary(cycleId);
  const{show}=useModalContext();
  const{data:session}=useSession();

  const {data,isLoading:isLoadingComment}=useLastNCommentsByPageId(page_id,1);
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
  // if(isLoading)return <Skeleton type="card" />;  

  
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
            // <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
            //   <Typography sx={{flex:1}}>
            //     <strong>{lastComment?.user.name} </strong>
            //     {t('commentOnCycleTitle')}
            //     <strong> {cycle?.title}</strong>
            //   </Typography>
            //   <Typography variant='caption' paddingRight={1.5}>{dayjs(lastComment?.created_at*1000).locale(lang).fromNow()}</Typography> 
            // </Stack>
            <CardTitle 
              userName={lastComment?.user.name} 
              cycleId={cycleId} 
              cycleTitle={cycle?.title} 
              createdAt={dayjs(lastComment?.created_at*1000).locale(lang).fromNow()}
              isLoadingComment={isLoadingComment}
              isLoadingCycle={isLoadingCycle}
            />
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
          <Stack gap={3} sx={{width:'100%'}}>
            {
              isLoadingComment
                ? <Skeleton type="card" />
                :  <UserCommentDetail isFull={lastComment?.parent} comment={lastComment?.parent} 
                      body={
                        <>
                          {lastComment?.parent?.body_html ? <Box dangerouslySetInnerHTML={{__html:lastComment?.parent?.body_html}}/>:<></>}
                          <UserCommentDetail comment={lastComment}
                            sx={
                              lastComment?.parent 
                                ? {
                                  backgroundColor:'#dddddd85  ',
                                  borderRadius:'.5rem',
                                  padding:'1rem'
                                }
                                : {}
                            } 
                            body={
                              <Box dangerouslySetInnerHTML={{__html:lastComment?.body_html}}/>
                            }
                            isFull={lastComment?.parent}
                          />
                        </>
                      }
                    />
            }
            <Box display={'flex'} justifyContent={'center'}>
              <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
                {session?.user ? t('common:replyCommentLbl') : t('common:notSessionreplyCommentLbl')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>;
}
