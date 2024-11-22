import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { QueryClient, dehydrate, useQuery } from 'react-query';

import { Session } from '@/src/types';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import { Box, Chip, LinearProgress, Tab, Tabs, Typography } from '@mui/material';
//import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

/*
interface Props {
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const fetchDataAudiences = ()=>{
  return fetch(`/api/mailchimp/audiences`).then(res=>res.json()).then(json=>json.data.lists)
}

const fetchDataCampaigns = ()=>{
  return fetch(`/api/mailchimp/campaigns`).then(res=>res.json()).then(json=>json.data.campaigns)
}
const fetchDataAutomations = ()=>{
  return fetch(`/api/mailchimp/automations`).then(res=>res.json()).then(json=>json.data.automations)
}
const fetchDataMembers = async ()=>{
  return fetch(`/api/mailchimp/list/members`).then(res=>res.json()).then(json=>json.data.members)

}
const columnsMembers: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'full_name',
    headerName: 'Name',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.full_name,
  },
  {
    field: 'email_address',
    headerName: 'Email address',
    width: 200,
    renderCell(params) {
      return <a href={`mailto:${params.row.email_address}`}>{params.row.email_address}</a>
    },
  },
  
  {
    field: 'country_code',
    headerName: 'Country',
    width: 160,
    renderCell: (params) => params.row.location.country_code ? <Chip label={params.row.location.country_code} color="primary"/> : <></>,
  },
  {
    field:'avg_open_rate',
    headerName:'Avg open rate',
    width:300,
    renderCell(params) {
      return <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth:100,width: '100%', mr: 1 }}>
       <LinearProgress color={getRangeColor((params.row.stats.avg_open_rate||0)*100)} variant="determinate" value={(params.row.stats.avg_open_rate||0)*100} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${(params.row.stats.avg_open_rate||0)*100}%`}</Typography>
      </Box>
    </Box>
      
      
    },
  }
];
const columnsAudiences: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.full_name,
  },
];
const columnsCampaigns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.type,
  },
  {
    field: 'create_time',
    headerName: 'Create Time',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => params.row.create_time,

  },
];
const columnsAutomations: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.status,
  },
  {
    field: 'create_time',
    headerName: 'Create Time',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => params.row.create_time,

  },
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => params.row.settings.title,

  },
  {
    field: 'emails_sent',
    headerName: 'Emails sent',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => params.row.emails_sent,

  },
  {
    field: 'list_name',
    headerName: 'List name',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => params.row.recipients.list_name,

  },
];
const getRangeColor = (value:number)=>{
  if(value <= 25) return 'error'
  else if(value > 25 && value <= 75)return 'info'
  else return 'success'

}
const IndexPage: NextPage<Props> = (props) => {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const {data:audiences,isLoading:isLoadingAudiences} = useQuery(['audiences'],fetchDataAudiences)
  const {data:campaigns,isLoading:isLoadingCampaigns} = useQuery(['campaigns'],fetchDataCampaigns)
  const {data:automations,isLoading:isLoadingAutomations} = useQuery(['automations'],fetchDataAutomations)
  const {data:members,isLoading:isLoadingMembers} = useQuery(['members'],fetchDataMembers)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <SimpleLayout title="Posts list">
      <h1 style={{ marginBottom: '2rem' }}>Mailchimp elements</h1>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="members" {...a11yProps(0)} />
           <Tab label="audiences" {...a11yProps(1)} />
          <Tab label="campaigns" {...a11yProps(2)} />
          <Tab label="automations" {...a11yProps(3)} />
        </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
        {!isLoadingMembers
          ? <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={members}
            columns={columnsMembers}
            pageSize={20}
            rowsPerPageOptions={[20]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>
        : <></>
        }
        </TabPanel>

        <TabPanel value={value} index={1}>
        {!isLoadingAudiences 
          ? <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={audiences}
                columns={columnsAudiences}
                pageSize={20}
                rowsPerPageOptions={[20]}
                checkboxSelection
                disableSelectionOnClick
              />
            </Box>
            : <></>
        }        
        </TabPanel>
        <TabPanel value={value} index={2}>
        {!isLoadingCampaigns 
          ? <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={campaigns}
                columns={columnsCampaigns}
                pageSize={20}
                rowsPerPageOptions={[20]}
                checkboxSelection
                disableSelectionOnClick
              />
            </Box>
            : <></>
        }  
        </TabPanel>
        <TabPanel value={value} index={3}>
        {!isLoadingAutomations 
          ? <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={automations}
                columns={columnsAutomations}
                pageSize={20}
                rowsPerPageOptions={[20]}
                checkboxSelection
                disableSelectionOnClick
              />
            </Box>
            : <></>
        }  
        </TabPanel>
        
    </SimpleLayout>
  );
};


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as unknown as Session;
  
  if (session == null || !session.user.roles.includes('admin')) {
    return { notFound: true };
  }

  const qc = new QueryClient()
  const baseAPIPath = '/api/mailchimp'
  qc.prefetchQuery(['audiences'],()=>fetchDataAudiences())
  qc.prefetchQuery(['campaigns'],()=>fetchDataCampaigns())
  qc.prefetchQuery(['automations'],()=>fetchDataAutomations())
  qc.prefetchQuery(['members'],()=>fetchDataMembers())

  return {
    props: {
      dehydrateState:dehydrate(qc)
    },
  };
};

export default IndexPage;*/
