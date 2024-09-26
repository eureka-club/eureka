import { FunctionComponent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Prompt from '@/src/components/post/PostPrompt';
// import FeaturedCycles from './FeaturedCycles';
import FeaturedEurekas from './FeaturedEurekas';
import FeaturedWorks from '@/src/components/HomeNotSession/FeaturedWorks';
import FeaturedUsers from './FeaturedUsers';
import { Box, Grid, Stack, Typography } from '@mui/material';
import useTopics from '@/src/useTopics';
import { TagsLinks } from '../common/TagsLinks';
import { Feed } from '../feed';
import FeaturedCycles from './FeaturedCycles';
interface Props {
}
const HomeNotSession: FunctionComponent<Props> = ({}) => {
  const { t } = useTranslation('common');
  const{data:topics}=useTopics();
  const getTopicsBadgedLinks = () => {
    return <TagsLinks topics={topics??[]}/>
    //return <TagsInput className='d-flex flex-wrap' formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
  };

  return (
    <>
      <section className="w-100">
        <div className="pt-4">
          <Prompt redirect={true} showTitle={true} />
        </div>
      </section>

      <Grid container spacing={1} paddingTop={'3rem'}>
        <Grid item xs={12} md={3} position={'relative'}>
         <Stack gap={1}>
          <FeaturedCycles />
          <FeaturedWorks />

          <Box sx={{
            position:'sticky',
            top:'50px',
          }}>
            <Typography variant='h6' color={'secondary'}>{t('Trending topics')}{' '}</Typography>
            
            <aside className="mb-4">{getTopicsBadgedLinks()}</aside>
            <section className="mt-4">
              <FeaturedUsers />
            </section>
          </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          {/* <section className="ms-0 ms-lg-5"> */}
          <Stack gap={3}>
              <Feed/>
              {/* <FeaturedEurekas /> */}
              {/* <FeaturedCycles /> */}
          </Stack>
          {/* </section> */}
        </Grid>
      </Grid>
    </>
  );
}
export default HomeNotSession;
