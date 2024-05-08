import { Avatar, Stack } from "@mui/material";
import MenuAction from "./MenuAction";
import useTranslation from "next-translate/useTranslation";
import { Apps } from "@mui/icons-material";

export const AppsLinks = () => {
    const { t } = useTranslation('navbar');

    return <MenuAction key='TopicsLinks' label={
      <Stack justifyContent={'center'} alignItems={'center'} >
        <Avatar
          sx={{width:32,height:32,bgcolor:'var(--color-primary)'}} 
        >
          <Apps/>
        </Avatar>
      </Stack>
    }
     //title={t('Topics')}
    >
      <ul>
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </ul>
    </MenuAction>;
  };