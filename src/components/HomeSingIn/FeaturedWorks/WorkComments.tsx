//import useFeaturedWorks from '@/src/useFeaturedWorks';
import { FunctionComponent } from 'react';
import { Row } from 'react-bootstrap';
import useHyvorComments from '@/src/useHyvorComments';
import LocalImageComponent from '../../LocalImage';
//import { Button, Container, Carousel } from 'react-bootstrap';
//import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/components/work/MosaicItem';

interface Props {
  workId: number;
  //workTitle: string;
}

const WorkComments: FunctionComponent<Props> = ({ workId }) => {

  const {data:comments}  = useHyvorComments(`work-${workId}`);
  console.log(comments, 'commentscomments');
  //const { data: imagesWorkPosts } = useFeaturedWorksPostsImages(workId);
  // const { t } = useTranslation('common');
  //console.log(imagesWorkPosts, 'work  imagesWorkPosts '); 
     if (comments && comments.length) {

    return (
      <section>
        {comments?.map((e, index) => (
         <div key={index} className="d-flex flex-wrap fs-6" dangerouslySetInnerHTML={{ __html: e.body }}>
          </div>
        ))}
      </section>
    );
     }
     else return <></>
};
export default WorkComments;
