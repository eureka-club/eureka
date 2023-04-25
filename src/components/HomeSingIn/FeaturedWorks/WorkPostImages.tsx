import { FunctionComponent } from 'react';
import LocalImageComponent from '../../LocalImage';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { WorkMosaicItem } from '@/src/types/work';

interface Props {
  workId: number;
  workTitle: string;
  work:WorkMosaicItem;
}

const WorkPostImages: FunctionComponent<Props> = ({ work, workId, workTitle }) => {
  const router = useRouter();
  const { t } = useTranslation('featuredWorks');
  // const { data: posts } = useFeaturedWorksPostsImages(workId);
  const posts = work.posts;
  if (posts && posts.length) {
    return (
      <section className="d-flex flex-column">
        <h3 className="text-secondary fs-5 mb-2">{`${t("ImagesAbout")} ${workTitle}`}</h3>
        <div className="d-flex flex-wrap justify-content-center justify-content-xl-around">
          {posts.slice(0,4).map((post) => (
            <div className='cursor-pointer' key={post.id} onClick={() => router.push(`/work/${workId}/post/${post.id}`)}>
              <LocalImageComponent
                className="pe-xl-1"
                // filePath={post.storedFile}
                filePath={post.localImages[0].storedFile}
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
