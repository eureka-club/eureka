import { Button } from "@mui/material";
import { FC } from "react";
import {Grid} from '@mui/material'

interface Props {
    label:string;
}   
const BuySubscriptionButton:FC<Props> = ({label}) => { 
    const onClickHandle = (e:any) => {

    };   
    return (
        <Grid paddingBlockEnd={2} paddingLeft={2} paddingRight={2} >
        <Button 
            
            variant="contained"
            color="primary"
            size="large"
            onClick={onClickHandle}
        >
            {label}
        </Button>
        </Grid>
    );
}
export default BuySubscriptionButton;