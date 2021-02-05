import { GetServerSideProps, NextPage } from 'next';

import SimpleLayout from '../src/components/layouts/SimpleLayout';

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout title="Welcome">
      <h1>Hello</h1>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default IndexPage;
