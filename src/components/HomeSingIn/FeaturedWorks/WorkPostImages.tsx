//import useFeaturedWorks from '@/src/useFeaturedWorks';
import { FunctionComponent} from 'react';
import useFeaturedWorksPostsImages from '@/src/useFeaturedWorksPostsImages';

//import { Button, Container, Carousel } from 'react-bootstrap';
//import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/components/work/MosaicItem';

interface Props {
  workId: number;
}

const WorkPostImages: FunctionComponent<Props> = ({ workId }) => {
  //const { data: dataFeaturedWorks } = useFeaturedWorks();
  const { data: imagesWorkPosts } = useFeaturedWorksPostsImages(workId);
  // const { t } = useTranslation('common');

  console.log(imagesWorkPosts, 'work  imagesWorkPosts ');

  if (imagesWorkPosts && imagesWorkPosts.length) {
    return (
      <section className="border">
        {imagesWorkPosts.map((image) => (
          <p key={image}>{image}</p>
        ))}
      </section>
    );
  } else return <></>;
};
export default WorkPostImages;
