import Head from 'next/head';
import { FunctionComponent } from 'react';

const { NEXT_PUBLIC_SITE_NAME } = process.env;

interface Props {
  title?: string;
}

const withTitle = <P extends Props>(Component: FunctionComponent<P>) => {
  return function withTitleHoc(props: P): JSX.Element {
    const { title } = props;

    return (
      <>
        <Head>
          <title>{title == null ? NEXT_PUBLIC_SITE_NAME : `${title} · ${NEXT_PUBLIC_SITE_NAME}`}</title>
        </Head>

        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} />
      </>
    );
  };
};

export default withTitle;
