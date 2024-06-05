import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { ReactElement } from 'react';

export type TabPanelProps = {
    items:{
        label:string|React.ReactElement|ReactElement[];
        content:any;
    }[]
} & BoxProps;
export default function TabPanelBasic(props:TabPanelProps) {
    const{items}=props;
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

    const labels = items.map(i=>i.label);
    const contents = items.map(i=>i.content);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {/* {
                labels.map((label,idx)=><Tab label={label} key={`${label}-${idx}`} value={`${idx+1}`}/>)
            } */}
            <Tab value={'1'} label='1'/>
            <Tab value={'2'} label='2'/>
          </TabList>
        </Box>
        <TabPanel value={'1'}>{items[0].content}</TabPanel>
        <TabPanel value={'2'}>{items[1].content}</TabPanel>
        {/* {
            contents.map((c,idx)=><TabPanel value={value} key={`tab-content-${idx}`}>{c}</TabPanel>)
        } */}
      </TabContext>
    </Box>
  );
}
