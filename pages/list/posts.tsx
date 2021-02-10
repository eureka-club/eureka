import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import PopoverContent from 'react-bootstrap/PopoverContent';
import Table from 'react-bootstrap/Table';
import { useMutation } from 'react-query';

import { PostWithImages } from '../../src/types/post';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import LocalImageComponent from '../../src/components/LocalImage';
import { findAll } from '../../src/facades/post';

interface Props {
  posts: PostWithImages[];
}

const ListPostsPage: NextPage<Props> = ({ posts }) => {
  const router = useRouter();
  const { mutate: execDeletePost, isSuccess: isDeletePostSucces } = useMutation(async (post: PostWithImages) => {
    const res = await fetch(`/api/post/${post.id}`, {
      method: 'delete',
    });
    const data = await res.json();

    return data;
  });

  const handleDeleteClick = (post: PostWithImages) => {
    execDeletePost(post);
  };

  useEffect(() => {
    if (isDeletePostSucces === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletePostSucces]);

  return (
    <SimpleLayout title="Posts list">
      <h1 style={{ marginBottom: '2rem' }}>Posts list</h1>

      <Table>
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
                      <PopoverContent>
                        <Button variant="danger" onClick={() => handleDeleteClick(post)}>
                          confirm delete!!!
                        </Button>
                      </PopoverContent>
                    </Popover>
                  }
                >
                  <Button variant="link" className="ml-2">
                    delete?
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await findAll();

  return {
    props: {
      posts,
    },
  };
};

export default ListPostsPage;
