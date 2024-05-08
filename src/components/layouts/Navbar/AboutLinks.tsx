import { Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import { AiOutlineInfoCircle } from "react-icons/ai";
import useTranslation from "next-translate/useTranslation";

export const AboutLinks = () => {
    const { t } = useTranslation('navbar');
    
    const aboutLinksInfo = [
        {label:t('Manifest'),link:`/manifest`},
        {label:t('About Eureka'),link:`/about`},
        {label:t('About Us'),link:`/aboutUs`},
        {label:t('policyText'),link:`/policy`},
      ]

    return <MenuAction items={aboutLinksInfo} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        { <AiOutlineInfoCircle fontSize={'2rem'} />}
       {<Typography variant="caption" gutterBottom>
         {t('')}
        </Typography>}
        
      </Stack>
    }
     //title={t('About')}
    />;
  };