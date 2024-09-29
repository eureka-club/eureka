import { Avatar, Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import useTranslation from "next-translate/useTranslation";

interface UserCommentDetailProps{
    comment:any;
    content:React.ReactNode;
    isFull?:boolean;
  }
  const UserCommentDetail:React.FC<UserCommentDetailProps> = ({comment,content,isFull=false})=>{
    const{lang}=useTranslation('feed');
    if(!comment ||!isFull)return <>{content}</>;
    return <Stack direction={'row'} gap={1}>
    <Stack gap={.5}>
      <Avatar src={comment?.user.picture_url} />
      <Box sx={{borderRight:'solid 1.5px #dddddd85',width:'16px',height:'100%'}}/>
    </Stack>
    <Stack>
      <Stack direction={{xs:'column',sm:'row'}} gap={{xs:0,sm:1}}>
        <Typography>{comment?.user.name}</Typography>
        <Typography variant='caption'>{dayjs(comment?.created_at*1000).locale(lang).fromNow()}</Typography>
      </Stack>
      {content}
    </Stack>
  </Stack>
  }
  export default UserCommentDetail;