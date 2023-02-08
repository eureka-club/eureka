import { FunctionComponent } from 'react';
import { Row } from 'react-bootstrap';
import useFeaturedWorksPostsImages from '@/src/useFeaturedWorksPostsImages';
import LocalImageComponent from '../../LocalImage';
import { useRouter } from 'next/router';
import MosaicItem from '@/components/work/MosaicItem';

interface Props {
  workId: number;
  workTitle: string;
}

const WorkPostImages: FunctionComponent<Props> = ({ workId, workTitle }) => {
  const router = useRouter();
  const { data: posts } = useFeaturedWorksPostsImages(workId);

  if (posts && posts.length) {
    return (
      <section className="d-flex flex-column">
        <h3 className="text-secondary fs-5 mb-2">{`Imagenes sobre ${workTitle}`}</h3>
        <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
          {posts.map((post) => (
            <div className='cursor-pointer' key={post.id} onClick={() => router.push(`/work/${workId}/post/${post.id}`)}>
              <LocalImageComponent
                className="pe-lg-1"
                filePath={post.storedFile}
                title=""
                alt=""
                height={150}
                width={150}
              />
            </div>
          ))}
        </div>
      </section>
    );
  } else return <></>;
};
export default WorkPostImages;
