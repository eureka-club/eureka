import useFeaturedWorks from '@/src/useFeaturedWorks';
import useFeaturedWorksPosts from '@/src/useFeaturedWorksPostsImages';
import { Button, Container, Carousel } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/components/work/MosaicItem';
import WorkPostImages from './WorkPostImages';

const FeaturedWorks = () => {
  const { data: dataFeaturedWorks } = useFeaturedWorks();
  const { t } = useTranslation('common');

  if (dataFeaturedWorks && dataFeaturedWorks.works.length) {
    return (
      <section className="">
        <h2 className="text-secondary fw-bold mb-2"> Discusiones destacadas</h2>
        <div className="d-flex justify-content-center">
          <Carousel
            interval={3000}
            variant="dark"
            slide={true}
            indicators={true}
            controls={false}
            style={{ width: '100%' }}
            fade
          >
            {dataFeaturedWorks.works.map((work) => (
              <Carousel.Item key={work.id} className="px-2" style={{ height: '33rem' }}>
                <div className="d-flex flex-row w-100s  border border-primary rounded-3 p-4 m-0   ">
                  <MosaicItem
                    work={work}
                    workId={work.id}
                    className=""
                    cacheKey={['WORK', work.id.toString()]}
                    size={'lg'}
                  />
                  <WorkPostImages workId={work.id}/>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </section>
    );
  } else return <></>;

};
export default FeaturedWorks;
