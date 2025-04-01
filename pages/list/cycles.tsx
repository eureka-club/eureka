import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { QueryClient, dehydrate, useMutation } from 'react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DATE_FORMAT_HUMANIC_ADVANCED } from '../../src/constants';
import { Session } from '../../src/types';
import { advancedDayjs } from '../../src/lib/utils';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import LocalImageComponent from '../../src/components/LocalImage';
import useCycles, { getCycles } from '@/src/useCycles';
import { CycleSumary } from '@/src/types/cycle';
import { Box, Button, Popover, Table } from '@mui/material';
import { DeleteForever, DeleteOutline } from '@mui/icons-material';
import { IoEyeOutline } from 'react-icons/io5';


dayjs.extend(utc);
dayjs.extend(timezone);
interface Props {
  session:Session;
  
}

const ListCyclesPage: NextPage<Props> = ({ session }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const { mutate: execDeleteCycle, isSuccess: isDeleteCycleSucces } = useMutation(async (cycle: CycleSumary) => {
    const res = await fetch(`/api/cycle/${cycle.id}`, {
      method: 'delete',
    });
    const data = await res.json();

    return data;
  });

  const {data} = useCycles();
  const cycles = data?.cycles;

  const handleDeleteClick = (cycle: CycleSumary) => {
    execDeleteCycle(cycle);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    if (isDeleteCycleSucces === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteCycleSucces]);

  return (
    <SimpleLayout title="Cycles list">
      <h1 style={{ marginBottom: '2rem' }}>Cycles list</h1>

      {cycles ? <Table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>access</th>
            <th>title</th>
            <th>languages</th>
            <th>start date</th>
            <th>end date</th>
            <th>[actions]</th>
          </tr>
        </thead>
        <tbody>
          {cycles.map((cycle) => (
            <tr key={cycle.id}>
              <td>
                <LocalImageComponent
                  alt="cycle cover"
                  filePath={cycle.localImages[0].storedFile}
                  height={96}
                  width={96}
                  style={{ height: '96px', marginRight: '1rem' }}
                />
              </td>
              <td>{cycle.access}</td>
              <td>{cycle.title}</td>
              <td>{cycle.languages}</td>
              <td>{advancedDayjs(dayjs(cycle.startDate).format()).utc().format(DATE_FORMAT_HUMANIC_ADVANCED)}</td>
              <td>{advancedDayjs(dayjs(cycle.endDate).format()).utc().format(DATE_FORMAT_HUMANIC_ADVANCED)}</td>
              <td>
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <Link href={`/cycle/${cycle.id}`}>
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
                    <Button variant="contained" color="error" startIcon={<DeleteForever/>} onClick={() => handleDeleteClick(cycle)}>
                      confirm delete!!!
                    </Button>
                  </Popover>
                </Box>
                {/* <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  transition={false}
                  overlay={
                    <Popover id="confirmDelete">
                      <Popover.Body>
                        <Button variant="contained" color="error" onClick={() => handleDeleteClick(cycle)}>
                          confirm delete!!!
                        </Button>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button variant="text" className="ms-2">
                    delete?
                  </Button>
                </OverlayTrigger> */}
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
  const cyclesData = await getCycles(ctx.locale!,undefined);
  qc.prefetchQuery('list/cycles', () => cyclesData);


  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default ListCyclesPage;
