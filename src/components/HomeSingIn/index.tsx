
import { FunctionComponent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import TagsInput from '@/components/forms/controls/TagsInput';
import Prompt from '@/src/components/post/PostPrompt';
import FeaturedCycles from './FeaturedCycles';
import FeaturedEurekas from './FeaturedEurekas';
import FeaturedWorks from '@/src/components/HomeSingIn/FeaturedWorks';
import FeaturedUsers from './FeaturedUsers';
import { Col } from 'react-bootstrap';

const topics = ['gender-feminisms', 'technology', 'environment',
  'racism-discrimination',
  'wellness-sports', 'social issues',
  'politics-economics', 'philosophy',
  'migrants-refugees', 'introspection',
  'sciences', 'arts-culture', 'history',
];

interface Props {
}

const HomeSingIn: FunctionComponent<Props> = ({}) => {
  const { t } = useTranslation('common');
  const getTopicsBadgedLinks = () => {
    return <TagsInput className='d-flex flex-wrap' formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
  };

  return (
    <>
      <section className="my-5 w-100">
        <div className="pt-4">
          <Prompt redirect={true} showTitle={true} />
        </div>
      </section>
      <section className="d-flex flex-column flex-lg-row">
        <Col xs={12} lg={2} className="me-2">
          <h2 className="text-secondary fw-bold">{t('Trending topics')}</h2>
          <aside className="mb-4">{getTopicsBadgedLinks()}</aside>
          <section className="mt-4">
            <FeaturedUsers />
          </section>
        </Col>
        <Col xs={12} lg={10} className="mt-5 mt-lg-0">
          <section className="ms-0 ms-lg-5">
            <FeaturedWorks />
            <FeaturedEurekas />
            <FeaturedCycles />
          </section>
        </Col>
      </section>
    </>
  );
}
export default HomeSingIn;
