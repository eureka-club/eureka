import { Box, BoxProps, Tab, Tabs } from "@mui/material"
import { ReactElement, useState } from "react";
import SwipeableViews from 'react-swipeable-views';

export type TabPanelProps = {
    items:{
        label:string|ReactElement|ReactElement[];
        content:any;
    }[];
    indexActive:number
} & BoxProps;
export const TabPanelSwipeableViews = ({items,indexActive,...otherProps}:TabPanelProps)=>{
    const [value, setValue] = useState(indexActive??0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleChangeIndex = (index: number) => {
        setValue(index);
    };
    const labels = items.map(i=>i.label);
    const contents = items.map(i=>i.content);

    return <Box {...otherProps} className='tabPanelCtr'>
        <style jsx global>{`
            .tabPanelCtr{
                & button{
                    border-bottom:solid 1px var(--color-primary);
                }
                & button.Mui-selected {
                    background:var(--color-primary);
                    color:white;
                }
            }
        `}</style>
        <Tabs variant='scrollable' scrollButtons allowScrollButtonsMobile value={value} onChange={handleChange} aria-label="basic tabs example">
            {
                labels.map((label,idx)=><Tab label={label} key={`${label}-${idx}`} value={idx} sx={{fontSize:'1rem'}}/>)
            }
        </Tabs>
        <SwipeableViews style={{paddingTop:'1rem'}} index={value} onChangeIndex={handleChangeIndex}>
            {
                contents.map((c,idx)=><Box key={`tab-content-${idx}`}>{c}</Box>)
            }
            {/* <Box>{value==0 ? '0' : ''}</Box>
            <Box>{value==1 ? '1' : ''}</Box> */}
        </SwipeableViews>
    </Box>
}