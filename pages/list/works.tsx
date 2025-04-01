import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Box, Button, Popover, Table } from '@mui/material';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { QueryClient, useMutation, dehydrate } from 'react-query';
import { Session } from '@/src/types';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import LocalImageComponent from '@/src/components/LocalImage';
import useWorks, { getWorksSumary } from '@/src/useWorksSumary';
import { WorkSumary } from '@/src/types/work';
import { IoEyeOutline } from 'react-icons/io5';
import { DeleteForever, DeleteOutline } from '@mui/icons-material';
interface Props {
  // works: (Work & {
  //   localImages: LocalImage[];
  // })[];
  session:Session
}

const ListWorksPage: NextPage<Props> = ({ session }) => {
  const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
  
  const {data} = useWorks();
  const works = data?.works//.filter(x => x.ToCheck)

  const { mutate: execDeleteWork, isSuccess: isDeleteWorkSucces } = useMutation(async (work: WorkSumary) => {
    const res = await fetch(`/api/work/${work.id}`, {
      method: 'delete',
    });
    const data = await res.json();

    return data;
  });

  const handleDeleteClick = (work: WorkSumary) => {
    execDeleteWork(work);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isDeleteWorkSucces === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteWorkSucces]);

  return (
    <SimpleLayout title="Works library">
      <h1 style={{ marginBottom: '2rem' }}>Works library</h1>
      {works ?
      <Table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>type</th>
            <th>title</th>
            <th>author</th>
            <th>publication year</th>
            <th>[actions]</th>
          </tr>
        </thead>
        <tbody>
          {works.map((work) => (
            <tr key={work.id}>
              <td>
                <LocalImageComponent
                  alt="work cover"
                  height={96}
                  width={96}
                  filePath={work.localImages[0].storedFile}
                  style={{marginRight: '1rem' }}
                />
              </td>
              <td>{work.type}</td>
              <td>{work.title}</td>
              {/* <td>{work.author}</td>
              <td>{work.publicationYear && dayjs(work.publicationYear).format(DATE_FORMAT_ONLY_YEAR)}</td> */}
              <td>
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <Link href={`/work/${work?.id}`}>
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
                    <Button variant="contained" color="error" startIcon={<DeleteForever/>} onClick={() => handleDeleteClick(work)}>
                      confirm delete!!!
                    </Button>
                  </Popover>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      : <>...</>}
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
  const worksData = await getWorksSumary(ctx.locale!,undefined);
  qc.prefetchQuery('list/works', () => worksData);

  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default ListWorksPage;
