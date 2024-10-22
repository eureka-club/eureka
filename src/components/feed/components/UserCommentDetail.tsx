import { Avatar, Box, BoxProps, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import useTranslation from "next-translate/useTranslation";

interface UserCommentDetailProps extends BoxProps {
    comment:any;
    body:React.ReactNode;
    isFull?:boolean;
  }
  const UserCommentDetail:React.FC<UserCommentDetailProps> = ({comment,body,isFull=false,...others})=>{
    const{lang}=useTranslation('feed');
    if(!comment ||!isFull)return <>{body}</>;
    return <Box {...others}>
      <Stack direction={'row'} gap={1}>
        <Stack gap={.5}>
          <Avatar src={comment?.user.picture_url} />
          <Box sx={{borderRight:'solid 1.5px #dddddd85',width:'16px',height:'100%'}}/>
        </Stack>
        <Stack>
          <Stack direction={{xs:'column',sm:'row'}} gap={{xs:0,sm:1}}>
            <Typography>{comment?.user.name}</Typography>
            <Typography variant='caption'>{dayjs(comment?.created_at*1000).locale(lang).fromNow()}</Typography>
          </Stack>
          {body}
        </Stack>
      </Stack>

    </Box> 
  }
  export default UserCommentDetail;