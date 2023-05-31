import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import { QueryClient, dehydrate, useMutation } from 'react-query';

import { PostMosaicItem } from '@/src/types/post';
import { Session } from '@/src/types';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import LocalImageComponent from '@/src/components/LocalImage';
import { findAll } from '@/src/facades/post';
import usePosts, { getPosts } from '@/src/usePosts';

interface Props {
  session:Session;
}

const ListPostsPage: NextPage<Props> = ({ session }) => {
  const router = useRouter();
  const { mutate: execDeletePost, isSuccess: isDeletePostSuccess } = useMutation(async (post: PostMosaicItem) => {
    const res = await fetch(`/api/post/${post.id}`, {
      method: 'delete',
    });
    const data = await res.json();

    return data;
  });

  const {data} = usePosts();
  const posts = data?.posts;

  const handleDeleteClick = (post: PostMosaicItem) => {
    execDeletePost(post);
  };

  useEffect(() => {
    if (isDeletePostSuccess === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletePostSuccess]);

  return (
    <SimpleLayout title="Posts list">
      <h1 style={{ marginBottom: '2rem' }}>Posts list</h1>
      {posts?<Table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>is public?</th>
            <th>title</th>
            <th>language</th>
            <th>[actions]</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <LocalImageComponent
                  alt="post cover"
                  filePath={post.localImages[0].storedFile}
                  height={96}

                  style={{ height: '96px', marginRight: '1rem' }}
                />
              </td>
              <td>{JSON.stringify(post.isPublic)}</td>
              <td>{post.title}</td>
              <td>{post.language}</td>
              <td>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  transition={false}
                  overlay={
                    <Popover id="confirmDelete">
                      <Popover.Body>
                        <Button variant="danger" onClick={() => handleDeleteClick(post)}>
                          confirm delete!!!
                        </Button>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button variant="link" className="ms-2">
                    delete?
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>:<>...</>}
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as unknown as Session;
  if (session == null || !session.user.roles.includes('admin')) {
    return { notFound: true };
  }

  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  const qc = new QueryClient();
  const postsData = await getPosts(ctx.locale!,undefined, origin);
  qc.prefetchQuery('list/cycles', () => postsData);

  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default ListPostsPage;
