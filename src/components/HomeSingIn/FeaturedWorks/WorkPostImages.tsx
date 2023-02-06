//import useFeaturedWorks from '@/src/useFeaturedWorks';
import { FunctionComponent } from 'react';
import { Row } from 'react-bootstrap';
import useFeaturedWorksPostsImages from '@/src/useFeaturedWorksPostsImages';
import LocalImageComponent from '../../LocalImage';
//import { Button, Container, Carousel } from 'react-bootstrap';
//import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/components/work/MosaicItem';

interface Props {
  workId: number;
  workTitle: string;
}

const WorkPostImages: FunctionComponent<Props> = ({ workId, workTitle }) => {
  //const { data: dataFeaturedWorks } = useFeaturedWorks();
  const { data: imagesWorkPosts } = useFeaturedWorksPostsImages(workId);
  // const { t } = useTranslation('common');

  //console.log(imagesWorkPosts, 'work  imagesWorkPosts ');

  if (imagesWorkPosts && imagesWorkPosts.length) {
    return (
      <section>
        <h3 className="text-secondary fs-5 mb-1">{`Imagenes sobre ${workTitle}`}</h3>
        <div className="d-flex flex-row justify-content-between">
          {imagesWorkPosts.map((image) => (
            <LocalImageComponent
              key={image}
              className="pe-1"
              filePath={image}
              title=""
              alt=""
              height={150}
              width={150}
            />
          ))}
        </div>
      </section>
    );
  } else return <></>;
};
export default WorkPostImages;
