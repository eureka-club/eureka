import * as React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Box, Button, Stack, Typography} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/src/components/work/MosaicItem';
import UserAvatar from '../../common/UserAvatar';
import { useRouter } from 'next/router';
import useWorkSumary from '@/src/useWorkSumary';
import { useLastNCommentsByPageId } from '../hooks/useLastNCommentsByPageId';
// import { useOnWorkCommentCreated } from '../../common/useOnWorkCommentCreated';
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

// import HyvorComments from '../../common/HyvorComments';
interface Props extends CardProps {
  workId:number;
  // userId:number;
  // commentURL:string;
  // commentText:string;
  page_id:number;
  // createdAt:Date;
}

const CardTitle=({userName,workId,workTitle,createdAt,isLoadingComment,isLoadingWork}:{userName?:string,workId:number,workTitle?:string,createdAt:string,isLoadingComment:boolean,isLoadingWork:boolean})=>{
  const{t}=useTranslation('feed');

  return <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
    <Typography sx={{flex:1}}>
        {
          !isLoadingComment 
            ? <strong>{userName} </strong>
            : <SkeletonMUI variant="text" width={150} sx={{display:'inline-block'}} />
        }
        <span style={{padding:'0 .25rem'}}>{t('commentOnWorkTitle')}</span>
        {
         !isLoadingWork
            ? <strong>
               <Link href={`/work/${workId}`}>{workTitle}</Link> 
              </strong>
            : <SkeletonMUI variant="text" width={240} sx={{display:'inline-block'}} />
        }
    </Typography>
    <Typography variant='caption' paddingRight={1.5}>{createdAt}</Typography>
  </Stack>;
}


export default function CommentOnWorkCard(props:Props) {
  const{
    workId,
    // userId,
    // commentURL,
    // commentText,
    page_id,
    // createdAt
  }=props;
  ///cycle/29?ht-comment-id=15934922
  const[lastComment,setlastComment]=React.useState<any>();
  const{t,lang}=useTranslation('feed');
  const router=useRouter();
  const{data:work,isLoading:isLoadingWork}=useWorkSumary(workId);
  // const{data:user}=useUserSumary(userId);
  const{show}=useModalContext();
  const{data:session}=useSession();

  const {data,isLoading:isLoadingComment}=useLastNCommentsByPageId(page_id,1);
  React.useEffect(()=>{
    if(data?.length){
      setlastComment(data[0]);
    }
  },[data])

  // const{dispatch}=useOnWorkCommentCreated(workId);
  
  const handleExpandClick = () => {
    if(session?.user)
      router.push(`/work/${workId}?ht-comment-id=${lastComment?.id}`);
    else show(<SignInForm/>)
  };
  // if(isLoading)return <Skeleton type="card" />;  

  
  return <Card sx={{width:{xs:'auto'}}} elevation={1}>
    
      <CardHeader
          avatar={
            <>
                <UserAvatar 
                  // name={lastComment?.user.name} 
                  userId={lastComment?.user.sso_id} 
                  // image={lastComment?.user.picture_url} 
                  // photos={[]}
                />
            </>
          }
          title={
            <CardTitle 
              userName={lastComment?.user.name} 
              workId={work?.id!} 
              workTitle={work?.title} 
              createdAt={dayjs(lastComment?.created_at*1000).locale(lang).fromNow()} 
              isLoadingComment={isLoadingComment}
              isLoadingWork={isLoadingWork}
            />
            // <Stack direction={{xs:'column',md:'row'}} justifyContent={'space-between'}>
            //   <Typography sx={{flex:1}}>
            //     <strong>{lastComment?.user.name} </strong>
            //     {t('commentOnWorkTitle')}
            //     <strong> {work?.title}</strong>
            //   </Typography>
            //   <Typography variant='caption' paddingRight={1.5}>{dayjs(lastComment?.created_at*1000).locale(lang).fromNow()}</Typography>
            // </Stack>
          }
          // subheader={
          //   lastComment?.parent ? dayjs(lastComment?.created_at*1000).locale(lang).fromNow() : ''
          // }
      />
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} gap={1}>
          <MosaicItem workId={workId} sx={{
            'img':{
              maxWidth:'250px'
            }
          }}/>
          <Stack gap={3} sx={{width:'100%'}}>
            {
              isLoadingComment 
                ? <Skeleton type="card" />
                : <UserCommentDetail isFull={lastComment?.parent} comment={lastComment?.parent} 
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
        {/* <Stack direction={'row'} gap={1}>
          <Stack>
            <UserAvatar 
              userId={lastComment?.parent?.user.sso_id} 
              size='small'
            />
            <Box sx={{borderRight:'solid 1px #ebe8e8',width:'16px',height:'100%'}}/>
          </Stack>
          <Stack>
            <Stack direction={{xs:'column',sm:'row'}} gap={{xs:0,sm:1}}>
              <Typography>{lastComment?.parent?.user.name}</Typography>
              <Typography variant='caption'>{dayjs(lastComment?.parent?.created_at*1000).locale(lang).fromNow()}</Typography>
            </Stack>
            <Box dangerouslySetInnerHTML={{__html:lastComment?.parent?.body_html}}/>
            
          </Stack>
        </Stack> */}
        {/* <Stack direction={{xs:'column',sm:'row'}} gap={2}>
            <MosaicItem workId={workId} sx={{
              'img':{
                maxWidth:'250px'
              }
            }}/>
            <Stack alignItems={'baseline'} gap={2}>
              {
                lastComment?.parent 
                  ? <Stack>
                      <Stack direction={'row'} gap={1}>
                        <UserAvatar 
                          userId={lastComment?.parent?.user.sso_id} 
                          size='small'
                        />
                        <Stack direction={{xs:'column',sm:'row'}} gap={1}>
                          <Typography>{lastComment?.parent?.user.name}</Typography>
                          <Typography variant='caption'>{dayjs(lastComment?.parent?.created_at*1000).locale(lang).fromNow()}</Typography>
                        </Stack>
                      </Stack>
                      <Stack direction={'row'} gap={3}>
                        <Box sx={{borderRight:'solid 1px #ebe8e8',width:'16px'}}/>
                        <Box>
                          <Box dangerouslySetInnerHTML={{__html:lastComment?.parent?.body_html}}/>
                          <Stack direction={'row'} gap={1}>
                            <UserAvatar 
                              userId={lastComment?.user.sso_id} 
                              size='small'
                            />
                            <Stack direction={{xs:'column',sm:'row'}} gap={1}>
                              <Typography>{lastComment?.user.name}</Typography>
                              <Typography variant='caption'>{dayjs(lastComment.created_at*1000).locale(lang).fromNow()}</Typography>
                            </Stack>
                          </Stack>
                          <Stack direction={'row'}>
                            <Box sx={{borderRight:'solid 1px #ebe8e8',width:'16px'}}/>
                            <Box paddingLeft={3} dangerouslySetInnerHTML={{__html:lastComment?.body_html}}/>
                          </Stack>
                        </Box>
                      </Stack>
                  </Stack>
                  :  <Sumary description={lastComment?.body_html}/>
              }
              <Stack justifyContent={'center'}>
                <Button onClick={handleExpandClick} variant='outlined' sx={{textTransform:'none'}}>
                  {session?.user ? t('replyCommentLbl') : t('notSessionreplyCommentLbl')}
                </Button>
              </Stack>
            </Stack>
        </Stack> */}
      </CardContent>
    </Card>;
}
