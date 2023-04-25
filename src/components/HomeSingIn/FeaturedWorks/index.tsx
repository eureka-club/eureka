import useFeaturedWorks from '@/src/useFeaturedWorks';
import useFeaturedWorksPosts from '@/src/useFeaturedWorksPostsImages';
import { Button, Col,Row, Carousel } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/components/work/MosaicItem';
import WorkPostImages from './WorkPostImages';
import WorkComments from './WorkComments';
//import HyvorComments from '@/src/components/common/HyvorComments';

const FeaturedWorks = () => {
  const { data: dataFeaturedWorks } = useFeaturedWorks();
  const { t } = useTranslation('featuredWorks');
  if (dataFeaturedWorks && dataFeaturedWorks.works.length) {
    return (
      <section className=" mb-4">
        <h2 className="text-secondary fw-bold mb-2" style={{ fontSize: '1.5rem' }}>
          {t('FeaturedDiscussions')}
        </h2>
        <div className="d-flex justify-content-center">
          <Carousel
            //interval={3000}
            //variant="dark"
            slide={true}
            indicators={true}
            controls={false}
            style={{ width: '100%' }}
            //fade
          >
            {dataFeaturedWorks.works.map((work) => (
              <Carousel.Item key={work.id} className="">
                <Row className="d-flex flex-row w-100  bg-gray-very-light rounded-3 py-4 m-0  pe-0 pe-lg-3">
                  <Col xs={12}  xl={4} className="d-flex justify-content-center">
                    <MosaicItem
                      work={work}
                      workId={work.id}
                      showCreateEureka={true}
                      showSocialInteraction={true}
                      className="mb-4 mb-xl-0"
                      cacheKey={['WORK', work.id.toString()]}
                      size={'lg'}
                    />
                  </Col>
                  <Col xs={12} xl={8} className="d-flex flex-column">
                    <WorkPostImages work={work} workId={work.id} workTitle={work.title} />
                    <WorkComments workId={work.id} />
                  </Col>
                
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </section>
    );
  } else return <></>;
};
export default FeaturedWorks;
