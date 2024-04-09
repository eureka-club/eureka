import { TopicItem } from "@/src/useTopics";
import { Avatar, Chip } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export const TagsLinks = ({topics}:{topics:TopicItem[]})=>{
    const { t } = useTranslation('common');
    return <>{
      topics?.map(topic=>{
        if(!topic.code)return <></>;
        const label = t(`topics:${topic.code}`)??topic.code;
        return <Link key={topic.code} href={`/search?q=${topic.code}`}  data-cy="tag">
        <Chip 
          variant="outlined"
          size='small'
          // label={<small>{topic.emoji} {}</small>}
          label={label}
          avatar={<Avatar>{topic.emoji??label[0]}</Avatar>}
          sx={{
            cursor:'pointer',
            background: 'color-mix(in srgb, var(--color-secondary) 50%, transparent)',
            color:'black',
            transition:'background 1s',
            '&:hover':{
              'svg':{
                color:'white',
              },
              color:'white',
              background: 'var(--color-secondary)!important',
            }
          }}
        />
      </Link>
      }
      )
    }</>
  }