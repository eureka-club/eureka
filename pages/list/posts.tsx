import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Box, Button, Popover, Table } from '@mui/material';
import { QueryClient, dehydrate, useMutation } from 'react-query';
import { PostDetail } from '@/src/types/post';
import { Session } from '@/src/types';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import LocalImageComponent from '@/src/components/LocalImage';
import usePosts, { getPosts } from '@/src/usePosts';
import Link from 'next/link';
import { IoEyeOutline } from 'react-icons/io5';
import { DeleteForever, DeleteOutline } from '@mui/icons-material';

interface Props {
  session:Session;
}

const ListPostsPage: NextPage<Props> = ({ session }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const { mutate: execDeletePost, isSuccess: isDeletePostSuccess } = useMutation(async (post: PostDetail) => {
    const res = await fetch(`/api/post/${post.id}`, {
      method: 'delete',
    });
    const data = await res.json();

    return data;
  });

  const {data} = usePosts();
  const posts = data?.posts;console.log('posts ',posts)

  const handleDeleteClick = (post: PostDetail) => {
    execDeletePost(post);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClose = () => {
    setAnchorEl(null);
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
            <th>parent</th>
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
                  width={96}
                  style={{ height: '96px', marginRight: '1rem' }}
                />
              </td>
              <td>{JSON.stringify(post.isPublic)}</td>
              <td>{post.title}</td>
              <td>{`${post.works.length?'WORK':post.cycles.length?'CYCLE':'-'}`}</td>
              <td>{post.language}</td>
              <td>
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <Link href={`/${post?.cycles.length
                    ? `cycle/${post?.cycles[0].id}`
                    : post?.works.length
                      ? `work/${post?.works[0].id}`
                      : '#'
                    }/post/${post?.id}`
                    }>
                    <Button variant='contained' color='primary' startIcon={<IoEyeOutline />}>detail</Button>
                  </Link>
                  <Button variant='contained' color='error' startIcon={<DeleteOutline/>}
                    onClick={(event:any) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >delete</Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    elevation={1}
                  >
                    <Button variant="contained" color="error" startIcon={<DeleteForever/>} onClick={() => handleDeleteClick(post)}>
                      confirm delete!!!
                    </Button>
                  </Popover>
                </Box>
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
  const postsData = await getPosts(ctx.locale!,undefined);
  qc.prefetchQuery('list/cycles', () => postsData);

  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default ListPostsPage;
