import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import CreatePostForm from '@/src/components/forms/CreatePostForm';
import { Col } from 'react-bootstrap';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import Spinner from '@/components/common/Spinner';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Grid } from '@mui/material';

interface Props {
  notFound?: boolean;
}
const CreatePostPage: NextPage<Props> = ({ notFound }) => {
  const { t } = useTranslation('createPostForm');
  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (notFound) router.push('/login');
  }, [notFound]);

  if (!notFound)
    return (
      <SimpleLayout title={t('title')}>
        <ButtonsTopActions />
        <section className="mt-5">
          <h3 className="text-secondary fw-bold">{t('DoubtsAI')}</h3>
        </section>
        <Grid container direction={'row'} spacing={1} >
          <Grid item xs={12} md={2}>
            <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation">
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout1')}</p>
            </section>
            <section className="mt-4 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation">
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout2')}</p>
            </section>
            <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation">
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout3')}</p>
            </section>
            <section className="mt-4 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation">
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout4')}</p>
            </section>
            <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation">
              <p className="p-2 m-0 text-wrap text-center fs-6">{t('AIAbout5')}</p>
            </section>
          </Grid>
          <Grid item xs={12} md={10} marginTop={3}>
            {isLoadingSession ? (
              <Spinner />
            ) : (
              <>
                <CreatePostForm noModal params={query} />
              </>
            )}
          </Grid>
        </Grid>
      </SimpleLayout>
    );
  else
    return (
      <SimpleLayout title={t('title')}>
        <ButtonsTopActions />
        <Spinner />
      </SimpleLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session == null) {
    return { props: { notFound: true } };
  }

  return {
    props: {},
  };
};

export default CreatePostPage;
