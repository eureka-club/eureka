import MenuAction from "./MenuAction";
import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/react";
import { Button, Stack, Typography } from "@mui/material";
import { BiPlusCircle } from "react-icons/bi";
import { Menu } from "@mui/icons-material";

const UserAllowedOperationsLinks = ()=>{
    const { t } = useTranslation('navbar');
    const{data:session}=useSession();

    let operations:{label:string,link:string}[]=[];
    if(session?.user){
        operations=[
            ...operations,
            ...[
                {label:t('cycle'),link:'/cycle/create'},
                {label:t('post'),link:'/post/create'},
                {label:t('work'),link:'/work/create'},
            ]
        ];
    }
    return <MenuAction
        key='UserAllowedOperationsLinks' 
        // title={t('actions')}
        label={
            <Stack justifyContent={'center'} alignItems={'center'}>
                { <Menu sx={{fontSize:'2rem'}} /> }
                <Typography>
                {t('create')}
                </Typography>
            </Stack>
        }
        items={operations}
    />
}
export default UserAllowedOperationsLinks;