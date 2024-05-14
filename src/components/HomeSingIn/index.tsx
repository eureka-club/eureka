import { FunctionComponent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Prompt from '@/src/components/post/PostPrompt';
import FeaturedCycles from './FeaturedCycles';
import FeaturedEurekas from './FeaturedEurekas';
import FeaturedWorks from '@/src/components/HomeSingIn/FeaturedWorks';
import FeaturedUsers from './FeaturedUsers';
import { Grid, Typography } from '@mui/material';
import useTopics from '@/src/useTopics';
import { TagsLinks } from '../common/TagsLinks';
interface Props {
}
const HomeSingIn: FunctionComponent<Props> = ({}) => {
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
        <Grid item xs={12} md={3}>
          <Typography variant='h6' color={'secondary'}>{t('Trending topics')}{' '}</Typography>
          {/* <h2 className="text-secondary fw-bold">{t('Trending topics')}</h2> */}
          <aside className="mb-4">{getTopicsBadgedLinks()}</aside>
          <section className="mt-4">
            <FeaturedUsers />
          </section>
        </Grid>
        <Grid item xs={12} md={9}>
          <section className="ms-0 ms-lg-5">
            <FeaturedWorks />
            <FeaturedEurekas />
            <FeaturedCycles />
          </section>
        </Grid>
      </Grid>
    </>
  );
}
export default HomeSingIn;
