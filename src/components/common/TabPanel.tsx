import { Box, BoxProps, Tab, Tabs } from "@mui/material"
import { ReactElement, useState } from "react";
import SwipeableViews from 'react-swipeable-views';

export type TabPanelProps = {
    items:{
        label:string|ReactElement|ReactElement[];
        content:any;
    }[]
} & BoxProps;
export const TabPanel = ({items,...otherProps}:TabPanelProps)=>{
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleChangeIndex = (index: number) => {
        setValue(index);
    };
    const labels = items.map(i=>i.label);
    const contents = items.map(i=>i.content);

    return <Box {...otherProps}>
        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="basic tabs example">
            {
                labels.map((label,idx)=><Tab label={label} key={`${label}-${idx}`} value={idx}/>)
            }
        </Tabs>
        <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
            {
                contents.map((c,idx)=><Box key={`tab-content-${idx}`}>{c}</Box>)
            }
            {/* <Box>{value==0 ? '0' : ''}</Box>
            <Box>{value==1 ? '1' : ''}</Box> */}
        </SwipeableViews>
    </Box>
}