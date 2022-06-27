import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Container from 'react-bootstrap/Container';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TagsInput from '../src/components/forms/controls/TagsInput';

//import SignInForm from '../src/components/forms/SignInForm';

const ExplorePage: NextPage = () => {
  const { t } = useTranslation('common');
  const [topics /* , setHide */] = useState<string[]>([
    'gender-feminisms', 'technology', 'environment','racism-discrimination','wellness-sports', 'social issues',
    'politics-economics', 'philosophy', 'migrants-refugees', 'introspection', 'sciences', 'arts-culture', 'history',
  ]);

  const getTopicsBadgedLinks = () => {
    return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
  };

  return (
    <>
    <SimpleLayout showCustomBaner={true} title={t('Explore')}>
       <h1 className="text-secondary fw-bold mt-5">{t('ExploreTopics')}</h1>
      <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
    </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session != null) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return { props: {} };
};

export default ExplorePage;
