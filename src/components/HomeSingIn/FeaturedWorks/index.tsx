import useFeaturedWorks from '@/src/useFeaturedWorks';
import useFeaturedWorksPosts from '@/src/useFeaturedWorksPostsImages';
import { Button, Container, Carousel } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/components/work/MosaicItem';
import WorkPostImages from './WorkPostImages';
import WorkComments from './WorkComments';

const FeaturedWorks = () => {
  const { data: dataFeaturedWorks } = useFeaturedWorks();
  const { t } = useTranslation('common');

  if (dataFeaturedWorks && dataFeaturedWorks.works.length) {
    return (
      <section className="">
        <h2 className="text-secondary fw-bold mb-2"> Discusiones destacadas</h2>
        <div className="d-flex justify-content-center">
          <Carousel
            //interval={3000}
            variant="dark"
            slide={true}
            indicators={true}
            controls={false}
            style={{ width: '100%' }}
            //fade
          >
            {dataFeaturedWorks.works.map((work) => (
              <Carousel.Item key={work.id} className="px-2" style={{ height: '33rem' }}>
                <div className="d-flex flex-row w-100  border justify-content-around border-primary rounded-3 py-2 m-0   ">
                  <MosaicItem
                    work={work}
                    workId={work.id}
                    showCreateEureka={false}
                    className=""
                    cacheKey={['WORK', work.id.toString()]}
                    size={'lg'}
                  />
                  <div className="">
                    <WorkPostImages workId={work.id} workTitle={work.title} />
                    <section className="mt-2">
                      <h3 className="text-secondary fs-5 mb-1">{'Comentarios de nuestres usuaries'}</h3>
                    </section>
                    <WorkComments workId={work.id} />
                    <Button
                      className="ms-4 btn-eureka"
                      //onClick={handlerLogin} /*onClick={openSignInModal}*/
                    >
                      Participa
                    </Button>
                  </div>
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
