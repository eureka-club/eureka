import { Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import { HiOutlineHashtag } from "react-icons/hi";
import useTranslation from "next-translate/useTranslation";
import { GiOpenBook } from "react-icons/gi";

export const TopicsLinks = () => {
    const { t } = useTranslation('navbar');

    const topics = ()=>[
        {label:`${t(`topics:gender-feminisms`)}`,link:`/search?q=${'gender-feminisms'}`},
        {label:`${t(`topics:technology`)}`,link:`/search?q=${'technology'}`},
        {label:`${t(`topics:environment`)}`,link:`/search?q=${'environment'}`},
        {label:`${t(`topics:racism-discrimination`)}`,link:`/search?q=${'racism-discrimination'}`},
        {label:`${t(`topics:wellness-sports`)}`,link:`/search?q=${'wellness-sports'}`},
        {label:`${t(`topics:social issues`)}`,link:`/search?q=${'social issues'}`},
        {label:`${t(`topics:politics-economics`)}`,link:`/search?q=${'politics-economics'}`},
        {label:`${t(`topics:philosophy`)}`,link:`/search?q=${'philosophy'}`},
        {label:`${t(`topics:migrants-refugees`)}`,link:`/search?q=${'migrants-refugees'}`},
        {label:`${t(`topics:introspection`)}`,link:`/search?q=${'introspection'}`},
        {label:`${t(`topics:sciences`)}`,link:`/search?q=${'sciences'}`},
        {label:`${t(`topics:arts-culture`)}`,link:`/search?q=${'arts-culture'}`},
        {label:`${t(`topics:history`)}`,link:`/search?q=${'history'}`},
      ];

    return <MenuAction key='TopicsLinks' items={topics()} label={
      <Stack justifyContent={'center'} alignItems={'center'} >
        {<GiOpenBook
          fontSize={'2rem'}
        /> }
        <Typography variant="caption" gutterBottom>
          {t('Topics')}
        </Typography>
      </Stack>
    }
     title={t('Topics')}
    />;
  };